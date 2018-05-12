var cropper = (function (window, document) {
  // 鼠标开始点击时在canvas中的坐标位置，和在页面中的位置
  var startX = 0, startY = 0, startPageX = 0, startPageY = 0,
    // 鼠标结束时在canvas中的坐标位置，和在页面中的位置
    endX = 0, endY = 0,  endPageX = 0, endPageY = 0,
    // 裁剪图片的宽度/高度
    cropImageWidth = 0, cropImageHeight = 0,
    // 裁剪是否完成，鼠标是否按下
    done = false, mousedown = false;

  var canvas = document.createElement("canvas"),
    canvasContext = canvas.getContext("2d");
  // canvas 未设置宽高时，自身宽高默认为300*150，在页面中会占位，故用户未操作时，隐藏canvas
  canvas.style.display = 'none';
  document.body.appendChild(canvas);

  var img = document.querySelector("#cropper-image");
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
    // 设置鼠标进入图片时的样式
    if (!done) {
      img.style.cursor = 'crosshair';
    } else {
      img.style.cursor = 'default';
    }
  }, false);

  img.addEventListener("mousedown", function (event) {
    if (event.target.id === "cropper-image") {
      canvas.style.cursor = 'crosshair';
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

      getPosition(event);
    }
  }, false);

  // 鼠标初次mousedown，是在img上按下mousedown，第二次则是在canvas上，因为此时img已隐藏
  canvas.addEventListener("mousedown", function (event) {
    getPosition(event);
  })

  // 分离出公共的函数
  function getPosition(event) {
    mousedown = true;
    // 获取鼠标的位置，和在canvas中的坐标
    startPageX = event.pageX;
    startPageY = event.pageY;
    startX = (startPageX - imageProp.left - imageProp.scrollLeft);
    startY = (startPageY - imageProp.top - imageProp.scrollTop);
  }

  // 鼠标mousemove选择裁剪的范围
  canvas.addEventListener("mousemove", function (event) {
    // 通过mousedown参数来防止鼠标mouseup后，鼠标mousemove，还会继续选择区域的问题
    if (mousedown) {
      endPageX = event.pageX;
      endPageY = event.pageY;
      canvas.style.cursor = 'crosshair';
      // 裁剪图像的宽高
      cropImageWidth = Math.abs(endPageX - startPageX);
      cropImageHeight = Math.abs(endPageY - startPageY);

      // 鼠标最终的坐标
      endX = endPageX - imageProp.left - imageProp.scrollLeft;
      endY = endPageY - imageProp.top - imageProp.scrollTop;

      // starX 取最小值是因为鼠标最终的坐标比鼠标起始的坐标小时，截图时的阴影需要获取到截图的鼠标最小值的位置
      startX = Math.min(startX, endX);
      startY = Math.min(startY, endY);
      // 将图片绘制到canvas中
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
  }, false)

  function end() {
    canvas.style.cursor = 'default';
    var sourceImage = new Image();
    sourceImage.src = img.src;

    var sourceImageWidth = sourceImage.width;
    var sourceImageHeight = sourceImage.height;
    /*
    * 计算图片原始大小与设置后的图片大小的比例
    * <img src="image-src" width="400" height="200"/>
    * 如果没有设置图片的width/height，则比例为1
    */
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

    var cropData = tempCanvas.toDataURL("image/png");
    img.style.visibility = 'visible';
    img.style.cursor = 'default';
    canvas.style.display = "none"

    // 没有在图片上选择区域时，cropData的数据为'data:,'
    if (cropData == 'data:,') {
      return '';
    }
    return cropData;
  }

  return {
    end:end
  }

})(window, document)