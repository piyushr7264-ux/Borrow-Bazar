async function saveProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  const name = document.getElementById("name").value;
  const college = document.getElementById("college") ? document.getElementById("college").value : "";
  const file = document.getElementById("photo").files[0];

  if (!name) {
    alert("Please enter your name");
    return;
  }

  const updateData = { name, college };

  if (file) {
    const reader = new FileReader();
    reader.onload = async function () {
      updateData.profile_pic = reader.result;
      await sendUpdate(updateData, token);
    };
    reader.readAsDataURL(file);
  } else {
    await sendUpdate(updateData, token);
  }
}

async function sendUpdate(data, token) {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Profile updated successfully!");
      window.location.href = "dashboard.html";
    } else {
      const errData = await response.json();
      alert(errData.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    alert("An error occurred while updating profile.");
  }
}

// Load current data if available
window.onload = async function() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const user = await response.json();
      document.getElementById("name").value = user.name || "";
      if (document.getElementById("college")) {
        document.getElementById("college").value = user.college || "";
      }
    }
  } catch (err) {
    console.error("Load profile error:", err);
  }
}
