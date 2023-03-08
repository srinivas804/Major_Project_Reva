const resetPasswordForm = document.getElementById('reset-password-form');

resetPasswordForm.addEventListener('submit', function(e) {
	e.preventDefault();

	const otpInput = document.getElementById('otp');
	const newPasswordInput = document.getElementById('new-password');
	const confirmPasswordInput = document.getElementById('confirm-password');
	const errorMessage = document.getElementById('error-message');

	// Password validation
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
	if (!passwordRegex.test(newPasswordInput.value)) {
		errorMessage.textContent = 'Password must contain at least one lowercase letter,n one uppercase letter, one number, one special character, and be at least 7 characters long';
	} else if (newPasswordInput.value !== confirmPasswordInput.value) {
		errorMessage.textContent = 'New password and confirm password must match';
	} else {
		// Reset error message
		errorMessage.textContent = '';

		// Redirect to login page
		window.location.href = '../Login/index.html';
	}
});
