// Initialize the AWS Cognito SDK
AWS.config.region = "ap-south-1"; // Update your region
var poolData = {
  UserPoolId: "ap-south-1_1hntuwWZt",
  ClientId: "6b9eog59q5u81lqgd0pg0kv8rn",
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Handle the form submission
function handleSubmit() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  var userData = {
    Username: email,
    Pool: userPool,
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log(cognitoUser);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log("Logged in!");
      window.open("../Dashboard/index.html", "_self");
      // Redirect to another page or perform other actions on successful login
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}
