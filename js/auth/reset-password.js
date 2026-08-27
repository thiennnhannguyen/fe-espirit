document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const toggleNewPw = document.getElementById('toggleNewPw');
    const toggleConfirmPw = document.getElementById('toggleConfirmPw');
    const newPasswordField = document.getElementById('newPasswordField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const apiAlert = document.getElementById('apiAlert');

    function setupTogglePassword(btnElement, inputElement) {
        btnElement.addEventListener('click', function() {
            if (inputElement.type === 'password') {
                inputElement.type = 'text';
            } else {
                inputElement.type = 'password';
            }
        });
    }


    setupTogglePassword(toggleNewPw, newPassword);
    setupTogglePassword(toggleConfirmPw, confirmPassword);

    function showError(fieldElement, errorElement, message) {
        fieldElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'flex';
    }

    function clearErrors() {
        newPasswordField.classList.remove('error');
        confirmPasswordField.classList.remove('error');
        newPasswordError.style.display = 'none';
        confirmPasswordError.style.display = 'none';
        apiAlert.style.display = 'none';
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('is-loading');
            loadingSpinner.style.display = 'block';
            btnText.textContent = 'Đang xử lý...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Đặt lại mật khẩu';
        }
    }

    const reqLength = document.getElementById('reqLength');
    const reqUpper = document.getElementById('reqUpper');
    const reqNumber = document.getElementById('reqNumber');
    const bars = [
        document.getElementById('strengthBar1'),
        document.getElementById('strengthBar2'),
        document.getElementById('strengthBar3')
    ];

    newPassword.addEventListener('input', function() {
        const val = newPassword.value;
        let strength = 0;

        // 1. Kiểm tra các điều kiện
        const hasLength = val.length >= 8;
        const hasUpper = /[A-Z]/.test(val); // Kiểm tra có chữ in hoa từ A-Z
        const hasNumber = /[0-9]/.test(val); // Kiểm tra có chữ số từ 0-9

        // 2. Đổi màu chữ (nếu đạt thì thêm class 'met' màu xanh lá)
        reqLength.classList.toggle('met', hasLength);
        reqUpper.classList.toggle('met', hasUpper);
        reqNumber.classList.toggle('met', hasNumber);

        // 3. Đếm điểm sức mạnh
        if (hasLength) strength++;
        if (hasUpper) strength++;
        if (hasNumber) strength++;

        // 4. Tô màu cho các thanh gạch ngang
        // Đặt lại màu xám mặc định cho cả 3 thanh
        bars.forEach(bar => bar.style.background = 'var(--border)');

        if (strength === 1) {
            // Yếu: 1 thanh màu Đỏ
            bars[0].style.background = 'var(--error)';
        } else if (strength === 2) {
            // Vừa: 2 thanh màu Vàng
            bars[0].style.background = 'var(--secondary)';
            bars[1].style.background = 'var(--secondary)';
        } else if (strength === 3) {
            // Mạnh: 3 thanh màu Xanh lá
            bars[0].style.background = 'var(--success)';
            bars[1].style.background = 'var(--success)';
            bars[2].style.background = 'var(--success)';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        clearErrors();

        let isValid = true;
        const newPwValue = newPassword.value.trim();
        const confirmPwValue = confirmPassword.value.trim();

        if (newPwValue === '') {
            showError(newPasswordField, newPasswordError, 'Vui lòng nhập mật khẩu mới.');
            isValid = false;
        } else if (newPwValue.length < 8) {
            showError(newPasswordField, newPasswordError, 'Mật khẩu phải dài ít nhất 8 ký tự.');
            isValid = false;
        }

        if (confirmPwValue === '') {
            showError(confirmPasswordField, confirmPasswordError, 'Vui lòng xác nhận lại mật khẩu.');
            isValid = false;
        } else if (confirmPwValue !== newPwValue) {
            showError(confirmPasswordField, confirmPasswordError, 'Mật khẩu xác nhận không khớp.');
            isValid = false;
        }

        if (isValid) {
            setLoadingState(true);

            setTimeout(function() {
                const apiSuccess = true;

                if (apiSuccess) {
                    alert('Đổi mật khẩu thành công! Bấm OK để chuyển trang.');
                    window.location.href = 'login.html';
                } else {
                    setLoadingState(false);
                    apiAlert.style.display = 'flex';
                    document.getElementById('apiAlertMessage').textContent = 'Hệ thống đang bận. Vui lòng thử lại sau!';
                }
            }, 2000);
        }
    });
});