document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
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
  const t = message => window.JanAwaazI18n?.t(message) || message;

  window.addEventListener('janawaaz:languagechange', () => window.JanAwaazI18n?.apply());

  mobileInput.addEventListener('input', () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
  });

  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/\D/g, '').slice(0, 1);
      if (box.value && index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
      errorMessage.classList.remove('show');
    });

    box.addEventListener('keydown', event => {
      if (event.key === 'Backspace' && !box.value && index > 0) otpBoxes[index - 1].focus();
    });
  });

  sendOtpBtn.addEventListener('click', async () => {
    const number = mobileInput.value.trim();
    if (number.length !== 10) {
      mobileInput.focus();
      showMessage(t('Enter a valid 10-digit mobile number.'));
      return;
    }

    await withButton(sendOtpBtn, t('Sending...'), async () => {
      try {
        await fetch(`${API_BASE}/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: number })
        });
      } catch (error) {
        // Demo OTP still works without the backend.
      }

      mobileDisplay.textContent = `+91 ${number}`;
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      step2.classList.add('fade-in');
      otpBoxes.forEach(box => { box.value = ''; });
      otpBoxes[0].focus();
    });
  });

  verifyBtn.addEventListener('click', async () => {
    const enteredOtp = Array.from(otpBoxes).map(box => box.value).join('');
    if (enteredOtp.length !== 4) {
      showError();
      return;
    }

    await withButton(verifyBtn, t('Verifying...'), async () => {
      try {
        const response = await fetch(`${API_BASE}/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: mobileInput.value, otp: enteredOtp })
        });
        if (!response.ok) throw new Error('Invalid OTP');
      } catch (error) {
        if (enteredOtp !== '1234') {
          showError();
          return;
        }
      }

      localStorage.setItem('janawaaz-officer-auth', 'true');
      verifyBtn.querySelector('.btn-text').textContent = t('Verified');
      setTimeout(() => {
        window.location.href = 'mp-dash.html';
      }, 500);
      return 'keep-loading';
    });
  });

  resendLink.addEventListener('click', event => {
    event.preventDefault();
    if (resendLink.classList.contains('disabled')) return;

    resendLink.classList.add('disabled');
    resendLink.textContent = t('Resending...');
    setTimeout(() => {
      resendLink.textContent = t('Resend OTP');
      resendLink.classList.remove('disabled');
      errorMessage.classList.remove('show');
      otpBoxes.forEach(box => { box.value = ''; });
      otpBoxes[0].focus();
    }, 1000);
  });

  backBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step2.classList.remove('fade-in');
    step1.classList.remove('hidden');
    errorMessage.classList.remove('show');
    mobileInput.focus();
  });

  async function withButton(button, loadingText, task) {
    const textNode = button.querySelector('.btn-text');
    const originalText = textNode.textContent;
    textNode.textContent = loadingText;
    button.disabled = true;
    const result = await task();
    if (result === 'keep-loading') return;
    if (!button.disabled) return;
    textNode.textContent = originalText;
    button.disabled = false;
  }

  function showError() {
    showMessage(t('Invalid OTP. Use 1234 for this MVP demo.'));
    otpBoxes.forEach(box => {
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
    });
  }

  function showMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
  }
});
