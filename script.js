const video = document.querySelector("video");
const button = document.getElementById("btn");
const speechText = document.querySelector('[data-text]');

// Set up Tesseract
Tesseract.recognize('', 'eng', { logger: m => console.log(m) }).then(({ data: { text } }) => {
  console.log(text);
});

// Access the camera and stream video to the video element
navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch(err => {
    console.log(err);
  });

// Take a picture and process the image using Tesseract
button.addEventListener("click", () => {
  // Capture image from the video stream
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert the image to a data URL
  const dataUrl = canvas.toDataURL('image/png');
  
  // Process the image using Tesseract
  Tesseract.recognize(dataUrl, 'eng', { logger: m => console.log(m) }).then(({ data: { text } }) => {
    console.log(text);
    // Set the text on the page and read it aloud
    speechText.innerText = text;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  });
});