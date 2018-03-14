(function (window, document) {
  var startX = 0, startY = 0, startPageX = 0, startPageY = 0,
      endX = 0, endY = 0,  endPageX = 0, endPageY = 0,
      cropImageWidth = 0, cropImageHeight = 0,done = false, mousedown = false;


  var canvas = document.createElement("canvas"),
      canvasContext = canvas.getContext("2d");
  document.body.appendChild(canvas);

  var img = document.querySelector(".canvas-cropper");
  var rect = img.getBoundingClientRect();
  var imageProp = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    scrollLeft: document.documentElement.scrollLeft,
    scrollTop: document.documentElement.scrollTop
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
      canvas.style.top = imageProp.top + imageProp.scrollTop + 'px';
      canvas.style.left = imageProp.left + imageProp.scrollLeft + 'px';
      canvasContext.drawImage(img, 0, 0);
      canvasContext.fillStyle = "rgba(0,0,0,0.4)";
      canvasContext.fillRect(0,0,imageProp.width, imageProp.height);

      img.style.visibility = "hidden";
      startPageX = event.pageX;
      startPageY = event.pageY;
      startX = (event.pageX - imageProp.left - imageProp.scrollLeft);
      startY = (event.pageY - imageProp.top - imageProp.scrollTop);
    }
  }, false);

  canvas.addEventListener("mousemove", function (event) {
    if (mousedown && !done) {
      endPageX = event.pageX;
      endPageY = event.pageY;

      // 裁剪图像的宽高
      cropImageWidth = Math.abs(endPageX - startPageX);
      cropImageHeight = Math.abs(endPageY - startPageY);

      // 鼠标最终的坐标
      endX = endPageX - imageProp.left - imageProp.scrollLeft;
      endY = endPageY - imageProp.top - imageProp.scrollTop;

      // starX 取最小值是因为鼠标最终的坐标比鼠标起始的坐标小时，截图时的阴影需要获取到截图的鼠标最小值的位置
      startX = Math.min(startX, endX);
      startY = Math.min(startY, endY);

      // 截图时周围的阴影
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
    // 把canvas截取的图片替换初始的图片
    var cropData = canvas.toDataURL("image/png");
    img.src = cropData;
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    document.body.removeChild(canvas);
  }, false)

}(window, document))