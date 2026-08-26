document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('forgotForm', (formData, validator) => {
    validator.setLoading(true);

    setTimeout(() => {
      validator.setLoading(false);
      document.getElementById('forgot-default').style.display = 'none';
      document.getElementById('forgot-sent').style.display = 'block';
      document.getElementById('forgot-sent-email').textContent = formData.email;
    }, 900);
  });
});