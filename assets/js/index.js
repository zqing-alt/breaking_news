$(function () {
  // 调用请求用户信息函数
  getUserInfo();

  $('#btnLogout').on('click', function() {
    console.log(1);
    layui.layer.confirm("确定退出吗", { icon: 3, title: '提示' }, function (index) {
      // 1. 清空本地存储中的 token
      localStorage.removeItem("token");
      // 2. 重新跳转到登录页面
      location.href = "/login.html",
        // 3.关闭弹窗
        layui.layer.close(index);
    })
  })
})




// 请求用户信息函数
function getUserInfo () {
  $.ajax({
    type:'get',
    url: '/my/userinfo',
    // headers请求头信息
    // headers: {
    //   Authorization: localStorage.getItem("token") || ""
    // },
    success:function(res){
      if (res.status != 0) return layui.layer.msg("获取用户信息失败");
      renderAvatar(res.data);
    },

    // 不论成功还是失败，最终都会调用 complete 回调函数
    // complete: function (res) {
    //   console.log(res);
    //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     // 强制清空 token
    //     localStorage.removeItem("token");
    //     // 强制跳转到登录页面
    //     location.href = "/login.html"
    //   }
    // }
  })
}

// 渲染用户信息函数
function renderAvatar (user) {
  var name = user.nickname || user.username
  //
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.text_avatar').html(name[0].toUpperCase()).show()
    $('.layui-nav-img').hide()
  }
}