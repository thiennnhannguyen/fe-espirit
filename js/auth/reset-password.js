document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('resetForm', (formData, validator) => {
    validator.setLoading(true);

    setTimeout(() => {
      validator.setLoading(false);
      window.location.href = 'register-success.html';
    }, 900);
  });
});