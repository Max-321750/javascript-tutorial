  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB2DSsGhEIxTe1PsoGaMuQxhoqSYZqba2Y",
    authDomain: "firstfirebaselesson-845ec.firebaseapp.com",
    projectId: "firstfirebaselesson-845ec",
    storageBucket: "firstfirebaselesson-845ec.firebasestorage.app",
    messagingSenderId: "147201561974",
    appId: "1:147201561974:web:7be8905a4aa37c7b421657"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  var provider = new firebase.auth.GoogleAuthProvider();



 async function logInUser(event) {
  event?.preventDefault();

  const loginBtn = document.getElementById("loginBtn");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("All fields are required.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Loading...";

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    let message;

    if (error.code === "auth/wrong-password") {
      message = "Incorrect password.";
    } else if (error.code === "auth/user-not-found") {
      message = "Incorrect email.";
    } else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      message = "Incorrect email or password.";
    } else {
      message = "Unable to log in. Please try again.";
    }

    alert(message);
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In";
  }
}




document.getElementById("forgotPassword").addEventListener("click", (event) => {
  event.preventDefault();

  let emailInput = document.getElementById("email");
  let email = emailInput.value.trim();

  if (!email) {
    alert("Enter your email address first.");
    emailInput.focus();
    return;
  }

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent. Check your inbox.");
      window.location.reload()
    })
    .catch((error) => {
      alert(error.message.slice(9));
    });
});