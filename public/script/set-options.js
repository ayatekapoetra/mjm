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
        var limit = $('input[name="limit"]').val()
        var group = $('input[name="group"]').val() && '&group=' + $('input[name="group"]').val()
        var teks = $('input[name="teks"]').val() && '&teks=' + $('input[name="teks"]').val()
        var nilai = $('input[name="nilai"]').val() && '&nilai=' + $('input[name="nilai"]').val()
        var url = `options/list?keyword=true&limit=${limit}${group}${teks}${nilai}`
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
            url: 'options',
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
            url: 'options/'+id+'/show',
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
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
          },
          function(){
              $.ajax({
                  async: true,
                  headers: {'x-csrf-token': $('[name=_csrf]').val()},
                  url: 'options/'+id+'/destroy',
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
            url: 'options/'+id+'/update',
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
            url: 'options/list',
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
                body.find('div#content-list').html(JSON.stringify(err))
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
            url: 'options/create',
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
})