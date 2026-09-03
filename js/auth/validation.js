// Chuẩn hóa danh sách Error Messages
const VALIDATION_MESSAGES = {
  REQUIRED: (field = 'Trường này') => `${field} không được để trống.`,
  EMAIL_INVALID: 'Vui lòng nhập địa chỉ email hợp lệ.',
  PASSWORD_LENGTH: 'Mật khẩu phải có độ dài từ 6 đến 32 ký tự.',
  PASSWORD_WEAK: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số.',
  CONFIRM_PASSWORD_MISMATCH: 'Mật khẩu xác nhận không trùng khớp.',
  OTP_INVALID: 'Mã xác thực OTP phải gồm 6 chữ số.',
  TERMS_REQUIRED: 'Bạn cần đồng ý với điều khoản sử dụng.'
};

// Chuẩn hóa Regular Expressions
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_COMPLEXITY: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/,
  OTP: /^\d{6}$/
};

// Bộ quy tắc kiểm tra dữ liệu đơn lẻ (Pure Validators)
const validators = {
  required(value) {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'boolean') return value;
    return value !== null && value !== undefined;
  },

  email(value) {
    return REGEX.EMAIL.test(String(value).trim());
  },

  password(value) {
    return REGEX.PASSWORD_COMPLEXITY.test(String(value));
  },

  confirmPassword(password, confirmPassword) {
    return Boolean(password) && password === confirmPassword;
  },

  otp(value) {
    return REGEX.OTP.test(String(value).trim());
  }
};

/**
 * Chuẩn hóa trạng thái Input Field
 * Trạng thái: 'default' | 'error' | 'success' | 'disabled'
 */
function setFieldStatus(fieldElement, status = 'default', message = '') {
  if (!fieldElement) return;

  const errorMsgEl = fieldElement.querySelector('.field-msg.error-msg');
  const inputEl = fieldElement.querySelector('input');

  fieldElement.classList.remove('error', 'success');

  switch (status) {
    case 'error':
      fieldElement.classList.add('error');
      if (errorMsgEl) {
        const textSpan = errorMsgEl.querySelector('span') || errorMsgEl;
        textSpan.textContent = message || VALIDATION_MESSAGES.REQUIRED();
        errorMsgEl.style.display = 'flex';
      }
      break;

    case 'success':
      fieldElement.classList.add('success');
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      break;

    case 'disabled':
      if (inputEl) inputEl.disabled = true;
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      break;

    case 'default':
    default:
      if (inputEl) inputEl.disabled = false;
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      break;
  }
}

/**
 * Chuẩn hóa trạng thái Button
 * Trạng thái: 'default' | 'loading' | 'disabled'
 */
function setButtonState(btnElement, state = 'default', customText = null) {
  if (!btnElement) return;

  if (!btnElement.dataset.originalText && btnElement.querySelector('span')) {
    btnElement.dataset.originalText = btnElement.querySelector('span').textContent.trim();
  }

  const defaultText = btnElement.dataset.originalText || 'Xác nhận';

  switch (state) {
    case 'loading':
      btnElement.classList.add('is-loading');
      btnElement.disabled = true;
      btnElement.innerHTML = '<div class="spinner"></div>';
      break;

    case 'disabled':
      btnElement.classList.remove('is-loading');
      btnElement.disabled = true;
      btnElement.innerHTML = `<span>${customText || defaultText}</span>`;
      break;

    case 'default':
    default:
      btnElement.classList.remove('is-loading');
      btnElement.disabled = false;
      btnElement.innerHTML = `<span>${customText || defaultText}</span>`;
      break;
  }
}

/**
 * Helper validate nhanh toàn bộ form theo danh sách cấu hình rules
 */
function validateForm(fieldsConfig) {
  let isFormValid = true;

  fieldsConfig.forEach(({ fieldId, value, rules }) => {
    const fieldEl = document.getElementById(fieldId);
    let fieldValid = true;
    let errorMsg = '';

    for (const rule of rules) {
      if (!rule.validator(value)) {
        fieldValid = false;
        errorMsg = rule.message;
        break;
      }
    }

    if (!fieldValid) {
      setFieldStatus(fieldEl, 'error', errorMsg);
      isFormValid = false;
    } else {
      setFieldStatus(fieldEl, 'success');
    }
  });

  return isFormValid;
}

window.AuthValidator = {
  VALIDATION_MESSAGES,
  MESSAGES: VALIDATION_MESSAGES,
  REGEX,
  validators,
  setFieldStatus,
  setButtonState,
  validateForm
};