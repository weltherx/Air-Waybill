function startScan() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            const video = document.getElementById('camera');
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        });

    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");

    function tick() {
        const video = document.getElementById('camera');
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                document.getElementById("result").textContent = "QR Code Data: " + code.data;
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            } else {
                requestAnimationFrame(tick);
            }
        } else {
            requestAnimationFrame(tick);
        }
    }
}

const form = document.getElementById('vehicleForm');
const vehicleNumberInput = document.getElementById('vehicleNumber');
const fleetInput = document.getElementById('fleet');

window.onload = function () {
    // Verify and load data from localStorage
    const savedVehicleNumber = localStorage.getItem('vehicleNumber');
    const savedFleet = localStorage.getItem('fleet');

    if (savedVehicleNumber) {
        vehicleNumberInput.value = savedVehicleNumber;
    }
    if (savedFleet) {
        fleetInput.value = savedFleet;
    }
};

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Store the data in local storage
    localStorage.setItem('vehicleNumber', vehicleNumberInput.value);
    localStorage.setItem('fleet', fleetInput.value);

    alert('Informațiile au fost salvate cu succes!');
});