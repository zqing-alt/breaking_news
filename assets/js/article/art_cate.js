$(function () {
  // 获取文章列表
  getCateList();
  var layer = layui.layer;
  var form = layui.form;
  // 添加功能的点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1, //让确定按钮消失
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })
  // 通过事件委派的方式给表单绑定提交事件
  $('body').on('submit', "#form_add", function (e) {
    e.preventDefault();

    $.ajax({
      type: 'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status != 0) return layer.msg(res.message);
        layer.msg(res.message);
        getCateList();
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd);
      }
    })
  })


  var indexEdit = null;
  // 通过事件委派的方式绑定编辑事件
  $('tbody').on('click', '#btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-index');
    console.log(id);
    $.ajax({
      type: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status != 0) return layer.msg(res.message)
        form.val('form_edit', res.data)
      }
    })
    // 提交数据
    $('body').on('submit', '#form_edit', function (e) {
      e.preventDefault();
      $.ajax({
        type: 'post',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status != 0) return layer.msg(res.message)
          layer.msg(res.message);
          layer.close(indexEdit);
          getCateList();
        }
      })
    })
  })

  // 通过事件委派的方式绑定删除事件
  $('tbody').on('click', '#btn-del', function () {
    var id = $(this).siblings('#btn-edit').attr('data-index');
    layer.confirm('确定删除吗?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        type: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status != 0) return layer.msg(res.message);
          layer.msg(res.message);
          getCateList();
        }
      })
      layer.close(index);
    })
  })
})
// 获取文章列表函数
function getCateList() {
  $.ajax({
    type: 'get',
    url: '/my/article/cates',
    success: function (res) {
      if (res.status != 0) return layui.layer.msg("获取文章列表失败")
      // layui.layer.msg("获取文章列表成功")
      var htmlStr = template('tpl-table', res)
      $('tbody').html(htmlStr);
    }
  })
}