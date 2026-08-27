// GET ELEMENTS
const forgotForm = document.getElementById("forgotForm");
const emailField = document.getElementById("forgotEmailField");
const emailInput = document.getElementById("forgotEmail");
const emailError = document.getElementById("forgotEmailError");
const emailErrorText = document.getElementById("forgotEmailErrorText");
const submitButton = document.getElementById("forgotSubmit");
const submitButtonText = document.getElementById("forgotSubmitText");
const successModal = document.getElementById("successModal");
const successEmail = document.getElementById("successEmail");
const continueVerifyOtp =
    document.getElementById("continueVerifyOtp");

// EMAIL VALIDATION
function isValidEmail(email) {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// SHOW ERROR
function showEmailError(message) {
    emailField.classList.add("error");
    emailErrorText.textContent = message;
    emailError.style.display = "flex";
}

// HIDE ERROR
function clearEmailError() {
    emailField.classList.remove("error");
    emailError.style.display = "none";
}

// LOADING STATE
function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    if (isLoading) {
        submitButtonText.textContent =
            "Đang gửi...";
    } else {
        submitButtonText.textContent =
            "Gửi liên kết đặt lại mật khẩu";
    }
}

// FORGOT PASSWORD API
async function forgotPasswordAPI(email) {
   
    // MOCK API
    // Dùng để test frontend trước khi có Backend.
    await new Promise(function(resolve) {
        setTimeout(resolve, 1000);
    });

    return {
        success: true
    };
}

// OPEN SUCCESS POPUP
function showSuccessPopup(email) {
    successEmail.textContent = email;
    successModal.hidden = false;
}

// CLOSE SUCCESS POPUP
function closeSuccessPopup() {
    successModal.hidden = true;
}

// SUBMIT FORM
forgotForm.addEventListener(
    "submit",
    async function(event) {
        event.preventDefault();
        // Xóa lỗi cũ
        clearEmailError();
        // Lấy email
        const email =
            emailInput.value.trim();

        // CHECK EMPTY
        if (!email) {
            showEmailError(
                "Vui lòng nhập email."
            );
            emailInput.focus();
            return;
        }

        // CHECK EMAIL FORMAT
        if (!isValidEmail(email)) {
            showEmailError(
                "Vui lòng nhập email hợp lệ."
            );
            emailInput.focus();
            return;
        }

        try {

            // LOADING
            setLoading(true);

            // CALL API
            const result =
                await forgotPasswordAPI(email);

            // CHECK RESULT
            if (!result.success) {
                throw new Error(
                    "Forgot password failed"
                );
            }

            // SUCCESS
            showSuccessPopup(email);
        } catch (error) {
            console.error(
                "Forgot Password Error:",
                error
            );
            showEmailError(
                "Không thể gửi yêu cầu. Vui lòng thử lại."
            );
        } finally {
            // STOP LOADING
            setLoading(false);
        }
    }
);

// CONTINUE → VERIFY OTP
continueVerifyOtp.addEventListener(
    "click",
    function() {
        window.location.href =
            "verify-otp.html";
    }
);