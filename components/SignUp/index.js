AWS.config.region = "ap-south-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:840cc310-d9ec-4e24-8d27-559d9e7160f6",
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
function registerUser() {
  var params = {
    ClientId: "6b9eog59q5u81lqgd0pg0kv8rn",
    Username: document.getElementById("email").value,
    Password: document.getElementById("password").value,
    UserAttributes: [
      {
        Name: "email",
        Value: document.getElementById("email").value,
      },
    ],
  };
  cognitoidentityserviceprovider.signUp(params, function (err, data) {
    if (err) {
      alert(err.message);
    } else {
      localStorage.setItem("username", params.Username);
      alert(
        "verification code have been sent to your email."
      );
      window.location.href = "../VerifyAccount/index.html";
    }
  });
}
