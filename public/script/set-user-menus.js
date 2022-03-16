$(function(){
    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('blur', 'input[name="limit"]', function(){
        var limit = $(this).val()
        initDefault(limit, null)
    })

    $('body').on('click', '#apply-filter', function(){
        console.log('...');
        var limit = $('input[name="limit"]').val()
        var user_id = $('select[name="user_id"]').val() && '&user_id=' + $('select[name="user_id"]').val()
        var menu_id = $('select[name="menu_id"]').val() && '&menu_id=' + $('select[name="menu_id"]').val()
        var submenu_id = $('select[name="submenu_id"]').val() && '&submenu_id=' + $('select[name="submenu_id').val()
        var url = `users-menu/list?keyword=true&limit=${limit}${user_id}${menu_id}${submenu_id}`
        console.log(url);
        $.ajax({
            async: true,
            url: url,
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'inline')
            }
        })
    })

    $('body').on('click', '#reset-filter', function(){
        var limit = $('input[name="limit"]').val()
        initDefault(limit)
        $('div#filtermodal').find('input').val('')
        $('div#filtermodal').find('select').val(null).trigger('change')
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'users-menu',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal('Okey', result.message, 'success')
                    initCreate()
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'users-menu/'+id+'/show',
            method: 'GET',
            dataType: 'html',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                body.find('div#content-form').html(result)
                body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
                body.find('div#content-form').css('display', 'none')
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
                body.find('div#div-filter-limit').css('display', 'none')
            }
        })
    })

    $('body').on('click', 'button#bt-delete', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        console.log(id);
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
        }, 
        function(){
            $.ajax({
                async: true,
                headers: {'x-csrf-token': $('[name=_csrf]').val()},
                url: 'users-menu/'+id+'/destroy',
                method: 'DELETE',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    if(result.success){
                        swal("Okey,,,!", result.message, "success")
                        initDefault()
                    }else{
                        swal("Opps,,,!", result.message, "warning")
                    }
                },
                error: function(err){
                    console.log(err);
                    swal("Opps,,,!", 'Server Error', "error")
                }
            })
        });
    })

    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var data = new FormData(this)
        var id = $(this).data('id')
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'users-menu/'+id+'/update',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.success){
                    swal("Okey,,,!", result.message, "success")
                    initDefault()
                }else{
                    swal("Opps,,,!", result.message, "warning")
                }
            },
            error: function(err){
                console.log(err);
                swal("Opps,,,!", 'Server Error', "error")
            }
        })
    })

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'users-menu/list',
            method: 'GET',
            data: {
                limit: limit || 100,
                page: page || 1,
                keyword: null
            },
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'inline')
            }
        })
    }

    function initCreate(){
        $.ajax({
            async: true,
            url: 'users-menu/create',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-form').html(result)
                body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'none')
            }
        })
    }

    function onChangeMenu(val){
        // var menu = val
        var elm = body.find('select[name="submenu_id"]')
        var values = elm.data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/options/submenu?menu_id='+val+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result.length > 0);
                if(result.length > 0){
                    elm.html(
                        result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.urut+'. '+v.name+'</option>')
                    )
                    elm.trigger('change');
                }else{
                    elm.val(null)
                    elm.html('<option value="" selected>Blum ada data...</option>')
                    elm.trigger('change');
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    }
                    
})