## canvas 实现图片剪切

## 使用方法
- 引入`cropper.js`文件
- 在`img` 标签内加上`cropper-image`的ID
```html
<img src="imageSrc" id="cropper-image"/>
<script src="cropper.js"></script>
<script>
// 得到裁剪后的图片
var imageSrc = cropper.end();
</script>
```

## 截图
![cropper-image](./screenshots/cropper-image.gif)