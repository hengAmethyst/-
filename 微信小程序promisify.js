
// 可以把 wx 对象里的方法(传入参数中包含 success 和 fail)转换为返回 promise 的方法
//之后所有的wx.ways都可以用promise链来进行嵌套
/**
 * @param 为你传的参数,不需要传success和fail了
 * 例如:  该文件.wx.request(param).then((data)=>{
 *           console.log('成功时')
/**         },(err)=>{
 *              console.log('失败时')
 *          }).then((data)=>{wx.request()}).then(()=>{})
 */

const promisifyWx = (name) => ((param) => {
    console.log(`wx.${name}[excuting] -> ${param}`)
    return new Promise((resolve, reject) => {
        let base = {
            success: (res) => {
                console.log(`wx.${name}[success]:${res}`)
                resolve(res)
            },
            fail: (err) => {
                console.log(`wx.${name}[fail]:${err}`)
            }
        }
        wx[name](Object.assign({}, param, base))
    })
})
exports.wx = {};
for (let name in wx) {
    exports.wx[name] = promisifyWx(name);
}




