document.addEventListener('DOMContentLoaded', () => {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const mobileInput = document.getElementById('mobileInput');
  const mobileDisplay = document.getElementById('mobileDisplay');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const verifyBtn = document.getElementById('verifyBtn');
  const resendLink = document.getElementById('resendLink');
  const backBtn = document.getElementById('backBtn');
  const errorMessage = document.getElementById('errorMessage');
  const otpBoxes = document.querySelectorAll('.otp-box');

  const DUMMY_OTP = '1234';

  // Only allow digits in mobile input
  mobileInput.addEventListener('input', () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
  });

  // Auto-advance OTP boxes
  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/\D/g, '').slice(0, 1);
      if (box.value && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
      errorMessage.classList.remove('show');
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });
  });

  // Send OTP
  sendOtpBtn.addEventListener('click', () => {
    const number = mobileInput.value.trim();

    if (number.length !== 10) {
      mobileInput.style.borderColor = '#ff4d4d';
      mobileInput.focus();
      setTimeout(() => { mobileInput.style.borderColor = ''; }, 1500);
      return;
    }

    const btnText = sendOtpBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending...';
    sendOtpBtn.disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Send OTP';
      sendOtpBtn.disabled = false;

      mobileDisplay.textContent = `+91 ${number}`;

      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      step2.classList.add('fade-in');

      otpBoxes.forEach(b => b.value = '');
      otpBoxes[0].focus();
    }, 1000);
  });

  // Verify OTP
  verifyBtn.addEventListener('click', () => {
    const enteredOtp = Array.from(otpBoxes).map(b => b.value).join('');

    if (enteredOtp.length !== 4) {
      showError();
      return;
    }

    if (enteredOtp === DUMMY_OTP) {
      const btnText = verifyBtn.querySelector('.btn-text');
      btnText.textContent = 'Verified ✓';
      verifyBtn.disabled = true;

      setTimeout(() => {
        window.location.href = 'mp-dashboard.html';
      }, 600);
    } else {
      showError();
    }
  });

  function showError() {
    errorMessage.classList.add('show');
    otpBoxes.forEach(box => {
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
    });
  }

  // Resend OTP
  resendLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (resendLink.classList.contains('disabled')) return;

    resendLink.classList.add('disabled');
    resendLink.textContent = 'Resending...';

    setTimeout(() => {
      resendLink.textContent = 'Resend OTP';
      resendLink.classList.remove('disabled');
      errorMessage.classList.remove('show');
      otpBoxes.forEach(b => b.value = '');
      otpBoxes[0].focus();
    }, 1200);
  });

  // Back to mobile number step
  backBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step2.classList.remove('fade-in');
    step1.classList.remove('hidden');
    errorMessage.classList.remove('show');
    mobileInput.focus();
  });
});