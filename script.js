$(document).ready(function() {
  const video = document.getElementById("video-preview");
  let qrCodeDetected = false; // Flag to track if QR code has been detected

  // Check if the browser supports the getUserMedia API
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function(stream) {
        // Set the video source to the camera stream
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(tick);
      })
      .catch(function(error) {
        console.error("Error accessing the camera: ", error);
      });
  } else {
    console.error("getUserMedia is not supported by this browser.");
  }

  function tick() {
    if (!qrCodeDetected && video.readyState === video.HAVE_ENOUGH_DATA) {
      // Capture the current video frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the QR code data from the captured frame
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      // If a QR code is detected, open the link in a new tab
      if (code) {
        qrCodeDetected = true; // Set the flag to true
        window.open(code.data, "_blank");
      }
    }

    // Stop scanning if a QR code has been detected
    if (!qrCodeDetected) {
      // Continue scanning frames
      requestAnimationFrame(tick);
    }
  }
});
