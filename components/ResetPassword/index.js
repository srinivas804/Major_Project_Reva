const resetPasswordForm = document.getElementById("reset-password-form");

resetPasswordForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const errorMessage = document.getElementById("error-message");

  // Password validation
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
  if (!passwordRegex.test(newPasswordInput.value)) {
    errorMessage.textContent =
      "Password must contain at least one lowercase letter,n one uppercase letter, one number, one special character, and be at least 7 characters long";
  } else if (newPasswordInput.value !== confirmPasswordInput.value) {
    errorMessage.textContent = "New password and confirm password must match";
  } else {
    // Reset error message
    errorMessage.textContent = "";

    // Redirect to login page
    window.location.href = "../Login/index.html";
  }
});

// Initialize the AWS SDK with your Cognito pool ID
AWS.config.region = "ap-south-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:840cc310-d9ec-4e24-8d27-559d9e7160f6",
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

function resetPassword() {
  var params = {
    ClientId: "6b9eog59q5u81lqgd0pg0kv8rn",
    ConfirmationCode: document.getElementById("otp").value,
    Password: document.getElementById("new-password").value,
    Username: sessionStorage.getItem("email"), 
  };
  console.log(JSON.stringify(params));
  cognitoidentityserviceprovider.confirmForgotPassword(
    params,
    function (err, data) {
      if (err) {
        alert(err.message);
      } else {
        alert("Password reset successful.");
        window.location.href = "../Login/index.html";
      }
    }
  );
}
