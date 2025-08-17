// Simple localStorage-based auth system for PlayToStudy

// Save new user
function signUpUser(event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirm").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Check if user exists
  if (localStorage.getItem(email)) {
    alert("User already exists! Please sign in.");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem(email, JSON.stringify(user));
  alert("Sign Up successful! You can now sign in.");
  window.location.href = "signin.html";
}

// Login user
function signInUser(event) {
  event.preventDefault();

  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  const user = JSON.parse(localStorage.getItem(email));

  if (user && user.password === password) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful! Welcome " + user.name);
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password!");
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  alert("You have logged out.");
  window.location.href = "signin.html";
}

// Show welcome message if logged in
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    const welcomeBox = document.getElementById("welcomeUser");
    if (welcomeBox) {
      welcomeBox.innerHTML = `👋 Welcome, <b>${user.name}</b> 
        <button class="btn btn-sm btn-danger ms-2" onclick="logoutUser()">Logout</button>`;
    }
  }
}

// 🚨 Protect restricted pages
function protectPage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please sign in to access this page.");
    window.location.href = "signin.html";
  }
}
