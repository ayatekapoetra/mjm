// const _ = require("underscore")

$(function(){
    var body = $('body')

    initDefault()

    // body.on('keypress', function(e){
    //     // if ( e.ctrlKey && ( e.which === 102 ) ) {
    //     //     // e.preventDefault()
    //     //     console.log( "You pressed CTRL + B untuk payment" );
    //     // }
    //     console.log(e.which);
    //     if ( e.keyCode === 112 ) {
    //         console.log( "You pressed F1" );
    //     }
    // })

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

    $('body').on("click", 'input[type="number"]', function () {
        $(this).select();
    });

    // $('body').on('click', 'button.bt-add-barang', function(){
    //     initCreateItem()
    //     var elm = $(this)
    //     var urut = elm.parents('tr').data('urut')
    //     var dataBarang = elm.parents('tr').data('barang')
    //     var qty = elm.parents('tr').find('input[name="qty"]').val()
    //     var hargaJual = elm.parents('tr').find('input[name="hargaJual"]').val()
    //     var tothargabarang = parseFloat(qty) * parseFloat(hargaJual)
    //     elm.parents('tr').find('input, select').attr('readonly', 'readonly')
    //     elm.parents('td').find('button.bt-add-barang').css('display', 'none')
    //     elm.parents('td').find('button.bt-del-barang').css('display', 'block')
    //     /* Tambah Data Details Barang */
    //     body.find('tbody#list-details-order-pelanggan').append(
    //         '<tr id="B'+urut+'" data-tothargabarang="'+tothargabarang+'" data-totbiaya="0">'+
    //         '<td>'+qty+'</td>'+
    //         '<td>'+dataBarang.nama+'</td>'+
    //         '<td class="text-right">'+dataBarang.satuan+'</td>'+
    //         '<td class="text-right">'+hargaJual+'</td>'+
    //         '</tr>'
    //     )
    //     totalBelanja()
    // })

    // $('body').on('click', 'button.bt-del-barang', function(){
    //     var elm = $(this)
    //     var urut = elm.parents('tr').data('urut')
    //     body.find('tbody#list-details-order-pelanggan tr#B'+urut).remove()
    //     elm.parents('tr').remove()
    //     body.find('tbody#item-barang tr').each(function(i){
    //         $(this).find('td.urut').html(i+1)
    //     })
    //     totalBelanja()
    // })

    // $('body').on('click', 'button.bt-add-jasa', function(){
    //     initCreateJasa()
    //     var elm = $(this)
    //     var urut = elm.parents('tr').data('urut')
    //     var qty = elm.parents('tr').find('input[name="qty"]').val()
    //     var biaya = elm.parents('tr').find('input[name="biaya"]').val()
    //     var totbiaya = parseFloat(qty) * parseFloat(biaya)
    //     var nama = elm.parents('tr').find('input[name="nama"]').val()
    //     elm.parents('td').find('button.bt-add-jasa').css('display', 'none')
    //     elm.parents('td').find('button.bt-del-jasa').css('display', 'block')
    //     /* Tambah Data Details Barang */
    //     body.find('tbody#list-details-order-pelanggan').append(
    //         '<tr id="J'+urut+'" data-tothargabarang="0" data-totbiaya="'+totbiaya+'">'+
    //         '<td>'+qty+'</td>'+
    //         '<td>'+nama+'</td>'+
    //         '<td class="text-right">-</td>'+
    //         '<td class="text-right">'+biaya+'</td>'+
    //         '</tr>'
    //     )
    //     totalBelanja()
    // })

    // $('body').on('click', 'button.bt-del-jasa', function(){
    //     var elm = $(this)
    //     var urut = elm.parents('tr').data('urut')
    //     body.find('tbody#list-details-order-pelanggan tr#J'+urut).remove()
    //     elm.parents('tr').remove()
    //     body.find('tbody#item-jasa tr').each(function(i){
    //         console.log($(this).find('td.urut').html(i+1));
    //     })
    //     totalBelanja()
    // })

    // $('body').on('click', '#apply-filter', function(){
    //     var limit = $('input[name="limit"]').val()
    //     var kode = $('input[name="kode"]').val() && '&kode=' + $('input[name="kode"]').val()
    //     var nama = $('input[name="nama"]').val() && '&nama=' + $('input[name="nama"]').val()
    //     var email = $('input[name="email"]').val() && '&email=' + $('input[name="email"]').val()
    //     var phone = $('input[name="phone"]').val() && '&phone=' + $('input[name="phone').val()
    //     var cabang_id = $('select[name="cabang_id"]').val()  && '&cabang_id=' + $('select[name="cabang_id"]').val()
    //     var url = `jasa/list?keyword=true&limit=${limit}${kode}${nama}${email}${phone}${cabang_id}`
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

    // $('body').on('click', '#reset-filter', function(){
    //     var limit = $('input[name="limit"]').val()
    //     initDefault(limit)
    //     $('div#filtermodal').find('input').val('')
    //     $('div#filtermodal').find('select').val(null).trigger('change')
    // })

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