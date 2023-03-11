AWS.config.region = "ap-south-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:840cc310-d9ec-4e24-8d27-559d9e7160f6",
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

function forgotPassword() {
  var username = document.getElementById("email").value;
  sessionStorage.setItem("email", username);
  console.log(username)
  console.log(sessionStorage);
  console.log(sessionStorage.getItem("email"));
  var params = {
    ClientId: "6b9eog59q5u81lqgd0pg0kv8rn",
    Username: username,
  };
  console.log(params);
  cognitoidentityserviceprovider.forgotPassword(params, function (err, data) {
    if (err) {
      alert(err.message);
    } else {
      console.log(sessionStorage);
      console.log(sessionStorage.getItem("email"));
        alert(
          "Password reset code have been sent to your email."
        );
        window.location.href = "../ResetPassword/index.html";
    }
  });
}
