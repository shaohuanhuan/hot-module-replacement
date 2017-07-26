/**
 * @author monkeywang
 * Date: 17/4/20
 */
let $ = window.$
/**
 * page 点击加载事件
 * @param totalPage 总页数
 * @param fn 加载函数
 */
export let clickBindDom = (totalPage, fn) => {
  let dom = $('a', $('.pagination')) // 分页点击的dom
  dom.on('click', function (e) {
    e.preventDefault()
    // 当前页
    let currentPage = parseInt($('.pagination').find('.active').text())
    let jumpPage = currentPage // 调转页
    // 翻页
    if ($(this).hasClass('prev')) {
      jumpPage--
    } else if ($(this).hasClass('next')) {
      jumpPage++
    } else {
      jumpPage = parseInt($(this).text())
    }
    if (jumpPage < 1 || jumpPage > totalPage) {
      return
    }
    if (jumpPage !== currentPage) {
      $('li', $('.pagination')).removeClass('active') // 移除所有的active样式
      $(`.jump${jumpPage}`).addClass('active')
      fn(jumpPage)
    }
  })
}
