$(function() {
    // 需求：实现表单校验功能
    /*
    * 1. 进行表单校验配置
    *     校验要求：
    *         (1) 用户名不能为空，长度为 2-6 位。
    *         (2) 密码不能为空，长度为 6-12 位。
    * */
    $('#form').bootstrapValidator({
        // 配置小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',            // 校验成功
            invalid: 'glyphicon glyphicon-remove',      // 校验失败
            validating: 'glyphicon glyphicon-refresh'   // 校验中
        },
        
        // 配置校验字段（配置之前，需要先配置 input 的 name）
        fields: {
            // 配置用户名
            username: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '用户名不能为空！'
                    },
                    // 长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须是 2-6 位！'
                    },
                    // 专门用于 ajax 回调提示的说明
                    callback: {
                        message: '用户名不存在！'
                    }
                }
            },

            // 配置密码
            password: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    // 长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须是 6-12 位！'
                    },
                    // 专门用于 ajax 回调提示的说明
                    callback: {
                        message: '密码错误！'
                    }
                }
            }
        }
    });

    /*
    * 2. 注册表单校验成功事件，在事件中阻止默认成功的表单提交
    *     通过 ajax 进行提交
    * */
    $('#form').on('success.form.bv', function( e ) {
        // 阻止默认的表单提交
        e.preventDefault();
       
        // 通过 ajax 提交
        // console.log("阻止默认的提交，通过 ajax 进行提交。");
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            // 使用表单序列化的方法
            data: $('#form').serialize(),
            dataType: 'json',
            success: function( info ) {
                console.log(info);
                if( info.success ) {
                    location.href = "index.html";
                }
                if( info.error === 1000 ) {
                    // 用户名不存在
                    // alert(info.message);
                    // 参数1：字段名称
                    // 参数2：校验状态
                    // 参数3：配置规则，用于提示
                    $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
                }
                if( info.error === 1001 ) {
                    // 密码错误
                    // alert(info.message);
                    $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
                }
            }
        })
    });

    /*
    * 3. 重置功能（reset 按钮本身就可以重置内容，但是需要调用表单校验插件的方法，重置校验状态）
    * */
    $('[type="reset"]').click(function() {
        // 重置状态
        // resetForm   如果传 true   表示内容和状态都重置
        //             不传参        只重置状态
        $('#form').data("bootstrapValidator").resetForm();
    });
});