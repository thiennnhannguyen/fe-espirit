

const AUTH_MESSAGES = {
  REQUIRED: 'Vui lòng không để trống trường này.',
  EMAIL_INVALID: 'Vui lòng nhập email hợp lệ.',
  EMAIL_EXISTED: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.',
  PASSWORD_WEAK: 'Mật khẩu chưa đáp ứng yêu cầu bảo mật.',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp.',
  TERMS_REQUIRED: 'Bạn cần đồng ý với điều khoản sử dụng để tiếp tục.'
};

const AuthRules = {
  isRequired: (value) => value != null && value.trim().length > 0,
  isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  evalPassword: (pw) => {
    const reqs = {
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num: /[0-9]/.test(pw)
    };
    const score = Object.values(reqs).filter(Boolean).length;
    return { reqs, score };
  },
  isMatch: (val, compareVal) => val === compareVal
};

const ERROR_ICON_SVG = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

class FormValidator {
  constructor(formId, onSubmitSuccess) {
    this.form = document.getElementById(formId);
    this.onSubmitSuccess = onSubmitSuccess;
    if (!this.form) return;

    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.inputs = this.form.querySelectorAll('.input, input[type="checkbox"]');

    this.init();
  }

  init() {
    this.inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
      input.addEventListener('change', () => this.clearFieldError(input));
    });

    this.initPasswordToggle();
    this.initPasswordStrength();

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateAll()) {
        const formData = this.getFormData();
        if (this.onSubmitSuccess) {
          this.onSubmitSuccess(formData, this);
        }
      }
    });
  }

  initPasswordToggle() {
    this.form.querySelectorAll('[data-toggle-pw]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetInput = document.getElementById(btn.dataset.togglePw);
        if (!targetInput) return;

        const isPw = targetInput.type === 'password';
        targetInput.type = isPw ? 'text' : 'password';
        btn.setAttribute('aria-label', isPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
        btn.innerHTML = isPw
          ? '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.4 5.5A11 11 0 0 1 12 5c7 0 11 7 11 7a13.6 13.6 0 0 1-3.2 3.9M6.2 6.9C3.9 8.4 2 11 2 11s2.7 5.5 8.4 6.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>';
      });
    });
  }

  initPasswordStrength() {
    const pwInput = this.form.querySelector('[data-strength-target]');
    if (!pwInput) return;

    const suffix = pwInput.dataset.strengthTarget;
    const wrap = document.getElementById('pw-strength' + suffix);
    if (!wrap) return;

    const bars = [
      document.getElementById(`bar1${suffix}`),
      document.getElementById(`bar2${suffix}`),
      document.getElementById(`bar3${suffix}`)
    ];
    const label = document.getElementById(`pw-label${suffix}`);
    const colors = ['#B3261E', '#C8A45D', '#2E6E4E'];

    pwInput.addEventListener('input', () => {
      const pw = pwInput.value;
      if (!pw) {
        wrap.style.display = 'none';
        ['len', 'upper', 'lower', 'num'].forEach((k) => {
          const reqEl = document.getElementById(`req-${k}${suffix}`);
          if (reqEl) reqEl.classList.remove('met');
        });
        bars.forEach((b) => { if (b) b.style.background = 'var(--border)'; });
        if (label) label.textContent = '';
        return;
      }

      wrap.style.display = 'block';
      const { reqs, score } = AuthRules.evalPassword(pw);

      ['len', 'upper', 'lower', 'num'].forEach((k) => {
        const reqEl = document.getElementById(`req-${k}${suffix}`);
        if (reqEl) reqEl.classList.toggle('met', reqs[k]);
      });

      let level = 0;
      let text = 'Yếu';
      if (score >= 4 && pw.length >= 10) {
        level = 3;
        text = 'Mạnh';
      } else if (score >= 3) {
        level = 2;
        text = 'Trung bình';
      } else if (score >= 1) {
        level = 1;
        text = 'Yếu';
      }

      bars.forEach((b, i) => {
        if (b) b.style.background = i < level ? colors[level - 1] : 'var(--border)';
      });

      if (label) {
        label.textContent = text;
        label.style.color = level === 3 ? colors[2] : level === 2 ? colors[1] : colors[0];
      }
    });
  }

  validateField(input) {
    const field = input.closest('.field');
    if (!field) return true;

    const isRequired = input.hasAttribute('required');
    const validateType = input.dataset.validate;
    const value = input.type === 'checkbox' ? input.checked : input.value;

    if (input.type === 'checkbox') {
      if (isRequired && !input.checked) {
        this.showFieldError(field, AUTH_MESSAGES.TERMS_REQUIRED);
        return false;
      }
      this.setFieldSuccess(field);
      return true;
    }

    if (isRequired && !AuthRules.isRequired(value)) {
      this.showFieldError(field, AUTH_MESSAGES.REQUIRED);
      return false;
    }

    if (value && value.trim().length > 0) {
      if (validateType === 'email') {
        if (!AuthRules.isEmail(value)) {
          this.showFieldError(field, AUTH_MESSAGES.EMAIL_INVALID);
          return false;
        }
        if (value.toLowerCase() === 'test@existing.com') {
          this.showFieldError(field, AUTH_MESSAGES.EMAIL_EXISTED);
          return false;
        }
      }

      if (validateType === 'password') {
        const { score } = AuthRules.evalPassword(value);
        if (score < 3) {
          this.showFieldError(field, AUTH_MESSAGES.PASSWORD_WEAK);
          return false;
        }
      }

      if (validateType === 'confirm-password') {
        const targetSelector = input.dataset.match;
        const targetInput = this.form.querySelector(targetSelector);
        if (targetInput && !AuthRules.isMatch(value, targetInput.value)) {
          this.showFieldError(field, AUTH_MESSAGES.PASSWORD_MISMATCH);
          return false;
        }
      }
    }

    this.setFieldSuccess(field);
    return true;
  }

  showFieldError(field, msg) {
    field.classList.remove('success');
    field.classList.add('error');

    let err = field.querySelector('.field-msg.error-msg');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-msg error-msg';
      field.appendChild(err);
    }
    err.innerHTML = `${ERROR_ICON_SVG}<span>${msg}</span>`;
    err.style.display = 'flex';
  }

  setFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    const err = field.querySelector('.field-msg.error-msg');
    if (err) err.style.display = 'none';
  }

  clearFieldError(input) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.remove('error');
    const err = field.querySelector('.field-msg.error-msg');
    if (err) err.style.display = 'none';
  }

  validateAll() {
    let isValid = true;
    this.inputs.forEach((input) => {
      if (!this.validateField(input)) isValid = false;
    });
    return isValid;
  }

  getFormData() {
    const data = {};
    this.inputs.forEach((input) => {
      const key = input.name || input.id;
      if (key) {
        data[key] = input.type === 'checkbox' ? input.checked : input.value.trim();
      }
    });
    return data;
  }

  setLoading(loading) {
    if (!this.submitBtn) return;
    if (loading) {
      this.submitBtn.dataset.originalText = this.submitBtn.innerHTML;
      this.submitBtn.innerHTML = '<div class="spinner"></div>';
      this.submitBtn.classList.add('is-loading');
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('is-loading');
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = this.submitBtn.dataset.originalText || '<span>Xác nhận</span>';
    }
  }
}