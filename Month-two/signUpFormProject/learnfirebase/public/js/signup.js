console.log(firebase);






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



function signUserUp(){
    signUpBtn.innerHTML = `loading...`
    signUpBtn.disabled = true
    let email = document.getElementById(`email`).value.trim()
    let password = document.getElementById(`password`).value.trim()
    let fullname = document.getElementById(`fullname`).value.trim()
    let confirmPassword = document.getElementById(`confirmPassword`).value.trim()


    if(!email || !password || !confirmPassword || !fullname){
        alert(`all fields are mandatory`)
        return
    }



firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)

    user.updateProfile({
  displayName: fullname,
    }).then(() => {
        alert(`sign up successful`)
        window.location.href = `login.html`
        signUpBtn.innerHTML = `loading...`
        signUpBtn.disabled = false
    }).catch((error) => {
        alert(`sign up successful , couldnt update username at the moment`)
        window.location.href = 'login.html'
        signUpBtn.innerHTML = `loading...`
        signUpBtn.disabled = false
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage.slice(9))
    signUpBtn.innerHTML = `loading...`
    signUpBtn.disabled = false
  });
}




  function signInWithGoogle(params) {
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;
    var user = result.user;
    window.location.href = 'dashboard.html'
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    alert(errorMessage)
  });
}





  // explaination
//   let firebase = {
//     auth: ()=> {
//       return {
//         createUserWithEmailAndPassword: ( email , password )=> {

//         }
//       }
//     } , 
//   }


//  firebase.auth().createUserWithEmailAndPassword(email , password)