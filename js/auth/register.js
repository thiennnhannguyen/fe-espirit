document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('registerForm', (formData, validator) => {
    validator.setLoading(true);

    setTimeout(() => {
      validator.setLoading(false);
      window.location.href = 'verify-otp.html';
    }, 900);
  });
});