$(function(){
    console.log('script/keu-faktur-penjualan');

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

    // $('body').on('hidden.bs.modal', '#filterForm', function(){
    //     var elm = body.find('div#filterForm')
    //     var duedate_begin = elm.find('input[name="duedate_begin"]').val()
    //     var status_paid = elm.find('select[name="fil_status_paid"]').val()
    //     var duedate_end = elm.find('input[name="duedate_end"]').val()
    //     var pemasok_id = elm.find('select[name="fil_pemasok_id"]').val()
    //     var gudang_id = elm.find('select[name="fil_gudang_id"]').val()
    //     var kode_ = elm.find('input[name="kode_"]').val()

    //     $.ajax({
    //         async: true,
    //         url: 'faktur-penjualan/list',
    //         method: 'GET',
    //         data: {
    //             duedate_begin: duedate_begin,
    //             duedate_end: duedate_end,
    //             status_paid: status_paid,
    //             pemasok_id: pemasok_id,
    //             gudang_id: gudang_id,
    //             kode_: kode_
    //         },
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
    //         }
    //     })
    // })

    // $('body').on('change', 'select[name="reff_order"], select[name="pemasok_id"]', function(){
    //     var order_id = body.find('select[name="reff_order"]').val()
    //     var pemasok = body.find('select[name="pemasok_id"]').val()
    //     if(order_id && pemasok){
    //         $.ajax({
    //             async: true,
    //             url: '/ajax/options/purchasing-request/'+order_id,
    //             method: 'GET',
    //             dataType: 'json',
    //             data: { 
    //                 pemasok_id: pemasok,
    //             },
    //             contentType: false,
    //             beforeSend: function(){
    //                 console.log(order_id, pemasok);
    //                 body.find('tbody#item-details').html('')
    //             },
    //             success: function(data){
    //                 console.log(data);
    //                 body.find('tbody#item-details').html(data.itemsHTML)

    //                 body.find('select[name="cabang_id"]').val(data.data.cabang_id).trigger('change')
    //                 body.find('select[name="gudang_id"]').val(data.data.gudang_id).trigger('change')
                    
    //             },
    //             error: function(err){
    //                 console.log(err)
    //                 body.find('tbody#item-details').html('<td colspan="2"><code>Tidak ditemukan pesanan dengan pemasok dan kode pesanan terpilih...</code></td?')
    //             },
    //             complete: function(){
    //                 $('select').select2()
    //                 setUrut()
    //             }
    //         })
    //     }
    // })

    $('body').on('keyup', 'input[name="qty"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        var discount = elm.find('input[name="discount"]').val() || 0
        var type = elm.find('input[name="type-discount"]').val()

        hitungTotalHarga(elm, qty, harga, type, discount)
    })

    $('body').on('keyup', 'input[name="harga_stn"]', function(){
        var elm = $(this).parents('tr')
        var harga = $(this).val()
        var qty = elm.find('input[name="qty"]').val() || 0
        var discount = elm.find('input[name="discount"]').val() || 0
        var type = elm.find('input[name="type-discount"]').val()
        hitungTotalHarga(elm, qty, harga, type, discount)
    })

    $('body').on('keyup', 'input[name="discount"]', function(){
        var elm = $(this).parents('tr')
        var discount = $(this).val()
        var qty = elm.find('input[name="qty"]').val() || 0
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        var type = elm.find('input[name="type-discount"]').val()
        hitungTotalHarga(elm, qty, harga, type, discount)
    })

    $('body').on('change', 'select[name="barang_id"]', function(){
        var values = $(this).val()
        var elmCoa = $(this).parents('tr').find('select[name="coa_id"]')
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
                    console.log(result);
                    if(result){
                        console.log('......', elmCoa);
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
            console.log('no values....', elmCoa);
            elmCoa.val(null).trigger('change')
            elmSatuan.html('')
        }
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData(this)
        formdata.append('dataForm', JSON.stringify(data))
        // formdata.append('lampiran', $('input#lampiran')[0].files[0])
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'faktur-penjualan',
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
                    window.location.reload()
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
            url: 'faktur-penjualan/'+id+'/show',
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
                  url: 'faktur-penjualan/'+id+'/destroy',
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
                      swal("Opps,,,!", err?.responseJSON?.error?.message ||'Server Error', "error")
                  }
              })

          })
    })

    $('body').on('click', 'button.bt-print', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'faktur-penjualan/'+id+'/print',
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                pdfMake.createPdf(result).print();
            },
            error: function(err){
                console.log(err)
                body.find('div#content-form').css('display', 'none')
            }
        })
    })

    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var data = getDataForm()
        var formdata = new FormData(this)
        formdata.append('dataForm', JSON.stringify(data))
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'faktur-penjualan/'+id+'/update',
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
            url: 'faktur-penjualan/list',
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
            url: 'faktur-penjualan/create',
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
                body.find('button#bt-create-form, button#filter').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
            }
        })
    }

    function addItems(len){
        for (let index = 0; index < len; index++) {
            $.ajax({
                async: true,
                url: 'faktur-penjualan/create/add-item',
                method: 'GET',
                dataType: 'html',
                contentType: false,
                success: function(result){
                    body.find('tbody#item-details').append(result)
                    setUrut()
                },
                error: function(err){
                    console.log(err)
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

    function hitungTotalHarga(elm, qty, harga, type, discount){
        var elmTotal = elm.find('input[name="subtotal"]')
        if(type != 'persen'){
            var count = (parseFloat(qty) * parseFloat(harga)) - parseFloat(discount)
        }else{
            var tot = parseFloat(qty) * parseFloat(harga)
            var discount_rp = (parseFloat(tot) * parseFloat(discount)) / 100
            console.log(discount_rp);
            var count = (parseFloat(qty) * parseFloat(harga)) - parseFloat(discount_rp)
        }

        elmTotal.val(count)

        var summary = 0
        body.find('input[name="subtotal"]').each(function(){
            var total = $(this).val()
            summary += parseFloat(total)
        })

        var isPPN = body.find('input[name="ppn"]').val()
        if(isPPN){
            var ppnRp = (parseFloat(isPPN) / 100) * parseFloat(summary)
            $('input[name="grandtot"]').val(parseFloat(summary) + parseFloat(ppnRp))
        }else{
            $('input[name="grandtot"]').val(parseFloat(summary))
        }
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

                // console.log(props);
                // console.log(vals);
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