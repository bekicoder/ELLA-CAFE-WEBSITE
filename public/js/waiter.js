const scanBtn = document.getElementById("scanBtn");
const reader = document.getElementById("reader");
const scannerOverlay = document.getElementById("scannerOverlay");
const closeScanner = document.getElementById("close_scaner");
const torchBtn = document.getElementById("torch-btn");
const flashOn = document.querySelector(".flash-on");
const flashOff = document.querySelector(".flash-of");

let html5QrCode = null;
let torchOn = false;

// 📸 Start scanning
scanBtn.addEventListener("click", async () => {
  try {
    reader.style.display = "block";
    scanBtn.disabled = true;
    scannerOverlay.classList.remove("hidden");

    html5QrCode = new Html5Qrcode("reader");
    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

    await html5QrCode.start(
      { facingMode: "environment" },
      qrConfig,
      (decodedText) => {
        console.log("QR code:", decodedText);
        stopScanner();
      },
      (errorMessage) => {
        // ignore small errors
      }
    );
  } catch (err) {
    console.error("Camera start failed:", err);
    scanBtn.disabled = false;
  }
});

// 💡 Torch toggle
torchBtn.addEventListener("click", async () => {
  if (!html5QrCode) {
    alert("Camera not started yet!");
    return;
  }

  // toggle icons
  flashOff.classList.toggle("hidden");
  flashOn.classList.toggle("hidden");

  torchOn = !torchOn;

  try {
    await html5QrCode.applyVideoConstraints({ advanced: [{ torch: torchOn }] });
  } catch (err) {
    console.error("Torch control failed:", err);
    alert("Torch not supported on this device or browser.");
  }
});

// ❌ Close scanner
closeScanner.addEventListener("click", stopScanner);

async function stopScanner() {
  try {
    if (html5QrCode) {
      await html5QrCode.stop();
      html5QrCode.clear();
      html5QrCode = null;
    }
  } catch (err) {
    console.warn("Error stopping camera:", err);
  }

  // reset UI
  scannerOverlay.classList.add("hidden");
  reader.style.display = "none";
  scanBtn.disabled = false;

  // reset torch state
  if (torchOn) {
    flashOn.classList.add("hidden");
    flashOff.classList.remove("hidden");
    torchOn = false;
  }
}

// 🧹 Stop camera if user leaves the page
window.addEventListener("beforeunload", stopScanner);
