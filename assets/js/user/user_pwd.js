$(function () {
  var form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function(value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function(value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致！'
      }
    }
  })

  $('#myForm').on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type:'post',
      url: '/my/updatepwd',
      data:$(this).serialize(),
      success:function(res){
        if (res.status != 0) return layui.layer.msg("密码重置失败");
        // $('#btnLogout').click();
        localStorage.removeItem("token");
        // 在iframe wwindow.parent才是外面window
        window.parent.location.href = '/login.html';
      }
    })
  })
})