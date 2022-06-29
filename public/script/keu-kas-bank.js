$(function(){
    console.log('script/keu-kas-bank');

    var body = $('body')

    initDefault(50, 1)

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate(50, 1)
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
        body.find('div#div-filter-limit').toggleClass('hidden')
        body.find('button#bt-create-form').css('display', 'inline')
    })

    // $('body').on('click', '#apply-filter', function(){
    //     var limit = $('input[name="limit"]').val()
    //     var kode = $('input[name="kode"]').val() && '&kode=' + $('input[name="kode"]').val()
    //     var cabang_id = $('select[name="cabang_id"]').val() && '&cabang_id=' + $('select[name="cabang_id"]').val()
    //     var gudang_id = $('select[name="gudang_id"]').val() && '&gudang_id=' + $('select[name="gudang_id"]').val()
    //     var date_begin = $('input[name="date_begin"]').val() && '&date_begin=' + $('input[name="date_begin').val()
    //     var date_end = $('input[name="date_end"]').val()  && '&date_end=' + $('input[name="date_end"]').val()
    //     var url = `kas-bank/list?keyword=true&limit=${limit}${kode}${cabang_id}${gudang_id}${date_begin}${date_end}`
    //     console.log(gudang_id);
    //     $.ajax({
    //         async: true,
    //         url: url,
    //         method: 'GET',
    //         dataType: 'html',
    //         contentType: false,
    //         success: function(result){
    //             body.find('div#content-list').html(result)
    //             body.find('div#content-form').html('')
    //         },
    //         error: function(err){
    //             console.log(err)
    //         },
    //         complete: function() {
    //             body.find('button#bt-create-form').css('display', 'inline')
    //             body.find('button.bt-back').css('display', 'none')
    //             body.find('div#content-list').css('display', 'block')
    //             body.find('div#content-form').css('display', 'none')
    //             body.find('div#div-filter-limit').css('display', 'inline')
    //         }
    //     })
    // })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'transfer-kasbank/' + id + '/show',
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
                body.find('div#div-filter-limit').toggleClass('hidden')
            }
        })
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var dataForm = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'transfer-kasbank',
            method: 'POST',
            data: dataForm,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal('Okey', result.message, 'success')
                    initDefault()
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log('ERR ::::', err)
            }
        })
    })

    $('body').on('click', 'button.bt-delete', function(e){
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
                  url: 'transfer-kasbank/'+id+'/destroy',
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
                      swal("Opps,,,!", err.responseJSON?.error.message || 'Server Error', "error")
                  }
              })
          });
    })
    
    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var data = getDataForm()
        var formdata = new FormData()
        formdata.append('items', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        var id = $(this).data('id')

        console.log(data);
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'kas-bank/'+id+'/update',
            method: 'POST',
            data: formdata,
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
            url: 'transfer-kasbank/list',
            method: 'GET',
            data: {
                limit: limit,
                page: page || 1
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
                body.find('button.create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
            }
        })
    }

    function initCreate(){
        $.ajax({
            async: true,
            url: 'transfer-kasbank/create',
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
                body.find('div#div-filter-limit').toggleClass('hidden')
            }
        })
    }
})