const { createWorker } = Tesseract;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const resultEl = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(error => {
    console.error(error);
  });

captureBtn.addEventListener('click', () => {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imgData = canvas.toDataURL('image/png');
  createWorker().then(worker => {
    const img = new Image();
    img.onload = () => {
      worker.recognize(img).then(result => {
        resultEl.textContent = result.text;
        speakText(result.text);
      });
    };
    img.src = imgData;
  });
});

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
