define(['base','com_v2','md5'], function($,com,md5) {
    let user = () => {
        let Api = {
            register:'/userCenter/user/regist',
            login:'/userCenter/user/login',
            imgCode:'/userCenter/kaptcha.jpg',
            smsCode:'/userCenter/user/sendSMS',
            formToken:'/feapi/users/formToken',
            voiceCode:'/userCenter/user/sendVoice',
            checkKaptcha:'/userCenter/kaptchaCode/checkKaptcha'
        }
        let rcode = 200000

        let formToken_reg = ''

        let formToken_log = ''

        var userData = new Object()
        var userData_1 = new Object()

        /**
         * 
         * @param {*} dom input对应的dom
         * @param {*} key userData对象中对应的key值
         */
        let getValue = (data,dom,key) => {
            $(dom).blur(() => {
                data[key] = $(dom).val()
            })
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

        // 注册方法
        let register = (param) => {
            /**
             * @param {object}
             * -  phone
             * -  password
             * -  imgCode
             * -  smsCode
             * -  submit
             * -  voiceCode
             * -  imgCodeButton
             * -  smsCodeButton
             */

            
            // 判断参数并提示
            (() => {
                let mustParam = ['phone','password','imgCode','smsCode','submit','imgCodeButton','smsCodeButton','warn']
                mustParam.forEach(item => {
                    let mark = false
                    for(key in param){
                        if(key == item){
                            mark = true
                        }
                    }
                    if(!mark){
                        console.error(`请填写注册${item}的dom`)
                    }
                })
            })(param)


            
            // 获取图片验证码
            let imgCode = (formToken) => {
                $(param.imgCodeButton).css('background-image',`url(${Api.imgCode}?formtoken=${formToken}&t=${Math.random()})`)
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
                                resolve(res.data)
                            }
                            else{
                                reject(res.data)
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
            let registerWay = (userData) => {
                let formData = {
                    data: {
                        userName: userData.phone,
                        phone:    userData.phone,
                        password: $.md5($.md5(userData.password)),
                        code:     userData.smsCode,
                        inviterIdentity: null
                    }
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
            // 初始获取formToken
            getFormToken().then(data => {formToken_reg = data},data => {formToken_reg = data})
            // 初始化展示图片验证码
            imgCode(formToken_reg)
            // 获取电话
            getValue(userData,param.phone,'phone')
            // 获取密码
            getValue(userData,param.password,'password')
            // 获取图片验证码
            getValue(param.imgCode,'imgCode')
            // 获取短信验证码
            getValue(userData,param.smsCode,'smsCode')
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
            $(param.imgCodeButton).click(() => {
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
            $(param.smsCodeButton).click(() => {
                // 校验手机号
                if(checkPhone(userData.phone)){
                    $(param.warn).removeClass('dishidden').text('请输入正确的手机号')
                    userData.phone = null
                    return
                }
                // 校验密码
                if(checkPassword(userData.password)){
                    $(param.warn).removeClass('dishidden').text('密码应为6-16位数字与字母组合')
                    return
                }
                // 获取短信
                if(userData.imgCode){
                    smsCode().then(
                        (res) => {
                            $(param.smsCodeButton).prop('disabled',true)// 按钮设为  不可点
                            $(param.warn).removeClass('dishidden').text(res.message)
                            let startTime = 60
                            let timer = setInterval(() => {
                                startTime--
                                $(param.smsCodeButton).text(`${startTime}s`)
                                if(startTime == 0){
                                    clearInterval(timer)
                                    $(param.smsCodeButton).prop('disabled',false)// 按钮设为  可点
                                    $(param.smsCodeButton).text('重新获取')
                                    getFormToken().then(// 重新获取图片验证码
                                        formToken => {
                                            imgCode(formToken)
                                        },
                                        formToken => {
                                            imgCode(formToken)
                                        }
                                    )
                                }
                            },1000)
                        },
                        (error) => {
                            $(param.warn).removeClass('dishidden').text(error.message)
                        }
                    )
                }
                else{
                    $(param.warn).removeClass('dishidden').text('图片验证码不能为空')
                }
            })
            // 点击获取语音验证码
            if(param.voiceCode){
                $(param.voiceCode).click(() => {
                    voiceCode().then((res) => {
                        $(param.warn).removeClass('dishidden').text(res.message)
                    })
                })
            }
            // 点击提交用户数据
            $(param.submit).click(() => {
                registerWay(userData).then(
                    (res) => {
                        function setCookie(cname, cvalue, exdays) {
                            var d = new Date();
                            d.setTime(d.getTime() + (exdays*24*60*60*1000));
                            var expires = "expires="+d.toUTCString();
                            document.cookie = cname + "=" + cvalue + "; " + expires;
                        }
                        setCookie('userToken',res.data,1)//把tkoen存起来
                        $(param.warn).removeClass('dishidden').text('注册成功')
                        // 成功回调
                        if(param.success && typeof(param.success) == 'function'){
                            param.success(res)
                        }
                    },
                    (error) => {
                        $(param.warn).removeClass('dishidden').text(error.message)
                        // 失败回调
                        if(param.fail && typeof(param.fail) == 'function'){
                            param.fail(error)
                        }
                    }
                )
            })
        }
        let login = (param) => {
            /**
             * @param {object}
             * -  phone
             * -  password
             * -  imgCode
             * -  submit
             * -  imgCodeButton
             */

            
            // 判断参数并提示
            (() => {
                let mustParam = ['phone','password','imgCode','submit','imgCodeButton','warn']
                mustParam.forEach(item => {
                    let mark = false
                    for(key in param){
                        if(key == item){
                            mark = true
                        }
                    }
                    if(!mark){
                        console.error(`请填写登录${item}的dom`)
                    }
                })
            })(param)
            
            // 获取图片验证码
            let imgCode = (formToken) => {
                $(param.imgCodeButton).css('background-image',`url(${Api.imgCode}?formtoken=${formToken}&t=${Math.random()})`)
            }
            // 校验图片验证码
            let checkKaptcha = (imgCode) => {
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.checkKaptcha,
                        contentType: "application/json",
                        type: "get",
                        headers:{
                            "Accept": "application/json;charset=UTF-8",
                            "clientId": "XXD_INTEGRATION_PLATFORM",
                            "clientTime": new Date().getTime()
                        },
                        data: {
                            kaptchaCode: imgCode,
                            del: true
                        },
                        success: (res) => {
                            if(res.code == rcode && res.data.code == 0){
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
            // 登录
            let loginWay = (userData_1) => {
                let formData = {
                    data: {
                        userName: userData_1.phone,
                        phone:    userData_1.phone,
                        password: $.md5($.md5(userData_1.password)),
                        kaptcha:  userData_1.imgCode
                    }
                }
                let pro = new Promise((resolve,reject) => {
                    com.ajax({
                        url: Api.login,
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

            // 初始获取formToken
            getFormToken().then(data => {formToken_log = data},data => {formToken_log = data})
            // 初始化展示图片验证码
            imgCode(formToken_reg)
            // 获取电话
            getValue(userData_1,param.phone,'phone')
            // 获取密码
            getValue(userData_1,param.password,'password')
            // 获取图片验证码
            getValue(userData_1,param.imgCode,'imgCode')

            /**
             * 点击事件
             */
            // 点击获取图片验证码
            $(param.imgCodeButton).click(() => {
                getFormToken().then(
                    formToken => {
                        imgCode(formToken)
                    },
                    formToken => {
                        imgCode(formToken)
                    }
                )
            })
            // 点击提交用户数据
            $(param.submit).click(() => {
                checkKaptcha(userData_1.imgCode).then(
                    () => {
                        loginWay(userData_1).then(
                            (res) => {
                                function setCookie(cname, cvalue, exdays) {
                                    var d = new Date();
                                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                                    var expires = "expires="+d.toUTCString();
                                    document.cookie = cname + "=" + cvalue + "; " + expires;
                                }
                                setCookie('userToken',res.data,1)//把tkoen存起来
                                $(param.warn).removeClass('dishidden').text('登录成功')
                                // 成功回调
                                if(param.success && typeof(param.success) == 'function'){
                                    param.success(res)
                                }
                            },
                            (error) => {
                                $(param.warn).removeClass('dishidden').text(error.message)
                                // 失败回调
                                if(param.fail && typeof(param.fail) == 'function'){
                                    param.fail(error)
                                }
                            }
                        )
                    }
                    ,
                    () => {
                        $(param.warn).removeClass('dishidden').text('图片验证码错误')
                    }
                )
            })

        }

        return {register,login}
    }
    return user()
})