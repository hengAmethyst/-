define(['jquery'], function($) {
    const Api = {
        register:'',
        login:'',
        imgCode:'',
        smsCode:'',
        formToken:'',
        voiceCode:'',
    }
    const rcode = 200000

    const getValue = (dom) => {
        let value = null
        // 获取电话
        $(dom).blur(() => {
            value = $(dom).value()
        })
        return value
    }

    class user {
        constructor(){

        }

        // 注册方法
        register(param){
            // 获取formToken
            let formToken = () => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.formToken,
                        contentType:'',
                        headers:{

                        },
                        data:{

                        },
                        success: (res) => {
                            if(res.code == rcode){
                                resolve(res.data.data)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res)
                        }
                    })
                })
                return pro
            }

            // 获取图片验证码
            let imgCode = () => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.imgCode,
                        contentType:'',
                        headers:{

                        },
                        data:{

                        },
                        success: (res) => {
                            if(res.code == rcode){
                                resolve(res.data.data)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res)
                        }
                    })
                })
                return pro
            }

            // 获取短信验证码
            let smsCode = () => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.smsCode,
                        contentType:'',
                        headers:{

                        },
                        data:{

                        },
                        success: (res) => {
                            if(res.code == rcode){
                                resolve(res.data.data)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res)
                        }
                    })
                })
                return pro
            }

            // 获取语音验证码
            let voiceCode = () => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.voiceCode,
                        contentType:'',
                        headers:{

                        },
                        data:{

                        },
                        success: (res) => {
                            if(res.code == rcode){
                                resolve(res.data.data)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res)
                        }
                    })
                })
                return pro
            }

            // 注册
            let register = () => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.register,
                        contentType:'',
                        headers:{

                        },
                        data:{

                        },
                        success: (res) => {
                            if(res.code == rcode){
                                resolve(res.data.data)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res)
                        }
                    })
                })
                return pro
            }

            // 运行逻辑
            let userData = new Object()
            // 获取电话
            userData.phone    = getValue(param.phone)
            // 获取密码
            userData.password = getValue(param.password)
            // 获取图片验证码
            userData.imgCode  = getValue(param.imgCode)
            // 获取短信验证码
            userData.smsCode  = getValue(param.smsCode)
            /**
             * 校验函数
             */
            // 手机号校验
            let checkPhone = (param) => {
                let rule = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/
                let result = param.match(rule)
                return !result
            }
            // 密码校验
            let checkPassword = (param) => {
                let rule = /xxx/
                let result = param.match(rule)
                return !result 
            }



            /**
             * 点击事件
             */
            // 点击获取图片验证码
            $(param.imgCode).click(() => {
                imgCode().then((value) => {
                    $(param.imgCode).css({'background':value})
                })
            })
            // 点击获取短信验证码
            $(param.smsCode).click(() => {
                // 校验手机号
                if(checkPhone(userData.phone)){
                    $(param.warn).text('请输入正确的手机号')
                    userData.phone = null
                    $(param.phone).value('')
                    return
                }
                // 校验密码
                if(checkPassword(userData.password)){
                    $(param.warn).text('密码由大写字母、小写字母、数字及特殊字符至少三种组成')
                    return
                }
                // 获取短信
                if(userData.imgCode){
                    smsCode().then(
                        (value) => {
                            $(param.smsCode).props('disable',true)// 按钮设为  不可点
                            let startTime = 60
                            let timer = setInterval(() => {
                                startTime--
                                $(param.smsCode).text(`${startTime}s`)
                                if(startTime == 0){
                                    clearInterval(timer)
                                    $(param.smsCode).props('disable',false)// 按钮设为  可点
                                    $(param.smsCode).text('重新获取')
                                }
                            },1000)
                        },
                        (error) => {
                            $(param.warn).text(error.data.message)
                        }
                    )
                }
                else{
                    $(param.warn).text('图片验证码不能为空')
                }
            })
            // 点击提交用户数据
            $(param.register).click(() => {
                register().then(
                    (res) => {
                        $.cookie('userToken', res.data.data , { path: '/', expires: 15 })
                    },
                    (error) => {
                        $(param.warn).text(error.message)
                    }
                )
            })
        }
    }

})