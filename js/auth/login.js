/**
 * Login Logic & API Integration - E-SPIRIT
 * Branch: feature/FE-AUTH-002-login
 */

const EYE_OPEN_SVG = `
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
`;

const EYE_CLOSE_SVG = `
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.4 5.5A11 11 0 0 1 12 5c7 0 11 7 11 7a13.6 13.6 0 0 1-3.2 3.9M6.2 6.9C3.9 8.4 2 11 2 11s2.7 5.5 8.4 6.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
`;

// Mock API Call Đăng nhập
async function loginApi(credentials) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isValid =
        credentials.email === 'admin@espirit.vn' ||
        credentials.password === 'correct' ||
        credentials.password === 'Abc12345';

      if (isValid) {
        resolve({
          success: true,
          token: 'mock-jwt-token-espirit-2026',
          user: { name: 'Người dùng E-SPIRIT', email: credentials.email }
        });
      } else {
        reject(new Error('Email hoặc mật khẩu không chính xác.'));
      }
    }, 900);
  });
}

function showFieldError(fieldId, errorId, msg) {
  const fieldEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (fieldEl) fieldEl.classList.add('error');
  if (errorEl) {
    if (msg) {
      const textSpan = errorEl.querySelector('span');
      if (textSpan) textSpan.textContent = msg;
    }
    errorEl.style.display = 'flex';
  }
}

function clearFieldError(fieldId, errorId) {
  const fieldEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (fieldEl) fieldEl.classList.remove('error');
  if (errorEl) errorEl.style.display = 'none';
}

function showLoginAlert(msg) {
  const alertSlot = document.getElementById('login-alert-slot');
  if (!alertSlot) return;
  alertSlot.innerHTML = `
    <div class="alert alert-error" role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${msg}</span>
    </div>
  `;
}

function clearLoginAlert() {
  const alertSlot = document.getElementById('login-alert-slot');
  if (alertSlot) alertSlot.innerHTML = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.label = btn.querySelector('span') ? btn.querySelector('span').textContent : 'Đăng nhập';
    btn.innerHTML = '<div class="spinner"></div>';
    btn.classList.add('is-loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('is-loading');
    btn.disabled = false;
    btn.innerHTML = `<span>${btn.dataset.label || 'Đăng nhập'}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('login-email');
  const pwInput = document.getElementById('login-pw');
  const rememberCheckbox = document.getElementById('login-remember');
  const submitBtn = document.getElementById('loginSubmit');
  const toggleBtn = document.getElementById('togglePwBtn');
  const googleBtn = document.getElementById('googleLoginBtn');

  // 1. Khôi phục Remember Me từ LocalStorage
  try {
    const savedEmail = localStorage.getItem('espirit_remembered_email');
    if (savedEmail && emailInput && rememberCheckbox) {
      emailInput.value = savedEmail;
      rememberCheckbox.checked = true;
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }

  // 2. Ẩn/Hiện mật khẩu
  if (toggleBtn && pwInput) {
    toggleBtn.addEventListener('click', () => {
      const isPw = pwInput.type === 'password';
      pwInput.type = isPw ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      toggleBtn.innerHTML = isPw ? EYE_CLOSE_SVG : EYE_OPEN_SVG;
    });
  }

  // 3. Xóa lỗi khi gõ phím
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearFieldError('login-email-field', 'login-email-error');
      clearLoginAlert();
    });
  }

  if (pwInput) {
    pwInput.addEventListener('input', () => {
      clearFieldError('login-pw-field', 'login-pw-error');
      clearLoginAlert();
    });
  }

  // 4. Submit & Validation Form
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldError('login-email-field', 'login-email-error');
      clearFieldError('login-pw-field', 'login-pw-error');
      clearLoginAlert();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = pwInput ? pwInput.value : '';
      const isRemember = rememberCheckbox ? rememberCheckbox.checked : false;

      let isValid = true;

      if (!isValidEmail(email)) {
        showFieldError('login-email-field', 'login-email-error', 'Vui lòng nhập email hợp lệ.');
        isValid = false;
      }

      if (!password) {
        showFieldError('login-pw-field', 'login-pw-error', 'Vui lòng nhập mật khẩu.');
        isValid = false;
      }

      if (!isValid) return;

      setLoading(submitBtn, true);

      try {
        const response = await loginApi({ email, password, remember: isRemember });

        if (isRemember) {
          localStorage.setItem('espirit_remembered_email', email);
        } else {
          localStorage.removeItem('espirit_remembered_email');
        }

        sessionStorage.setItem('authToken', response.token);
        window.location.href = '../../index.html';
      } catch (error) {
        setLoading(submitBtn, false);
        showLoginAlert(error.message || 'Email hoặc mật khẩu không chính xác.');
      }
    });
  }

  // 5. Google Login UI Event
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      console.log('Google OAuth2 Triggered: UI ready for backend API.');
    });
  }
});