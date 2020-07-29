$(function () {
  // 去注册的点击事件
  $('#link-reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  // 去登录的点击事件
  $('#link-login').on('click', function () {
    $('.reg-box').hide().siblings('.login-box').show();
  });


  // 从layui中获取form对象
  var form = layui.form;
  // var layer = layui.layer;
  // 解构赋值写法
  var { layer } = layui;
  // 自定义校验规则
  form.verify({
    // 自定义pwd的规则
    pwd: [
      /^[\S]{6,12}$/,
      "密码必须6到12位,且不能有空格"
    ],
    repwd: function (value) {
      // 获取密码框的值
      var pwd = $('.reg-box [name=password]').val();
      if (pwd != value) {
        return '两次密码不一致!'
      }
    }
  })

  // 监听表单的注册事件
  $('#form_reg').on("submit", function (e) {
    e.preventDefault();
    var data = {
      username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
    };
    // 发起ajax请求
    // $.post('http://http://192.168.50.200:3007/api/reguser', {
    $.post('/api/reguser', data, function (res) {
        if (res.status != 0) return layer.msg(res.message);
        // 使用layer提示信息
        layer.msg('注册成功,请登录');
        // 自动切换回登录界面
        $('#link-login').click();
    })
  })

  // 监听表单的提交事件
  $('#form_login').on("submit", function (e) {
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      type:'post',
      url: '/api/login',
      data: $(this).serialize(),
      success:function(res){
        if (res.status != 0) return layer.msg("登录失败");
        layer.msg('登录成功');
        //将登录成功得到的token字符串 保存到localStorage中
        localStorage.setItem("token", res.token);
        // 跳转到后台主页
        location.href = "/index.html";
      }
    })
  })
})