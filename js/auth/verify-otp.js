// GET ELEMENTS

const verifyOtpForm =
    document.getElementById("verifyOtpForm");

const otpInputs =
    document.querySelectorAll(".otp-input");

const otpEmail =
    document.getElementById("otpEmail");

const otpError =
    document.getElementById("otpError");

const otpErrorText =
    document.getElementById("otpErrorText");

const otpTimer =
    document.getElementById("otpTimer");

const countdown =
    document.getElementById("countdown");

const resendOtp =
    document.getElementById("resendOtp");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");

const verifyButtonText =
    document.getElementById("verifyButtonText");

// CONFIG

const OTP_LENGTH = 6;

const COUNTDOWN_SECONDS = 60;


// OTP giả để test frontend
// Sau này Backend sẽ thay bằng API thật.
const MOCK_OTP = "123456";

// STATE
let remainingSeconds = COUNTDOWN_SECONDS;

let countdownInterval = null;

let isLoading = false;


// EMAIL
// Lấy email từ Forgot Password
const savedEmail =
    localStorage.getItem("forgotPasswordEmail");
if (savedEmail) {
    otpEmail.textContent = savedEmail;
} else {
    otpEmail.textContent =
        "email của bạn";
}

// GET OTP VALUE
function getOtpValue() {
    let otp = "";
    otpInputs.forEach(function(input) {
        otp += input.value;
    });
    return otp;
}

// CLEAR OTP ERROR
function clearOtpError() {
    otpError.classList.remove("show");
    otpInputs.forEach(function(input) {
        input.classList.remove("error");
    });
}

// SHOW INVALID OTP
function showInvalidOtp() {
    otpErrorText.textContent =
        "Mã OTP không chính xác. Vui lòng thử lại.";
    otpError.classList.add("show");
    otpInputs.forEach(function(input) {
        input.classList.add("error");
    });
}

// SHOW EXPIRED OTP
function showExpiredOtp() {
    otpErrorText.textContent =
        "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.";
    otpError.classList.add("show");
    otpInputs.forEach(function(input) {
        input.classList.add("error");
    });
}

// CLEAR OTP INPUTS
function clearOtpInputs() {
    otpInputs.forEach(function(input) {
        input.value = "";
        input.classList.remove("error");
    });
    otpInputs[0].focus();
}

// FORMAT TIME
function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);
    const remaining =
        seconds % 60;
    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(remaining).padStart(2, "0")
    );
}

// UPDATE COUNTDOWN
function updateCountdown() {
    countdown.textContent =
        formatTime(remainingSeconds);
    if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        countdown.textContent = "00:00";
        otpTimer.classList.add("expired");
        resendOtp.disabled = false;
        return;
    }
    remainingSeconds--;
}

// START COUNTDOWN
function startCountdown() {
    clearInterval(countdownInterval);
    remainingSeconds =
        COUNTDOWN_SECONDS;
    otpTimer.classList.remove("expired");
    resendOtp.disabled = true;
    countdown.textContent =
        formatTime(remainingSeconds);
    countdownInterval =
        setInterval(
            updateCountdown,
            1000
        );
}

// OTP INPUT - AUTO FOCUS
otpInputs.forEach(function(input, index) {

    // INPUT
    input.addEventListener(
        "input",
        function() {
            clearOtpError();

            // Chỉ giữ số
            input.value =
                input.value.replace(
                    /\D/g,
                    ""
                );

            // Nếu có số
            // chuyển sang ô tiếp theo
            if (
                input.value &&
                index < OTP_LENGTH - 1
            ) {
                otpInputs[index + 1].focus();
            }
        }
    );

    // KEYBOARD
    input.addEventListener(
        "keydown",
        function(event) {


            // BACKSPACE
            if (
                event.key === "Backspace" &&
                !input.value &&
                index > 0
            ) {
                otpInputs[index - 1].focus();
            }

            // ARROW LEFT
            if (
                event.key === "ArrowLeft" &&
                index > 0
            ) {
                event.preventDefault();
                otpInputs[index - 1].focus();
            }

            // ARROW RIGHT
            if (
                event.key === "ArrowRight" &&
                index < OTP_LENGTH - 1
            ) {
                event.preventDefault();
                otpInputs[index + 1].focus();
            }
        }
    );

    // PASTE
    input.addEventListener(
        "paste",
        function(event) {
            event.preventDefault();
            const pastedText =
                event.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, OTP_LENGTH);
            if (!pastedText) {
                return;
            }
            pastedText
                .split("")
                .forEach(function(number, pasteIndex) {
                    if (
                        otpInputs[pasteIndex]
                    ) {
                        otpInputs[pasteIndex].value =
                            number;
                    }
                });
            const nextIndex =
                Math.min(
                    pastedText.length,
                    OTP_LENGTH - 1
                );
            otpInputs[nextIndex].focus();
        }
    );
});

