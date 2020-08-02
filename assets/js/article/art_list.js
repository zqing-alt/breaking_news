$(function () {

  // 1.获取文章列表
  initTable();

  // 2.获取文章分类
  initCate();

  // 3.筛选功能
  $('#form_search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val(); // 获取的是value值
    var state = $('[name=state]').val();
    data.cate_id = cate_id;
    data.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  })

  // 4.编辑功能
  // 通过事件委派的方式绑定编辑事件
  $('tbody').on('click', '.btn-edit', function () {
    var id = $(this).attr('data-id');
    location.href = '/article/art_edit.html?id='+id;    
  })


  // 5 删除功能
  $('tbody').on('click', '.btn-del', function () {
    var id = $(this).attr('data-id');
    // 获得页面中删除按钮的总数量
    var n = $('.btn-del').length;
    layer.confirm('确定删除吗?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        type: 'get',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status != 0) return layer.msg(res.message);
          layer.msg(res.message);

          // 判断页面上是否还有数据
          if (n === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            data.pagenum = data.pagenum === 1 ? 1 : data.pagenum - 1;
          }
          initTable();
        }
      })
      layer.close(index);
    })
  })
})

var {
  form
} = layui;
var data = {
  pagenum: 1,
  pagesize: 2,
  cate_id: '',
  state: ''
}
// 函数部分
// 1 时间过滤函数
template.defaults.imports.dataFormat = function (date) {
  const dt = new Date(date)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1).toString().padStart(2, '0')
  var d = (dt.getDate()).toString().padStart(2, '0')

  var hh = (dt.getHours()).toString().padStart(2, '0')
  var mm = (dt.getMinutes()).toString().padStart(2, '0')
  var ss = (dt.getSeconds()).toString().padStart(2, '0')

  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
// 2 初始化文章列表
function initTable() {
  $.ajax({
    type: 'get',
    url: '/my/article/list',
    data: data,
    success: function (res) {
      if (res.status != 0) return layui.layer.msg(res.message)
      // layui.layer.msg(res.message)
      var htmlStr = template('tpl-table', res)
      $('#article_list').html(htmlStr);
      renderPage(res.total);
    }
  })
}

// 3 初始化文章分类
function initCate() {
  $.ajax({
    type: 'get',
    url: '/my/article/cates',
    success: function (res) {
      if (res.status != 0) return layui.layer.msg(res.message);
      // layui.layer.msg(res.message);
      var htmlStr = template('tpl-select', res)
      $('[name=cate_id]').html(htmlStr);
      // 通过 layui 重新渲染表单区域的UI结构
      layui.form.render()
    }
  })
}

// 4 定义渲染分页的方法
function renderPage(total) {
  // layui.use('laypage', function () {
  var laypage = layui.laypage;

  //执行一个laypage实例
  laypage.render({
    elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
    count: total, //数据总数，从服务端得到
    limit: data.pagesize, // 每页显示几条数据
    curr: data.pagenum, // 设置默认被选中的分页
    limits: [2, 3, 5, 10],
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    // jump触发的两种方式
    // 1 分页切换发生的时候
    // 2 调用laypage.render()方法
    jump: function (obj, first) {
      //obj包含了当前分页的所有参数，比如：
      // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
      data.pagenum = obj.curr;
      // console.log(obj.limit); //得到每页显示的条数
      data.pagesize = obj.limit;

      //首次不执行--避免死循环
      if (!first) {
        initTable();
      }
    },
  });
}

