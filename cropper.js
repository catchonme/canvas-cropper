(function (window, document) {
  var startX = 0, startY = 0, startPageX = 0, startPageY = 0,
    endX = 0, endY = 0,  endPageX = 0, endPageY = 0,
    cropImageWidth = 0, cropImageHeight = 0,
    done = false, mousedown = false;

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

      // 设置canvas的样式，
      canvas.width = imageProp.width;
      canvas.height = imageProp.height;
      canvas.style.position = "absolute";
      canvas.style.display = "block";
      canvas.style.top = imageProp.top + imageProp.scrollTop + 'px';
      canvas.style.left = imageProp.left + imageProp.scrollLeft + 'px';
      // 将初始图片写入canvas，并绘制阴影，原始图片设置隐藏
      canvasContext.drawImage(img, 0, 0, imageProp.width, imageProp.height);
      canvasContext.fillStyle = "rgba(0,0,0,0.4)";
      canvasContext.fillRect(0,0,imageProp.width, imageProp.height);
      img.style.visibility = "hidden";

      // 获取鼠标的位置，和在canvas中的坐标
      startPageX = event.pageX;
      startPageY = event.pageY;
      startX = (startPageX - imageProp.left - imageProp.scrollLeft);
      startY = (startPageY - imageProp.top - imageProp.scrollTop);
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

      canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 截图时周围的阴影
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

    var sourceImage = new Image();
    sourceImage.src = img.src;

    var sourceImageWidth = sourceImage.width;
    var sourceImageHeight = sourceImage.height;
    // 计算图片原始大小与设置后的图片大小的比例
    var widthRatio = sourceImageWidth / imageProp.width;
    var heightRatio = sourceImageHeight / imageProp.height;

    var sourceStartX = startX * widthRatio;
    var sourceStartY = startY * heightRatio;

    var actualCropWidth = cropImageWidth * widthRatio;
    var actualCropHeight = cropImageHeight * heightRatio;

    var tempCanvas = document.createElement("canvas");
    var tempCanvasContext = tempCanvas.getContext("2d");
    tempCanvas.width = actualCropWidth;
    tempCanvas.height = actualCropHeight;

    tempCanvasContext.drawImage(sourceImage, sourceStartX, sourceStartY, actualCropWidth, actualCropHeight, 0, 0, actualCropWidth, actualCropHeight);

    var tempCropData = tempCanvas.toDataURL("image/png");
    img.src = tempCropData;

    img.style.visibility = 'visible';
    img.style.cursor = 'default';

    document.body.removeChild(canvas);
  }, false)

}(window, document))