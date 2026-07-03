document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('complaintForm');
  const voiceBtn = document.getElementById('voiceBtn');
  const locationBtn = document.getElementById('locationBtn');
  const locationStatus = document.getElementById('locationStatus');
  const photoUpload = document.getElementById('photoUpload');
  const uploadText = document.getElementById('uploadText');

  let isRecording = false;

  // Voice record button (placeholder logic)
  voiceBtn.addEventListener('click', () => {
    isRecording = !isRecording;
    voiceBtn.classList.toggle('recording', isRecording);

    const voiceText = voiceBtn.querySelector('.voice-text');
    voiceText.textContent = isRecording ? 'Recording...' : 'Record Voice';

    // Hook actual MediaRecorder / speech-to-text API here later
  });

  // File upload label update
  photoUpload.addEventListener('change', () => {
    if (photoUpload.files.length > 0) {
      uploadText.textContent = photoUpload.files[0].name;
    } else {
      uploadText.textContent = 'Upload Photo Evidence';
    }
  });

  // Location button
  locationBtn.addEventListener('click', () => {
    alert('Fetching GPS...');
    locationStatus.textContent = 'Fetching your current location...';

    // Placeholder for actual geolocation logic:
    // navigator.geolocation.getCurrentPosition(
    //   (pos) => {
    //     locationStatus.textContent = `Location captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
    //   },
    //   (err) => {
    //     locationStatus.textContent = 'Unable to fetch location.';
    //   }
    // );
  });

  // Prevent default form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('.submit-text').textContent;

    submitBtn.querySelector('.submit-text').textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Placeholder: send data to backend via fetch()
    setTimeout(() => {
      submitBtn.querySelector('.submit-text').textContent = 'Request Submitted ✓';
      setTimeout(() => {
        submitBtn.querySelector('.submit-text').textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        uploadText.textContent = 'Upload Photo Evidence';
        locationStatus.textContent = '';
      }, 2000);
    }, 1200);
  });
});