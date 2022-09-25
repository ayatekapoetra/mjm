$(function(){
    console.log('script/keu-pembayaran');

    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        setUrut()
    })

    $('body').on('focus, click', 'input[type="number"]', function(){
        $(this).select()
    })

    $('body').on('keyup', 'input[name="qty"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        // var discount = elm.find('input[name="discount"]').val() || 0
        // var type = elm.find('input[name="type-discount"]').val()

        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('keyup', 'input[name="harga_stn"]', function(){
        var elm = $(this).parents('tr')
        var harga = $(this).val()
        var qty = elm.find('input[name="qty"]').val() || 0
        // var discount = elm.find('input[name="discount"]').val() || 0
        // var type = elm.find('input[name="type-discount"]').val()
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('change', 'select[name="barang_id"]', function(){
        var values = $(this).val()
        var elmCoa = $(this).parents('tr').find('select[name="coa_debit"]')
        var elmSatuan = $(this).parents('tr').find('span.satuan')
        if (values) {
            $.ajax({
                async: true,
                url: '/ajax/options/barang/show/'+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    if(result){
                        elmCoa.val(result.coa_in)
                        elmCoa.trigger('change')
                        elmCoa.find('option[value!="'+result.coa_in+'"]').attr('disabled', true)
                        elmSatuan.html(result.satuan)
                    }else{
                        elmCoa.find('option').removeAttr('disabled')
                        elmCoa.val(null).trigger('change')
                        elmSatuan.html('')
                    }
                },
                error: function(err){
                    console.log(err)
                    elmCoa.find('option').removeAttr('disabled')
                    elmCoa.val(null).trigger('change')
                    elmSatuan.html('')
                }
            })
        }else{
            elmCoa.find('option').removeAttr('disabled')
            elmCoa.val(null).trigger('change')
            elmSatuan.html('')
        }
    })

    $('body').on('change', 'select[name="coa_debit"]', function(){
        var value = $(this).val()
        var elm = $(this).parents('tr.item-rows')
        $.ajax({
            async: true,
            url: '/ajax/coa/pembayaran/onchange-coa',
            method: 'GET',
            data: {
                coa_id: value
            },
            dataType: 'html',
            success: function(data){
                if(data){
                    elm.find('div[name="details-akun"]').html(data)
                }else{
                    elm.find('div[name="details-akun"]').html('')
                }
            },
            error: function(err){
                console.log(err);
                elm.find('div[name="details-akun"]').html('')
            },
            complete: function(){
                elm.find('input[name="harga_stn"]').val(0)
                hitungTotalHarga(elm, 1, 0)
            }
        })
    })

    $('body').on('change', 'select[name="pelanggan_id"]', function(){
        var value = $(this).val()
        var elm = $(this).parents('tr.item-rows')
        $.ajax({
            async: true,
            url: '/ajax/coa/faktur-pelanggan',
            method: 'GET',
            data: {
                pelanggan_id: value
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data){
                    elm.find('select[name="trx_jual"]').html(
                        data.map( val => '<option value="'+val.id+'">['+val.kdpesanan+']  sisa pembayaran -----> Rp. '+(val.sisa_trx).toLocaleString('ID')+'</option>')
                    )
                }else{
                    elm.find('select[name="trx_jual"]').html('')
                }
            },
            error: function(err){
                console.log(err);
                elm.find('select[name="trx_jual"]').html('')
            }
        })
    })

    $('body').on('change', 'select[name="pemasok_id"]', function(){
        var value = $(this).val()
        var elm = $(this).parents('tr.item-rows')
        $.ajax({
            async: true,
            url: '/ajax/coa/faktur-pemasok',
            method: 'GET',
            data: {
                pemasok_id: value
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if(data){
                    elm.find('select[name="trx_beli"]').html(
                        data.map( val => '<option value="'+val.id+'">['+val.kode+']  sisa pembayaran -----> Rp. '+(val.sisa).toLocaleString('ID')+'</option>')
                    )
                    elm.find('select[name="trx_beli"]').trigger('change')
                    elm.find('input[name="harga_stn"]').val(data[0].sisa)
                }else{
                    elm.find('select[name="trx_beli"]').html('')
                }
            },
            error: function(err){
                console.log(err);
                elm.find('select[name="trx_beli"]').html('')
            }
        })
    })

    $('body').on('change', 'select[name="trx_beli"]', function(){
        var id = $(this).val()
        var elm = $(this).parents('tr.item-rows')
        var qty = elm.find('input[name="qty"]').val()
        $.ajax({
            async: true,
            url: '/ajax/options/faktur-beli/'+id,
            method: 'GET',
            dataType: 'json',
            success: function(data){
                console.log(data);
                elm.find('input[name="harga_stn"]').val(data.sisa)
                hitungTotalHarga(elm, qty, data.sisa)
            },
            error: function(err){
                console.log(err);
                elm.find('input[name="harga_stn"]').val(0)
            }
        })
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData(this)
        formdata.append('items', JSON.stringify(data))
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'keu-pembayaran',
            method: 'POST',
            data: formdata,
            dataType:'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal('Okey', result.message, 'success')
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                // window.location.reload()
            }
        })
    })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'keu-pembayaran/'+id+'/show',
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
            }
        })
    })

    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var data = getDataForm()
        var formdata = new FormData(this)
        formdata.append('items', JSON.stringify(data))
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'keu-pembayaran/'+id+'/update',
            method: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.success){
                    swal("Okey,,,!", result.message, "success")
                    // initDefault()
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
                  url: 'keu-pembayaran/'+id+'/destroy',
                  method: 'POST',
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
    })

    $('body').on('click', 'button.bt-print', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'keu-pembayaran/'+id+'/print',
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                pdfMake.createPdf(result).print();
            },
            error: function(err){
                console.log(err)
                body.find('div#content-form').css('display', 'none')
            }
        })
    })

    

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'keu-pembayaran/list',
            method: 'GET',
            data: {
                limit: limit || 100,
                page: page || 1
            },
            dataType: 'html',
            contentType: false,
            beforeSend: function(){
                body.find('div#content-list').html(
                '<strong class="text-center" style="margin: 10px 25px;">Please wait,,,,</strong>'+
                '<p style="margin: 10px 25px;">System sedang melakukan loading data......</p>'
                )
            },
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
            }
        })
    }

    function initCreate(){
        $.ajax({
            async: true,
            url: 'keu-pembayaran/create',
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
                var tambahRows = body.find('input#row-number').val() || 1
                addItems(tambahRows)
            }
        })
    }

    function addItems(len){
        for (let index = 0; index < len; index++) {
            $.ajax({
                async: true,
                url: 'keu-pembayaran/create/add-item',
                method: 'GET',
                dataType: 'html',
                contentType: false,
                success: function(result){
                    body.find('tbody#item-details').append(result)
                    setUrut()
                },
                error: function(err){
                    console.log(err)
                },
                complete: function(){
                    body.find('select').select2()
                }
            })
        }
    }

    function setUrut(){
        $('tr.item-rows').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-urut', urut)
            $(this).find('td').first().find('h3.urut-rows').html(urut)

        })

        $('button.bt-remove-item').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-id', urut)
        })
    }

    

    function hitungTotalHarga(elm, qty, harga){
        var elmTotal = elm.find('input[name="subtotal"]')
        var count = (parseFloat(qty) * parseFloat(harga))
        elmTotal.val(count)

        var summary = 0
        body.find('input[name="subtotal"]').each(function(){
            var total = $(this).val()
            summary += parseFloat(total)
        })

        $('input[name="grandtot"]').val(parseFloat(summary))
    }

    function getDataForm(){
        let keys = []
        let values = []
        $('select.item-data, input.item-data').each(function(){
            var property = $(this).attr('name')
            var val = $(this).val()
            keys.push(property)
            values.push(val)
        })

        function itemData(){
            let items = []
            $('tr.item-rows').each(function(){
                var elm = $(this)

                var props = []
                var vals = []
                elm.find('select.item-data-details, input.item-data-details').each(function(){
                    props.push($(this).attr('name'))
                    vals.push($(this).val())
                })

                items.push(_.object(props, vals))
            })
            return items
        }

        var data = _.object(keys, values)

        return {
            // ...data,
            items: itemData()
        }
    }
})