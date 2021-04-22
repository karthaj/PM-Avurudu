
function googleProvider() {  
    return new firebase.auth.GoogleAuthProvider();
  }
  
  function googleSignInPopup(provider) {
    // [START auth_google_signin_popup]
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
  
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken; 


        localStorage.setItem("dpURL", result.user.photoURL) ;
        localStorage.setItem("uid", result.user.uid);
        localStorage.setItem("name", result.user.displayName);
        localStorage.setItem("email", result.user.email);
        window.localStorage.setItem("game_1", 0);
        window.localStorage.setItem("game_2", 0);
        window.localStorage.setItem("game_3", 0);
				window.location.reload();
         
        // ...
      }).catch((error) => {
        // Handle Errors here.
        alert(error.message)
        // ...
      });
    // [END auth_google_signin_popup]
  }
  
  function googleSignInRedirectResult() {
    // [START auth_google_signin_redirect_result]
    firebase.auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
  
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    // [END auth_google_signin_redirect_result]
  }
  
  function googleBuildAndSignIn(id_token) {
    // [START auth_google_build_signin]
    // Build Firebase credential with the Google ID token.
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);
  
    // Sign in with credential from the Google user.
    firebase.auth().signInWithCredential(credential).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    // [END auth_google_build_signin]
  }
  