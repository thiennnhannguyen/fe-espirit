// GET ELEMENTS
const forgotForm = document.getElementById("forgotForm");
const emailInput = document.getElementById("forgot-email");
const emailError = document.getElementById("forgot-email-error");
const submitButton = document.getElementById("forgotSubmit");

// EMAIL VALIDATION
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// SHOW EMAIL ERROR
function showEmailError(message) {
    emailError.textContent = message;
    emailError.classList.add("show");
    emailInput.setAttribute("aria-invalid", "true");
}

// CLEAR EMAIL ERROR
function clearEmailError() {
    emailError.textContent = "";
    emailError.classList.remove("show");
    emailInput.removeAttribute("aria-invalid");
}

// LOADING STATE
function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    if (isLoading) {
        submitButton.textContent = "Đang gửi...";
    } else {
        submitButton.textContent =
            "Gửi liên kết đặt lại mật khẩu";
    }
}

// MOCK FORGOT PASSWORD API
async function forgotPasswordAPI(email) {
    console.log("Sending forgot password request:", email);

    // Giả lập API mất 1 giây
    await new Promise(function(resolve) {
        setTimeout(resolve, 1000);
    });

    // Sau này thay bằng API thật
    return {
        success: true
    };
}

// CREATE SUCCESS POPUP
function showSuccessPopup(email) {

    // Nếu popup cũ tồn tại thì xóa
    const oldPopup = document.getElementById("forgot-success-popup");
    if (oldPopup) {
        oldPopup.remove();
    }

    // OVERLAY
    const overlay = document.createElement("div");
    overlay.id = "forgot-success-popup";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0, 0, 0, 0.35)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "20px";
    overlay.style.zIndex = "9999";

    // POPUP
    const popup = document.createElement("div");
    popup.style.width = "100%";
    popup.style.maxWidth = "450px";
    popup.style.background = "#FFFFFF";
    popup.style.borderRadius = "20px";
    popup.style.padding = "40px 35px";
    popup.style.textAlign = "center";
    popup.style.boxShadow =
        "0 10px 30px rgba(0, 0, 0, 0.15)";

    // ICON
    const icon = document.createElement("div");
    icon.textContent = "✓";
    icon.style.width = "60px";
    icon.style.height = "60px";
    icon.style.margin = "0 auto 20px";
    icon.style.borderRadius = "50%";
    icon.style.background = "#7A2830";
    icon.style.color = "#FFFFFF";
    icon.style.display = "flex";
    icon.style.alignItems = "center";
    icon.style.justifyContent = "center";
    icon.style.fontFamily = "Afacad Flux, sans-serif";
    icon.style.fontSize = "32px";
    icon.style.fontWeight = "700";

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Gửi thành công!";
    title.style.margin = "0 0 15px";
    title.style.fontFamily =
        '"Libertinus Math", serif';
    title.style.fontSize = "30px";
    title.style.fontWeight = "400";
    title.style.color = "#000000";

    // MESSAGE
    const message = document.createElement("p");
    message.innerHTML =
        `Chúng tôi đã gửi mã OTP đến<br>
        <strong>${email}</strong>`;
    message.style.margin = "0 0 25px";
    message.style.fontFamily =
        '"Afacad Flux", sans-serif';
    message.style.fontSize = "18px";
    message.style.lineHeight = "1.5";
    message.style.color = "#3C3D38";

    // CONTINUE BUTTON
    const continueButton = document.createElement("button");
    continueButton.textContent = "Tiếp tục xác minh OTP";
    continueButton.type = "button";
    continueButton.style.width = "100%";
    continueButton.style.height = "55px";
    continueButton.style.border = "none";
    continueButton.style.borderRadius = "8px";
    continueButton.style.background = "#7A2830";
    continueButton.style.color = "#FFFFFF";
    continueButton.style.fontFamily =
        '"Afacad Flux", sans-serif';
    continueButton.style.fontSize = "17px";
    continueButton.style.fontWeight = "600";
    continueButton.style.cursor = "pointer";

    // BUTTON CLICK
    continueButton.addEventListener(
        "click",
        function() {

            // Lưu email để trang Verify OTP
            // có thể sử dụng sau này
            sessionStorage.setItem(
                "forgotPasswordEmail",
                email
            );

            // Chuyển sang Verify OTP
            window.location.href =
                "verify-otp.html";
        }
    );

    // ADD ELEMENTS
    popup.appendChild(icon);
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(continueButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
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

        // CALL API
        try {

            // Loading
            setLoading(true);

            // Gọi API
            const result =
                await forgotPasswordAPI(email);

            // CHECK API RESULT
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

            // Tắt loading
            setLoading(false);
        }
    }
);