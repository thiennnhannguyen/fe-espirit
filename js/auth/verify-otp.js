document.addEventListener('DOMContentLoaded', () => {
  const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
  const otpBtn = document.getElementById('otpSubmit');
  const alertSlot = document.getElementById('otp-alert-slot');

  otpBoxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/[^0-9]/g, '');
      box.classList.toggle('filled', !!box.value);
      box.classList.remove('error');
      if (box.value && i < otpBoxes.length - 1) {
        otpBoxes[i + 1].focus();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        otpBoxes[i - 1].focus();
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const digits = (e.clipboardData.getData('text').match(/[0-9]/g) || []).slice(0, 6);
      digits.forEach((d, idx) => {
        if (otpBoxes[idx]) {
          otpBoxes[idx].value = d;
          otpBoxes[idx].classList.add('filled');
        }
      });
      if (digits.length) {
        otpBoxes[Math.min(digits.length, otpBoxes.length) - 1].focus();
      }
    });
  });

  if (otpBtn) {
    otpBtn.addEventListener('click', () => {
      const code = otpBoxes.map((b) => b.value).join('');
      if (alertSlot) alertSlot.innerHTML = '';
      otpBoxes.forEach((b) => b.classList.remove('error'));

      if (code.length < 6) {
        if (alertSlot) {
          alertSlot.innerHTML = `
            <div class="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Vui lòng nhập đầy đủ 6 số.</span>
            </div>
          `;
        }
        return;
      }

      otpBtn.classList.add('is-loading');
      otpBtn.disabled = true;
      otpBtn.innerHTML = '<div class="spinner"></div>';

      setTimeout(() => {
        otpBtn.classList.remove('is-loading');
        otpBtn.disabled = false;
        otpBtn.innerHTML = '<span>Xác minh</span>';

        if (code === '000000') {
          otpBoxes.forEach((b) => b.classList.add('error'));
          if (alertSlot) {
            alertSlot.innerHTML = `
              <div class="alert alert-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Mã xác minh không hợp lệ. Vui lòng thử lại.</span>
              </div>
            `;
          }
        } else {
          window.location.href = 'register-success.html';
        }
      }, 800);
    });
  }

  let resendSeconds = 30;
  const resendTimerEl = document.getElementById('resendTimer');
  const resendTextEl = document.getElementById('resendText');
  const resendBtnEl = document.getElementById('resendBtn');

  if (resendTimerEl && resendTextEl && resendBtnEl) {
    const timer = setInterval(() => {
      resendSeconds--;
      if (resendSeconds <= 0) {
        clearInterval(timer);
        resendTextEl.style.display = 'none';
        resendBtnEl.style.display = 'inline';
      } else {
        const m = String(Math.floor(resendSeconds / 60)).padStart(2, '0');
        const s = String(resendSeconds % 60).padStart(2, '0');
        resendTimerEl.textContent = m + ':' + s;
      }
    }, 1000);

    resendBtnEl.addEventListener('click', () => {
      resendSeconds = 30;
      resendTextEl.style.display = 'inline';
      resendBtnEl.style.display = 'none';
      otpBoxes.forEach((b) => {
        b.value = '';
        b.classList.remove('filled', 'error');
      });
      otpBoxes[0].focus();
    });
  }
});