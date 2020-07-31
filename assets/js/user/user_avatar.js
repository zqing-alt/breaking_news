$(function () {
  // 1初始化图片选择区域
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  // 2 为选择按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })
  // 3 文件选择的change事件
  $('#file').on("change", function (e) {
    // 3.1 先判断用户是否选择了图片
    // if (e.target.files.length <= 0) {
    //   return layui.layer.msg("请选择图片")
    // }

    if (this.files.length <= 0) {
      return layui.layer.msg("请选择图片")
    }

    // 3.2拿到上传的文件
    var file = this.files[0];

    // 3.3将文件，转化为路径 URL.createObjectURL获取到内存中这个图片的路径
    var imgURL = URL.createObjectURL(file);

    // 3.4重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 4 为确定按钮绑定点击事件
  $('#btnUpload').on('click', function () {
    // 拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')

    // 调用接口，把头像上传到服务器
    $.ajax({
      type: 'post',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status != 0) return layui.layer.msg("更换头像失败");
        layui.layer.msg("更换头像成功");
        // 调用父级的函数
        window.parent.getUserInfo();
      }
    })
  })
})