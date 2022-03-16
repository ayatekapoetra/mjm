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

    $('body').on('change', 'select[name="coa_kredit"]', function(){
        var workdir = body.find('input#workdir').val()
        var value = $(this).val()
        if(value){
            $.ajax({
                async: true,
                url: '/ajax/isbankOut?bisnis_id='+workdir+'&coa_id='+value,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    body.find('div[id="is_delay"]').css('display', 'inline')
                    body.find('div[id="optionKasBank-kredit"]').css('display', 'inline')
                    body.find('div[id="optionKasBank-kredit"]').html(result)
                },
                error: function(err){
                    console.log(err)
                },
                complete: function() {
                    body.find('select[name="is_delay"]').val('N')
                }
            })
        }else{
            body.find('div[id="optionKasBank-kredit"]').html('')
        }
    })

    $('body').on('change', 'select[name="coa_debit"]', function(){
        var workdir = body.find('input#workdir').val()
        var value = $(this).val()
        if(value){
            $.ajax({
                async: true,
                url: '/ajax/isbankIn?bisnis_id='+workdir+'&coa_id='+value,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    body.find('div[id="is_delay"]').css('display', 'inline')
                    body.find('div[id="optionKasBank-debit"]').css('display', 'inline')
                    body.find('div[id="optionKasBank-debit"]').html(result)
                },
                error: function(err){
                    console.log(err)
                },
                complete: function() {
                    body.find('select[name="is_delay"]').val('N')
                }
            })
        }else{
            body.find('div[id="optionKasBank-debit"]').html('')
        }
    })

    $('body')

    $('body').on('click', '#apply-filter', function(){
        var limit = $('input[name="limit"]').val()
        var kode = $('input[name="kode"]').val() && '&kode=' + $('input[name="kode"]').val()
        var serial = $('input[name="serial"]').val() && '&serial=' + $('input[name="serial"]').val()
        var num_part = $('input[name="num_part"]').val() && '&num_part=' + $('input[name="num_part"]').val()
        var nama = $('input[name="nama"]').val() && '&nama=' + $('input[name="nama').val()
        var satuan = $('select[name="satuan"]').val()  && '&satuan=' + $('select[name="satuan"]').val()
        var url = `transfer-kasbank/list?keyword=true&limit=${limit}${kode}${serial}${num_part}${nama}${satuan}`
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
            url: 'transfer-kasbank',
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
            url: 'transfer-kasbank/'+id+'/show',
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

    $('body').on('click', 'button.bt-print', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'transfer-kasbank/'+id+'/print',
            method: 'GET',
            dataType: 'html',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                $('body').find('div#content-form').css('background-color', 'white').html(result)
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
            url: 'transfer-kasbank/'+id+'/update',
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
            url: 'transfer-kasbank/list',
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
                body.find('div#div-filter-limit').css('display', 'none')
            }
        })
    }
})