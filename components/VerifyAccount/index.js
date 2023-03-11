AWS.config.region = "ap-south-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:840cc310-d9ec-4e24-8d27-559d9e7160f6",
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

function verifyUser() {
  var params = {
    ClientId: "6b9eog59q5u81lqgd0pg0kv8rn",
    Username: localStorage.getItem("username"),
    ConfirmationCode: document.getElementById("otp").value,
  };
  cognitoidentityserviceprovider.confirmSignUp(params, function (err, data) {
    if (err) {
      alert(err.message);
    } else {
      alert("Verification successful. Please log in to continue.");
      window.location.href = "../Login/index.html";
    }
  });
}
