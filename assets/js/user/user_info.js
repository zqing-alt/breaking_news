$(function () {
  var form = layui.form;
  // 1 校验表单数据
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
    // nickname: [
    //   /^\s{1,6}$/,
    //   '昵称长度必须在 1 ~ 6 个字符之间！'
    // ]
  })


  // 2 初始化用户基本信息
  initUserInfo();

  // 3 重置表单
  $('#btnReset').on('click', function (e) {
    // 阻止重置的默认行为
    e.preventDefault();
    // 重新调用函数获取用户信息
    initUserInfo();
  })

  // 4 更新用户信息
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg("修改用户信息失败!");
        layui.layer.msg(res.message);
      }
    })
  })
})


// 初始化信息函数
function initUserInfo() {
  $.ajax({
    type: 'get',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg("获取用户信息失败");
      // 调用form.val()方法为表单赋值
      layui.form.val('formUserInfo', res.data);
    }
  })
}