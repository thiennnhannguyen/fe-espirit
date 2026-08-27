// register.js — Register page logic

(function () {
  var form = document.getElementById('registerForm');
  var nameInput = document.getElementById('reg-name');
  var emailInput = document.getElementById('reg-email');
  var pwInput = document.getElementById('reg-pw');
  var confirmInput = document.getElementById('reg-confirm');
  var termsBox = document.getElementById('reg-terms');
  var submitBtn = document.getElementById('registerSubmit');
  var alertSlot = document.getElementById('register-alert-slot');

  // SVG icons
  var eyeOpen = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>';
  var eyeClosed = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.4 5.5A11 11 0 0 1 12 5c7 0 11 7 11 7a13.6 13.6 0 0 1-3.2 3.9M6.2 6.9C3.9 8.4 2 11 2 11s2.7 5.5 8.4 6.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var warnIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // --- Show/hide password toggle ---
  function bindToggle(btnId, inputId) {
    var btn = document.getElementById(btnId);
    var input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.innerHTML = showing ? eyeOpen : eyeClosed;
      btn.setAttribute('aria-label', showing ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    });
  }
  bindToggle('toggle-pw', 'reg-pw');
  bindToggle('toggle-confirm', 'reg-confirm');

  // --- Password strength ---
  function evalPassword(pw) {
    var reqs = {
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num: /[0-9]/.test(pw)
    };
    var score = 0;
    if (reqs.len) score++;
    if (reqs.upper) score++;
    if (reqs.lower) score++;
    if (reqs.num) score++;
    return { reqs: reqs, score: score };
  }

  var strengthWrap = document.getElementById('pw-strength');
  var bars = [document.getElementById('bar1'), document.getElementById('bar2'), document.getElementById('bar3')];
  var pwLabel = document.getElementById('pw-label');
  var strengthColors = ['#B3261E', '#C8A45D', '#2E6E4E'];

  pwInput.addEventListener('input', function () {
    var pw = pwInput.value;
    if (!pw) { strengthWrap.style.display = 'none'; return; }
    strengthWrap.style.display = 'block';

    var result = evalPassword(pw);
    var keys = ['len', 'upper', 'lower', 'num'];
    for (var i = 0; i < keys.length; i++) {
      var el = document.getElementById('req-' + keys[i]);
      if (result.reqs[keys[i]]) el.classList.add('met');
      else el.classList.remove('met');
    }

    var level = 0, text = 'Yếu';
    if (result.score >= 4 && pw.length >= 10) { level = 3; text = 'Mạnh'; }
    else if (result.score >= 3) { level = 2; text = 'Trung bình'; }
    else if (result.score >= 1) { level = 1; text = 'Yếu'; }

    for (var j = 0; j < bars.length; j++) {
      bars[j].style.background = j < level ? strengthColors[level - 1] : 'var(--border)';
    }
    pwLabel.textContent = pw.length ? text : '';
    pwLabel.style.color = level === 3 ? strengthColors[2] : level === 2 ? strengthColors[1] : strengthColors[0];
  });

  // --- Field error helpers ---
  function showError(fieldId, errorId, msg) {
    var field = document.getElementById(fieldId);
    var err = document.getElementById(errorId);
    if (field) field.classList.add('error');
    if (err) {
      if (msg) err.querySelector('span').textContent = msg;
      err.style.display = 'flex';
    }
  }

  function clearError(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var err = document.getElementById(errorId);
    if (field) field.classList.remove('error');
    if (err) err.style.display = 'none';
  }

  function clearAllErrors() {
    clearError('reg-name-field', 'reg-name-error');
    clearError('reg-email-field', 'reg-email-error');
    clearError('reg-pw-field', 'reg-pw-error');
    clearError('reg-confirm-field', 'reg-confirm-error');
    var termsErr = document.getElementById('reg-terms-error');
    if (termsErr) termsErr.style.display = 'none';
    alertSlot.innerHTML = '';
  }

  // --- Validation ---
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validateName(name) {
    if (!name) {
      showError('reg-name-field', 'reg-name-error', 'Vui lòng nhập họ và tên.');
      return false;
    }
    if (name.length < 2) {
      showError('reg-name-field', 'reg-name-error', 'Họ và tên phải có ít nhất 2 ký tự.');
      return false;
    }
    return true;
  }

  function validateEmail(email) {
    if (!email) {
      showError('reg-email-field', 'reg-email-error', 'Vui lòng nhập email.');
      return false;
    }
    if (!isValidEmail(email)) {
      showError('reg-email-field', 'reg-email-error', 'Vui lòng nhập email hợp lệ.');
      return false;
    }
    return true;
  }

  function validatePassword(pw) {
    if (!pw) {
      showError('reg-pw-field', 'reg-pw-error', 'Vui lòng nhập mật khẩu.');
      return false;
    }
    if (pw.length < 8) {
      showError('reg-pw-field', 'reg-pw-error', 'Mật khẩu phải có ít nhất 8 ký tự.');
      return false;
    }
    return true;
  }

  function validateConfirm(pw, confirm) {
    if (!confirm) {
      showError('reg-confirm-field', 'reg-confirm-error', 'Vui lòng xác nhận mật khẩu.');
      return false;
    }
    if (pw !== confirm) {
      showError('reg-confirm-field', 'reg-confirm-error', 'Mật khẩu xác nhận không khớp.');
      return false;
    }
    return true;
  }

  function validateTerms() {
    if (!termsBox.checked) {
      var err = document.getElementById('reg-terms-error');
      if (err) err.style.display = 'flex';
      return false;
    }
    return true;
  }

  // --- Loading state ---
  function setLoading(loading) {
    if (loading) {
      submitBtn.dataset.label = submitBtn.querySelector('span').textContent;
      submitBtn.innerHTML = '<div class="spinner"></div>';
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>' + (submitBtn.dataset.label || 'Tạo tài khoản') + '</span>';
    }
  }

  // --- Form submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var pw = pwInput.value;
    var confirm = confirmInput.value;

    var valid = true;
    if (!validateName(name)) valid = false;
    if (!validateEmail(email)) valid = false;
    if (!validatePassword(pw)) valid = false;
    if (!validateConfirm(pw, confirm)) valid = false;
    if (!validateTerms()) valid = false;

    if (!valid) return;

    setLoading(true);

    // Simulate API call
    setTimeout(function () {
      setLoading(false);

      // Mock: email already exists
      if (email === 'test@existing.com') {
        alertSlot.innerHTML = '<div class="alert alert-error">' + warnIcon + '<span>Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.</span></div>';
        return;
      }

      // TODO: Replace with actual Register API call
      // var payload = { fullName: name, email: email, password: pw };
      // fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload), ... })

      // Success → redirect to OTP verification
      window.location.href = 'verify-otp.html?email=' + encodeURIComponent(email);
    }, 1200);
  });

  // Clear individual field errors on input
  nameInput.addEventListener('input', function () { clearError('reg-name-field', 'reg-name-error'); });
  emailInput.addEventListener('input', function () { clearError('reg-email-field', 'reg-email-error'); });
  pwInput.addEventListener('input', function () { clearError('reg-pw-field', 'reg-pw-error'); });
  confirmInput.addEventListener('input', function () { clearError('reg-confirm-field', 'reg-confirm-error'); });
  termsBox.addEventListener('change', function () {
    var err = document.getElementById('reg-terms-error');
    if (termsBox.checked && err) err.style.display = 'none';
  });
})();
