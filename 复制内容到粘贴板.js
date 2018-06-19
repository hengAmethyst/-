/**
 * 复制指定内容到粘贴板
 * @param {string}
 */
let copyElementText = (el) => {
    // 如果传入的是一个字符串，并且是class名 或者id名，就当做是一个元素节点处理
    if(typeof(el)=='string'){
        let rule = /^(#|\.){1,1}/  //判断#或.在字符串起始位置只出现1次
        let item_value = null
        if(rule.test(el)){
            item_value = document.querySelector(el).innerHTML
        }
        else{
            item_value = el
        }
        let input_el = document.createElement('input')
        document.body.appendChild(input_el)
        input_el.setAttribute('readonly','readonly')//设置为只读，解决移动端输入框弹出的问题
        input_el.setAttribute('value',item_value)
        input_el.select()//选中文本域
        document.execCommand('copy')//执行拷贝命令
        document.body.removeChild(input_el)//移除元素
    }else{
        console.error('请输入一个您需要复制的 字符串/节点名')
    }
}
//  拜拜拜