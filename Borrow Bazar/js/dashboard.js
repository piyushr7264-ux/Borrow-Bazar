window.onload = async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const user = await response.json();
      document.getElementById("userName").innerText = user.name;
      if (user.profile_pic) {
        document.getElementById("profilePic").src = user.profile_pic;
      } else {
        document.getElementById("profilePic").src = "images/logo.jpg"; // fallback
      }
    } else {
      localStorage.clear();
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Dashboard load error:", err);
    alert("Error loading dashboard data.");
  }
};
