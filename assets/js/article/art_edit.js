// 1.获取文章id值,根据id值获得文章内容
// var str = location.href;
// var arr = str.split('=');
// var id = arr[arr.length - 1];
// console.log(id);
// 通过 URLSearchParams 对象，获取 URL 传递过来的参数
var params = new URLSearchParams(location.search);
var id = params.get('id')

// 2 初始化页面内容
// 2.1 渲染文章分类列表
initCate();
// 2.2 自动填充表格内容--
$.ajax({
  type: 'get',
  url: '/my/article/' + id,
  success: function (res) {
    if (res.status != 0) return layer.msg(res.message)
    var art = res.data;

    // 2.2.1 自动填充表格内容
    layui.form.val('form_publish', {
      Id: art.Id,
      title: art.title,
      cate_id: art.cate_id,
      content: art.content
    })

    //  2.2.2 自动填充封面
    //  a 初始化图片裁剪器
    var $image = $('#image')
    // b 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    // c 初始化裁剪区域
    $image
      .attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img)
      .cropper(options)
  }
})



// 3 文章内容 -- 初始化富文本编辑器
initEditor();


// 4 封面选择区域功能 
$('#btnChooseImage').on('click', function () {
  $('#file').click();
})
$('#file').on('change', function () {
  console.dir(this.files);
  if (this.files.length <= 0) {
    return;
  }
  // 根据文件，创建对应的 URL 地址
  var newImgURL = URL.createObjectURL(this.files[0])
  // 为裁剪区域重新设置图片
  $('#image')
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', newImgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
})

// 5 发布文章区域功能
var state = "已发布";

$('#btnSave').on('click', function () {
  state = '草稿';
})
$('#form_publish').on('submit', function (e) {
  e.preventDefault();
  // console.log(this);
  // console.log($(this)[0]);
  // 1 创建一个formdata对象
  var fd = new FormData(this);
  // 2 将文章状态添加到formdata中
  fd.append('state', state);
  // 3. 将封面裁剪过后的图片，输出为一个文件对象
  $('#image')
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function (blob) {
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 4. 将文件对象，存储到 fd 中
      fd.append('cover_img', blob);
      // 5. 发起 ajax 数据请求
      publishArticle(fd);
    })

})

// 6 函数区域
var {
  form
} = layui;
var data = {
  pagenum: 1,
  pagesize: 2,
  cate_id: '',
  state: ''
}

// 初始化文章类别函数
function initCate() {
  $.ajax({
    type: 'get',
    url: '/my/article/cates',
    success: function (res) {
      if (res.status != 0) return layui.layer.msg(res.message);
      var htmlStr = template('tpl-select', res)
      $('[name=cate_id]').html(htmlStr);
      // 通过 layui 重新渲染表单区域的UI结构
      form.render()
    }
  })
}

// 发布文章函数
function publishArticle(fd) {
  $.ajax({
    type: 'POST',
    url: '/my/article/edit',
    data: fd,
    // 注意：如果向服务器提交的是 FormData 格式的数据，
    // 必须添加以下两个配置项
    contentType: false,
    processData: false,
    success: function (res) {
      if (res.status != 0) return layui.layer.msg(res.message);
      // layui.layer.msg(res.message);
      location.href = '/article/art_list.html'
    }
  })
}