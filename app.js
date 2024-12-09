function showNotification(message, description) {
  const notification = document.getElementById("notification");
  const messageContainer = document.getElementById("notification-message");
  const messageDescription = document.getElementById(
    "notification-description"
  );
  messageContainer.textContent = message;
  messageDescription.textContent = description;
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

// QR Code Generator Logic
document.getElementById("generate-btn").addEventListener("click", function () {
  const url = document.getElementById("url-input").value;
  const uploadedImage = document.getElementById("dropzone-file").files[0];

  if (url) {
    const qr = new QRious({
      element: document.getElementById("qr-code"),
      size: 256,
      value: url,
    });

    // If an image is uploaded, draw it on the QR code
    if (uploadedImage) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Create a new image element
        const img = new Image();
        img.src = e.target.result; // Set the source to the uploaded image

        img.onload = function () {
          // Get the canvas context
          const canvas = document.getElementById("qr-code");
          const ctx = canvas.getContext("2d");

          // Draw the QR code on the canvas
          ctx.drawImage(qr.canvas, 0, 0);

          // Calculate dimensions for the overlay image
          const qrSize = 256; // Size of the QR code
          const imgSize = qrSize / 6; // Make the image small enough to fit in the center

          // Draw the uploaded image at the center of the QR code
          ctx.drawImage(
            img,
            (qrSize - imgSize) / 2,
            (qrSize - imgSize) / 2,
            imgSize,
            imgSize
          );
        };

        showNotification(
          "QR Code Generated",
          "Your QR code has been generated with the uploaded image."
        );
      };

      reader.readAsDataURL(uploadedImage); // Read the file as a data URL
    } else {
      showNotification("QR Code Generated", "Your QR code has been generated.");
    }
  } else {
    showNotification("Invalid URL", "Please enter a valid URL");
  }
});

// Handle file uploads
document
  .getElementById("dropzone-file")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      // Ensure the uploaded file is an image
      if (!file.type.startsWith("image/")) {
        showNotification(
          "Invalid File Type",
          "Please upload an image (PNG or JPG)."
        );
        return;
      }

      reader.onload = function (e) {
        // Show a notification that an image has been uploaded
        showNotification(
          "Image Uploaded",
          "You can now generate a QR code with this image."
        );
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      showNotification("No File Selected", "Please select a file to upload.");
    }
  });

// Download QR Code
document
  .getElementById("download-qr")
  .addEventListener("click", function (event) {
    // Get the canvas element containing the QR code
    const canvas = document.getElementById("qr-code");

    // Create a temporary link element
    const downloadLink = document.createElement("a");

    // Set the download attribute with a filename
    downloadLink.download = "qr-code.png";

    // Convert the canvas content to a data URL
    downloadLink.href = canvas.toDataURL("image/png");

    // Simulate a click on the link to trigger the download
    downloadLink.click();
  });
