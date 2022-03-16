$(function(){
    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-bank-form', function(){
        initBankCreate()
    })

    $('body').on('click', 'button#bt-create-kas-form', function(){
        initKasCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('change', 'select.selectKas', function(){
        var id = $(this).val()
        $.ajax({
            async: true,
            url: '/ajax/coa/by-id?id='+id,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                body.find('input[name="alias"]').val(result.alias)
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('body').on('submit', 'form#form-create-bank', function(e){
        e.preventDefault()
        var data = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'bank-kas/bank',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal("Okey,,,!", result.message, "success")
                    initDefault()
                }else{
                    swal("Opps,,,!", result.message, "warning")
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('body').on('submit', 'form#form-create-kas', function(e){
        e.preventDefault()
        var data = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'bank-kas/kas',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal("Okey,,,!", result.message, "success")
                    initDefault()
                }else{
                    swal("Opps,,,!", result.message, "warning")
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('body').on('click', 'button.bt-show-bank', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'bank-kas/bank/'+id+'/show',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
            }
        })
    })

    $('body').on('click', 'button.bt-details-bank', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'bank-kas/bank/'+id+'/details',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
            }
        })
    })

    $('body').on('click', 'button.bt-show-kas', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'bank-kas/kas/'+id+'/show',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
            }
        })
    })

    $('body').on('click', 'button.bt-details-kas', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'bank-kas/kas/'+id+'/details',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
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
                  url: 'bisnis/'+id+'/destroy',
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

    // $('body').on('submit', 'form#form-update-bank', function(e){
    //     e.preventDefault()
    //     var data = new FormData(this)
    //     var id = $(this).data('id')
    //     console.log(id);
    //     $.ajax({
    //         async: true,
    //         headers: {'x-csrf-token': $('[name=_csrf]').val()},
    //         url: 'bank-kas/bank/'+id+'/update',
    //         method: 'POST',
    //         data: data,
    //         dataType: 'json',
    //         processData: false,
    //         mimeType: "multipart/form-data",
    //         contentType: false,
    //         success: function(result){
    //             if(result.success){
    //                 swal("Okey,,,!", result.message, "success")
    //                 initDefault()
    //             }else{
    //                 swal("Opps,,,!", result.message, "warning")
    //             }
    //         },
    //         error: function(err){
    //             console.log(err);
    //             swal("Opps,,,!", 'Server Error', "error")
    //         }
    //     })
    // })

    // $('body').on('submit', 'form#form-update-kas', function(e){
    //     e.preventDefault()
    //     var data = new FormData(this)
    //     var id = $(this).data('id')
    //     $.ajax({
    //         async: true,
    //         headers: {'x-csrf-token': $('[name=_csrf]').val()},
    //         url: 'bank-kas/kas/'+id+'/update',
    //         method: 'POST',
    //         data: data,
    //         dataType: 'json',
    //         processData: false,
    //         mimeType: "multipart/form-data",
    //         contentType: false,
    //         success: function(result){
    //             if(result.success){
    //                 swal("Okey,,,!", result.message, "success")
    //                 initDefault()
    //             }else{
    //                 swal("Opps,,,!", result.message, "warning")
    //             }
    //         },
    //         error: function(err){
    //             console.log(err);
    //             swal("Opps,,,!", 'Server Error', "error")
    //         }
    //     })
    // })

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'bank-kas/list',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err.response)
            },
            complete: function() {
                body.find('button#bt-create-bank-form').css('display', 'inline')
                body.find('button#bt-create-kas-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
            }
        })
    }

    function initBankCreate(){
        $.ajax({
            async: true,
            url: 'bank-kas/bank/create',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
            }
        })
    }

    function initKasCreate(){
        $.ajax({
            async: true,
            url: 'bank-kas/kas/create',
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
                body.find('button#bt-create-bank-form').css('display', 'none')
                body.find('button#bt-create-kas-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
            }
        })
    }
})