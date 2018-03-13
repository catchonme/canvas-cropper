(function (window, document) {
  var startX = 0, startY = 0,cropImageWidth = 0, cropImageHeight = 0,done = false, mousedown = false;

  var canvas = document.createElement("canvas"),
      canvasContext = canvas.getContext("2d");
  document.body.appendChild(canvas);

  var img = document.querySelector(".canvas-cropper");
  var imageProp = {
    left: img.offsetLeft,
    top: img.offsetTop,
    width: img.offsetWidth,
    height: img.offsetHeight
  }

  img.addEventListener("mouseenter", function () {
    if (!done) {
      img.style.cursor = 'Crosshair';
    } else {
      img.style.cursor = 'default';
    }
  }, false);

  img.addEventListener("mousedown", function (event) {
    if (event.target.tagName === "IMG" && !done) {
      mousedown = true;

      canvas.width = imageProp.width;
      canvas.height = imageProp.height;
      canvas.style.position = "absolute";
      canvas.style.display = "block";
      canvas.style.top = imageProp.top + 'px';
      canvas.style.left = imageProp.left + 'px';
      canvasContext.drawImage(img, 0, 0);
      canvasContext.fillStyle = "rgba(0,0,0,0.4)";
      canvasContext.fillRect(0,0,imageProp.width, imageProp.height);

      img.style.visibility = "hidden";
      startX = (event.clientX - imageProp.left);
      startY = (event.clientY - imageProp.top);
    }
  }, false);

  canvas.addEventListener("mousemove", function (event) {
    if (mousedown && !done) {
      cropImageWidth = event.clientX - imageProp.left - startX;
      cropImageHeight = event.clientY - imageProp.top - startY;
      canvasContext.drawImage(img, 0, 0);
      canvasContext.fillStyle = "rgba(0, 0, 0, 0.8)";
      canvasContext.fillRect(0, 0, startX, imageProp.height);
      canvasContext.fillRect(startX + cropImageWidth, 0, imageProp.width - cropImageWidth, imageProp.height );
      canvasContext.fillRect(startX, 0, cropImageWidth, startY);
      canvasContext.fillRect(startX, startY + cropImageHeight, cropImageWidth, imageProp.height - cropImageHeight);
    }
  }, false);

  canvas.addEventListener("mouseup", function () {
    mousedown = false;
    done = true;
    canvas.width = cropImageWidth;
    canvas.height = cropImageHeight;
    canvasContext.drawImage(img, startX, startY, cropImageWidth, cropImageHeight, 0, 0, cropImageWidth, cropImageHeight);
    img.style.visibility = 'visible';
    img.style.cursor = 'default';
    var cropData = canvas.toDataURL("image/png");
    img.src = cropData;
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    document.body.removeChild(canvas);
  }, false)

}(window, document))