// RESEND OTP API
async function resendOtpAPI() {

    /*
     * TODO:
     *
     * Thay bằng API thật khi Backend cung cấp.
     *
     * Ví dụ:
     *
     * const response = await fetch(
     *     "/api/auth/resend-otp",
     *     {
     *         method: "POST",
     *         headers: {
     *             "Content-Type": "application/json"
     *         },
     *         body: JSON.stringify({
     *             email: savedEmail
     *         })
     *     }
     * );
     *
     * return await response.json();
     */


    // MOCK API
    await new Promise(function(resolve) {
        setTimeout(resolve, 700);
    });
    return {
        success: true
    };
}

// VERIFY OTP API
async function verifyOtpAPI(otp) {
    /*
     * TODO:
     *
     * Sau này thay bằng API thật.
     *
     * Ví dụ:
     *
     * const response = await fetch(
     *     "/api/auth/verify-otp",
     *     {
     *         method: "POST",
     *         headers: {
     *             "Content-Type": "application/json"
     *         },
     *         body: JSON.stringify({
     *             email: savedEmail,
     *             otp: otp
     *         })
     *     }
     * );
     *
     * return await response.json();
     */


    // MOCK API
    await new Promise(function(resolve) {
        setTimeout(resolve, 800);
    });
    return {
        success: otp === MOCK_OTP
    };
}

// LOADING STATE
function setLoading(loading) {
    isLoading = loading;
    verifyOtpButton.disabled =
        loading;
    if (loading) {
        verifyButtonText.textContent =
            "Đang xác minh...";
    } else {
        verifyButtonText.textContent =
            "Xác minh OTP";
    }
}

// VERIFY OTP
verifyOtpForm.addEventListener(
    "submit",
    async function(event) {
        event.preventDefault();

        // Không cho submit nhiều lần
        if (isLoading) {
            return;
        }
        clearOtpError();
        const otp =
            getOtpValue();
            
        // CHECK 6 DIGITS
        if (
            otp.length !== OTP_LENGTH
        ) {
            otpErrorText.textContent =
                "Vui lòng nhập đủ 6 chữ số OTP.";
            otpError.classList.add("show");
            otpInputs.forEach(function(input) {
                input.classList.add("error");
            });
            return;
        }

        // CHECK EXPIRED
        if (remainingSeconds <= 0) {
            showExpiredOtp();
            return;
        }
        try {

            // LOADING
            setLoading(true);

            // API
            const result =
                await verifyOtpAPI(otp);

            // INVALID
            if (!result.success) {
                showInvalidOtp();
                return;
            }

            // SUCCESS
            localStorage.setItem(
                "otpVerified",
                "true"
            );

            // Chuyển sang Reset Password
            window.location.href =
                "reset-password.html";
        } catch (error) {
            console.error(
                "Verify OTP Error:",
                error
            );
            otpErrorText.textContent =
                "Có lỗi xảy ra. Vui lòng thử lại.";
            otpError.classList.add("show");
        } finally {
            setLoading(false);
        }
    }
);

// RESEND OTP
resendOtp.addEventListener(
    "click",
    async function() {
        if (resendOtp.disabled) {
            return;
        }
        try {
            resendOtp.disabled = true;
            resendOtp.textContent =
                "Đang gửi...";
            const result =
                await resendOtpAPI();
            if (!result.success) {
                throw new Error(
                    "Resend OTP failed"
                );
            }

            // Xóa OTP cũ
            clearOtpInputs();
            clearOtpError();

            // Reset timer
            startCountdown();
        } catch (error) {
            console.error(
                "Resend OTP Error:",
                error
            );
            resendOtp.disabled = false;
            resendOtp.textContent =
                "Gửi lại mã OTP";
            return;
        }
        resendOtp.textContent =
            "Gửi lại mã OTP";
    }
);


// START TIMER
startCountdown();

// AUTO FOCUS FIRST OTP
otpInputs[0].focus();