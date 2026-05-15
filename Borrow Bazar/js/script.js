let cart = JSON.parse(localStorage.getItem("cart")) || []

// Smart API URL: Use relative path if on port 3000, otherwise point to localhost:3000
const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

function updateCartCounter() {
    let cartLink = document.getElementById("cartCount")
    if (cartLink) {
        cartLink.innerText = `Cart (${cart.length})`
    }
}

function checkSession() {
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");
    
    if (token) {
        if (loginLink) {
            loginLink.innerText = "Dashboard";
            loginLink.href = "dashboard.html";
            loginLink.classList.add("nav-btn");
        }
        if (logoutLink) {
            logoutLink.style.display = "inline-block";
            logoutLink.classList.add("nav-btn", "logout-btn");
        }
    } else {
        if (loginLink) {
            loginLink.innerText = "Login";
            loginLink.href = "login.html";
            loginLink.classList.add("nav-btn");
        }
        if (logoutLink) {
            logoutLink.style.display = "none";
        }
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// Add Enter key support for search
function setupSearch() {
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchProducts();
            }
        });
    }
}

function init() {
    updateCartCounter();
    checkSession();
    setupSearch();
    
    // Auto-load products if we are on a page that has the products section
    if (document.getElementById("products")) {
        showProducts('');
    }
}

// Run init when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function showProducts(type) {
    fetch(`${API_URL}/products?category=${type}`)
        .then(res => res.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(err => console.error("Error fetching products:", err));
}

function displayProducts(list) {
    let section = document.getElementById("products")
    if (!section) return;
    section.innerHTML = ""

    if (list.length === 0) {
        section.innerHTML = "<p style='color:white;text-align:center;width:100%'>No products found.</p>";
        return;
    }

    list.forEach(p => {
        const badgeColor = p.type === 'rent' ? '#28a745' : '#ff758c';
        // Escape quotes for the onclick handler
        const safeName = p.name.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const safeImg = (p.img || 'images/logo.jpg').replace(/'/g, "\\'");
        
        section.innerHTML += `
<div class="product" style="position:relative">
    <span style="position:absolute; top:10px; right:10px; background:${badgeColor}; color:white; padding:2px 8px; border-radius:10px; font-size:12px; font-weight:bold; text-transform:uppercase;">
        ${p.type || 'buy'}
    </span>
    <img src="${p.img || 'images/logo.jpg'}" alt="${p.name}" loading="lazy">
    <h3>${p.name}</h3>
    <p>₹${p.price}</p>
    <button onclick="addToCart('${safeName}', ${p.price}, '${safeImg}')">
        Add To Cart
    </button>
</div>
`
    })
}

function addToCart(name, price, img) {
    cart.push({ name, price, img })
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCounter()
    alert("Added to cart")
}

function searchProducts() {
    let input = document.getElementById("search").value.trim().toLowerCase()
    if (!input) {
        showProducts('');
        return;
    }
    fetch(`${API_URL}/products?q=${encodeURIComponent(input)}`)
        .then(res => res.json())
        .then(data => {
            displayProducts(data)
        })
        .catch(err => console.error("Search error:", err));
}
