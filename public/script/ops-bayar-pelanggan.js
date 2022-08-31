// const _ = require("underscore")

$(function(){
    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('focus, click', 'input[type="number"]', function(){
        $(this).select()
    })

    $('body').on('blur', 'input[name="limit"]', function(){
        var limit = $(this).val()
        initDefault(limit, null)
    })

    $('body').on("click", 'input[type="number"]', function () {
        $(this).select();
    });

    $('body').on('click', 'button#reset-filter', function(){
        initDefault()
    })

    $('body').on('click', 'button#apply-filter', function(){
        var keyword = body.find('input[name="keyword"]').val() || 'INV'
        var limit = body.find('input[name="limit"]').val() || null
        var pelanggan_id = body.find('select[name="pelanggan_id"]').val() || null
        var cabang_id = body.find('select[name="cabang_id"]').val() || null
        var status = body.find('select[name="status"]').val() || null
        var beginDate = body.find('input[name="begin_date"]').val() || null
        var endDate = body.find('input[name="end_date"]').val() || null
        $.ajax({
            async: true,
            url: 'entry-pembayaran/list-order',
            method: 'GET',
            data: {
                limit: limit || 100,
                // page: page || 1,
                keyword: keyword,
                pelanggan_id: pelanggan_id,
                cabang_id: cabang_id,
                status: status,
                beginDate: beginDate,
                endDate: endDate
            },
            dataType: 'html',
            contentType: false,
            beforeSend: function(){
                $.toast({
                    heading: 'Info',
                    text: 'Trying to update jurnal delay',
                    position: 'top-right',
                    loaderBg: '#FFF',
                    icon: 'warning',
                    bgColor: '#707cd2',
                    hideAfter: 3500,
                    stack: 6
                });
                body.find('div#content-list').html(`<small class="m-l-20">Trying to update jurnal delay & Collecting data...<small/>`)
            },
            success: function(result){
                // console.log(result);
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

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var dataForm = new FormData(this)
        dataForm.append('inv_id', $(this).data('id'))
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entry-pembayaran',
            method: 'POST',
            data: dataForm,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            // beforeSend: function(xhr){
            //     console.log('...', xhr);
            //     // xhr.abort()
            // },
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

    $('body').on('submit', 'form#form-create-multipayment', function(e){
        e.preventDefault()
        var dataForm = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entry-pembayaran/multipayment',
            method: 'POST',
            data: dataForm,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            // beforeSend: function(xhr){
            //     console.log('...', xhr);
            //     // xhr.abort()
            // },
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

    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var dataForm = new FormData(this)
        // console.log('entry-pembayaran/' + id + '/update');
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entry-pembayaran/' + id + '/update',
            method: 'POST',
            data: dataForm,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            // beforeSend: function(xhr){
            //     console.log('...', xhr);
            //     // xhr.abort()
            // },
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

    $('body').on('submit', 'form#form-invoicing', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var dataForm = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entry-pembayaran/'+id+'/invoicing',
            method: 'POST',
            data: dataForm,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            // beforeSend: function(xhr){
            //     console.log('...', xhr);
            //     // xhr.abort()
            // },
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

    $('body').on('click', 'button.bt-inv', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'entry-pembayaran/'+id+'/invoicing',
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

    $('body').on('click', 'button.bt-print-inv', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        console.log(id);
        $.ajax({
            async: true,
            url: 'entry-pembayaran/'+id+'/print-invoice',
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                let data = result
                pdfMake.createPdf(data).print();
                // body.find('div#content-form').html(result)
                // body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
                // body.find('div#content-form').css('display', 'none')
            }
        })
    })

    $('body').on('click', 'button.bt-kwitansi', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        console.log(id);
        $.ajax({
            async: true,
            url: 'entry-pembayaran/'+id+'/print-kwitansi',
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                pdfMake.createPdf(result).print();
                // body.find('div#content-form').html(result)
                // body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
                // body.find('div#content-form').css('display', 'none')
            }
        })
    })

    $('body').on('click', 'button.bt-bayar', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'entry-pembayaran/'+id+'/paid',
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
    
    $('body').on('click', 'a.bt-details', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'entry-pembayaran/'+id+'/list-bayar',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                // console.log(result);
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'block')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'inline')
            }
        })
    })

    $('body').on('click', 'button.bt-update-kwitansi', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entry-pembayaran/'+id+'/show',
            method: 'GET',
            dataType: 'html',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err);
                swal("Opps,,,!", 'Server Error', "error")
            }
        })
    })

    $('body').on('click', 'button.bt-remove', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        swal({
            title: "Are you sure?",
            text: "This will affect journal transaction data...",
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
                  url: 'entry-pembayaran/'+id+'/destroy',
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


    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'entry-pembayaran/list-order',
            method: 'GET',
            data: {
                limit: limit || 100,
                page: page || 1,
                keyword: null
            },
            dataType: 'html',
            contentType: false,
            beforeSend: function(){
                $.toast({
                    heading: 'Info',
                    text: 'Trying to update jurnal delay',
                    position: 'top-right',
                    loaderBg: '#FFF',
                    icon: 'warning',
                    bgColor: '#707cd2',
                    hideAfter: 3500,
                    stack: 6
                });
                body.find('div#content-list').html(`<small class="m-l-20">Trying to update jurnal delay & Collecting data...<small/>`)
            },
            success: function(result){
                // console.log(result);
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
            url: 'entry-pembayaran/create',
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

    function jsonData(){
        let keys = []
        let values = []
        $('select.field-form, input.field-form, textarea.field-form').each(function(){
            console.log($(this));
            var property = $(this).attr('name')
            var val = $(this).val()
            keys.push(property)
            values.push(val)
        })

        function jsonDetailBarang(){
            let items = []
            $('body').find('tr.item-rows-barang').each(function(){
                var elm = $(this)

                var props = []
                var vals = []
                elm.find('select.item-barang, input.item-barang').each(function(){
                    props.push($(this).attr('name'))
                    vals.push($(this).val())
                })
                items.push(_.object(props, vals))
            })
            return items
        }

        function jsonDetailJasa(){
            let items = []
            $('body').find('tr.item-rows-jasa').each(function(){
                var elm = $(this)

                var props = []
                var vals = []
                elm.find('select.item-jasa, input.item-jasa').each(function(){
                    props.push($(this).attr('name'))
                    vals.push($(this).val())
                })
                items.push(_.object(props, vals))
            })
            return items
        }

        var data = _.object(keys, values)

        return {
            ...data,
            items: jsonDetailBarang(),
            jasa: jsonDetailJasa()
        }
    }
})