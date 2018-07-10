define(['jquery'], function($) {
    let user = () => {
        const Api = {
            register:'/userCenter/user/regist',
            login:'/userCenter/user/login',
            imgCode:'/userCenter/kaptcha.jpg',
            smsCode:'/userCenter/user/sendSMS',
            formToken:'/feapi/users/formToken',
            voiceCode:'/userCenter/user/sendVoice',
        }
        const rcode = 200000

        let formToken_reg = ''

        let formToken_log = ''

        const getValue = (dom) => {
            let value = null
            // 获取电话
            $(dom).blur(() => {
                value = $(dom).value()
            })
            return value
        }

        let getFormToken = () => {
            let pro = new Promise((resolve,reject) => {
                com.ajax({
                    url: Api.formToken,
                    contentType: "application/json",
                    dataType: "json",
                    type: "get",
                    headers:{
                        "Accept": "application/json;charset=UTF-8",
                        "clientId": "XXD_ACTIVITY_H5_PAGE",
                        "clientTime": new Date().getTime(),
                    },
                    data:{},
                    success: (res) => {
                        resolve(res.token)
                    },
                    error: (res) => {
                        reject(res.token)
                    }
                })
            })
            return pro
        }
        // 初始获取formToken
        getFormToken().then(data => {formToken_reg = data},data => {formToken_reg = data})
        getFormToken().then(data => {formToken_log = data},data => {formToken_reg = data})



        // 注册方法
        let registerWay = (param) => {
            /**
             * @param {object}
             * -  phone
             * -  password
             * -  imgCode
             * -  smsCode
             * -  submit
             * -  voiceCode
             */
            
            // 获取图片验证码
            let imgCode = (formToken) => {
                $(param.imgCode).attr('src',`${Api.imgCode}?formtoken=${formToken}&v=Math.random()`)
            }

            // 获取短信验证码
            let smsCode = () => {
                let getMsgData = {
                        data:{
                            "phone": userData.phone,
                            "kaptcha": userData.imgCode,
                            "type": 0,
                            "scene": 1 
                        }
                    }

                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.smsCode,
                        contentType: "application/json",
                        dataType: "json",
                        type: "post",
                        headers:{
                            "Accept": "application/json;charset=UTF-8",
                            "clientId": "XXD_FRONT_END_H5",
                            "clientTime": new Date().getTime()
                        },
                        data: JSON.stringify(getMsgData),
                        success: (res) => {
                            if(res.code == rcode && res.data.code == 0){
                                resolve(res.data.code)
                            }
                            else{
                                reject(res)
                            }
                        },
                        error: (res) => {
                            reject(res.data)
                        }
                    })
                })
                return pro
            }

            // 获取语音验证码
            let voiceCode = () => {
                let formData = {
                    data: {
                        "busiCode":"CASH_MONEY",
                        "kaptchaCode": userData.imgCode,
                        "phone": userData.phone
                    }
                }

                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.voiceCode,
                        contentType: "application/json",
                        dataType: "json",
                        type: 'POST',
                        headers:{
                            'clientId': 'XXD_INTEGRATION_PLATFORM',
                            'clientTime': new Date().getTime(),
                            's': $.md5('xxdTest'+ new Date().getTime() + 'defaultKey'),
                        },
                        data: JSON.stringify(formData),
                        success: (res) => {
                            if(res.code == rcode && res.data.code == 0){
                                resolve(res.data)
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
            let register = (userData) => {
                let formData = {
                    data: userData
                }
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.register,
                        contentType: "application/json",
                        type: "post",
                        headers:{
                            "Accept": "application/json;charset=UTF-8",
                            "clientId": "XXD_INTEGRATION_PLATFORM",
                            "clientTime": new Date().getTime()
                        },
                        data: JSON.stringify(formData),
                        success: (res) => {
                            if(res.code == rcode && res.data.data){
                                resolve(res.data)
                            }
                            else{
                                reject(res.data)
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
            var userData = new Object()
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
                let rule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
                let result = param.match(rule)
                return !result 
            }

            /**
             * 点击事件
             */
            // 点击获取图片验证码
            $(param.imgCode).click(() => {
                getFormToken().then(
                    formToken => {
                        imgCode(formToken)
                    },
                    formToken => {
                        imgCode(formToken)
                    }
                )
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
                        (res) => {
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
                            $(param.warn).text(error.message)
                        }
                    )
                }
                else{
                    $(param.warn).text('图片验证码不能为空')
                }
            })
            // 点击提交用户数据
            $(param.submit).click(() => {
                register(userData).then(
                    (res) => {
                        $.cookie('userToken', res.data , { path: '/', expires: 15 })// 存储cookie
                        // 成功回调
                        if(param.success && typeof(param.success) == 'function'){
                            param.success()
                        }
                    },
                    (error) => {
                        $(param.warn).text(error.message)
                        // 失败回调
                        if(param.fail && typeof(param.fail) == 'function'){
                            param.fail()
                        }
                    }
                )
            })
        }
    }
    return user()
})