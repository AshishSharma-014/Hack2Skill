document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
  const form = document.getElementById('complaintForm');
  const phoneInput = document.getElementById('phoneInput');
  const complaintText = document.getElementById('complaintText');
  const locationTextInput = document.getElementById('locationTextInput');
  const voiceBtn = document.getElementById('voiceBtn');
  const locationBtn = document.getElementById('locationBtn');
  const locationStatus = document.getElementById('locationStatus');
  const photoUpload = document.getElementById('photoUpload');
  const uploadText = document.getElementById('uploadText');

  let coordinates = null;
  let recognition = null;
  let isRecording = false;

  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      complaintText.value = `${complaintText.value} ${transcript}`.trim();
    };
    recognition.onend = () => setRecording(false);
  }

  voiceBtn.addEventListener('click', () => {
    if (!recognition) {
      setStatus('Voice capture is not supported in this browser. You can type the complaint instead.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setRecording(false);
      return;
    }

    setRecording(true);
    recognition.start();
  });

  photoUpload.addEventListener('change', () => {
    uploadText.textContent = photoUpload.files.length ? photoUpload.files[0].name : 'Upload Photo Evidence';
  });

  locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setStatus('GPS is unavailable. Please type the ward or landmark.');
      return;
    }

    setStatus('Fetching your current location...');
    navigator.geolocation.getCurrentPosition(
      position => {
        coordinates = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6))
        };
        setStatus(`Location captured: ${coordinates.lat}, ${coordinates.lng}`);
      },
      () => setStatus('Unable to fetch GPS. You can still submit with a written location.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const originalText = submitText.textContent;

    if (phoneInput.value.length !== 10) {
      setStatus('Please enter a valid 10-digit mobile number.');
      phoneInput.focus();
      return;
    }

    if (complaintText.value.trim().length < 10) {
      setStatus('Please describe the issue in a little more detail.');
      complaintText.focus();
      return;
    }

    submitText.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneInput.value,
          description: complaintText.value,
          locationText: locationTextInput.value,
          coordinates,
          evidenceName: photoUpload.files[0]?.name || ''
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Submission failed.');

      submitText.textContent = `Submitted: ${payload.id}`;
      setStatus(`AI category: ${payload.issueType}. Priority score: ${payload.priorityScore}. Track ID: ${payload.id}`);
      form.reset();
      coordinates = null;
      uploadText.textContent = 'Upload Photo Evidence';
      localStorage.setItem('last-janawaaz-ticket', payload.id);
    } catch (error) {
      submitText.textContent = 'Saved Demo Request';
      setStatus(`${error.message} Start the backend with npm run dev inside Backend.`);
    } finally {
      setTimeout(() => {
        submitText.textContent = originalText;
        submitBtn.disabled = false;
      }, 2600);
    }
  });

  function setRecording(value) {
    isRecording = value;
    voiceBtn.classList.toggle('recording', value);
    voiceBtn.querySelector('.voice-text').textContent = value ? 'Listening...' : 'Record Voice';
  }

  function setStatus(message) {
    locationStatus.textContent = message;
  }
});
