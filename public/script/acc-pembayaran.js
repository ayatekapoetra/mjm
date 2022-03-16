$(function(){
    console.log('script/acc-pembayaran');

    var body = $('body')

    
    initDefault()
    
    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
        body.find('span#tgl-pembayaran').html('Tertanggal : ' + moment().format('DD-MM-YYYY'))
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('change', 'select[name="paidby"]', function(){
        var value = $(this).val()
        setPaidBy(value)
    })

    $('body').on('change', 'select[name="is_delay"]', function(){
        var value = $(this).val()
        if(value === 'Y'){
            body.find('input[name="delay_trx"]').removeAttr('readonly')
        }else{
            body.find('input[name="delay_trx"]').attr('readonly', 'true')
            body.find('input[name="delay_trx"]').val(moment().format('YYYY-MM-DD'))
        }
    })

    $('body').on('click', 'button.bt-clear-item', function(e){
        e.preventDefault()
        var elmTr = $(this).parents('tr.item-rows')
        elmTr.find('select[name="barang_id"]').removeAttr('required')
        elmTr.find('select[name="gudang_id"]').removeAttr('required')
        elmTr.find('div[class="divBarang"]').css('display', 'none')
        elmTr.find('input[name="harga_stn"]').val('0')
        elmTr.find('input[name="harga_total"]').val('0')
        elmTr.find('select[name="barang_id"]').val(null).trigger('change')
        elmTr.find('select[name="coa_debit"]').val(null).trigger('change')
        elmTr.find('select[name="gudang_id"]').val(null).trigger('change')
        elmTr.find('div#optionSource, div#optionFaktur').html('')
    })

    $('body').on('change', 'select[name="coa_kredit"]', function(){
        var workdir = body.find('input#workdir').val()
        var value = $(this).val()
        if(value){
            $.ajax({
                async: true,
                url: '/ajax/isbank?bisnis_id='+workdir+'&coa_id='+value,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    body.find('div[id="is_delay"]').css('display', 'inline')
                    body.find('div[id="optionKasBank"]').css('display', 'inline')
                    body.find('div[id="optionKasBank"]').html(result)
                },
                error: function(err){
                    console.log(err)
                },
                complete: function() {
                    body.find('select[name="is_delay"]').val('N')
                }
            })
        }else{
            body.find('div[id="optionKasBank"]').html('')
        }
    })

    $('body').on('change', 'select[name="coa_debit"]', function(e){
        var elm = $(this)
        var values = elm.val()
        var workdir = body.find('input#workdir').val()
        var params = '?bisnis_id='+workdir+'&selected='+values
        console.log('/ajax/coa/check-transaksi'+params);
        if(values){
            $.ajax({
                async: true,
                url: '/ajax/coa/check-transaksi'+params,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    elm.parents('tr.item-rows').find('div#optionSource, div#optionFaktur').html('')
                    elm.parents('tr.item-rows').find('div#optionSource').html(result)
                },
                error: function(err){
                    console.log(err)
                }
            })
        }
    })

    $('body').on('change', 'select[name="barang_id"]', function(e){
        var elm = $(this)
        var values = elm.val()
        var workdir = body.find('input#workdir').val()
        if(values){
            $.ajax({
                async: true,
                url: '/ajax/coa/faktur-gudang?bisnis_id='+workdir+'&selected='+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    elm.parents('tr.item-rows').find('select[name="coa_debit"]').val(result.coa_in).trigger('change')
                    elm.parents('tr.item-rows').find('div#optionFaktur').html('')
                },
                error: function(err){
                    console.log(err)
                    elm.parents('tr.item-rows').find('div#optionSource').html('')
                }
            })
        }
    })

    $('body').on('change', 'select[name="pelanggan_id"]', function(e){
        var elm = $(this)
        var values = elm.val()
        var workdir = body.find('input#workdir').val()
        if(values){
            $.ajax({
                async: true,
                url: '/ajax/coa/faktur-pelanggan?bisnis_id='+workdir+'&pelanggan_id='+values,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    // console.log(result);
                    elm.parents('tr.item-rows').find('div#optionFaktur').html(result)
                },
                error: function(err){
                    console.log(err)
                    elm.parents('tr.item-rows').find('div#optionSource').html('')
                }
            })
        }else{
            elm.parents('tr.item-rows').find('div#optionFaktur').html('')
        }
    })

    $('body').on('change', 'select[name="pemasok_id"]', function(e){
        var elm = $(this)
        var values = elm.val()
        var workdir = body.find('input#workdir').val()
        if(values){
            $.ajax({
                async: true,
                url: '/ajax/coa/faktur-pemasok?bisnis_id='+workdir+'&pemasok_id='+values,
                method: 'GET',
                dataType: 'html',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    // console.log(result);
                    elm.parents('tr.item-rows').find('div#optionFaktur').html(result)
                },
                error: function(err){
                    console.log(err)
                    elm.parents('tr.item-rows').find('div#optionSource').html('')
                }
            })
        }else{
            elm.parents('tr.item-rows').find('div#optionFaktur').html('')
        }
    })

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        setUrut()
    })

    // $('body').on('change', 'select[name="equipment_id"]', function(){
    //     var elm = $(this)
    //     var value = $(this).val()
    //     if(value){
    //         setHargaRental(elm, value)
    //     }
    // })

    $('body').on('keyup', 'input[name="qty"]', function(e){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="harga_stn"]').val()
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('keyup', 'input[name="harga_stn"]', function(e){
        var elm = $(this).parents('tr')
        var harga = $(this).val()
        // console.log('harga :::', harga);
        var qty = elm.find('input[name="qty"]').val()
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('keyup', 'input[name="harga_pot"]', function(e){
        var elm = $(this).parents('tr')
        var qty = elm.find('input[name="qty"]').val()
        var harga = elm.find('input[name="harga_stn"]').val()
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        console.log(data);
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'pembayaran',
            method: 'POST',
            data: formdata,
            dataType:'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal({
                        title: "Insert more data ?",
                        text: "Form will reset after confirmation...",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: false
                      },
                      function(isConfirm){
                        if (isConfirm) {
                            $('form#form-create')[0].reset();
                            $('body').find('select').val('').trigger('change')
                            swal("Reset Form!", "already done.", "success");
                          }else{
                              window.location.reload()
                          }
                      });
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log('ERR', err)
                swal('Opps', 'terjadi error...', 'warning')
            }
        })
    })

    $('body').on('click', 'button.bt-print', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'pembayaran/'+id+'/print',
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

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'pembayaran/'+id+'/show',
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
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'pembayaran/'+id+'/update',
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

    $('body').on('click', 'button#bt-delete', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        console.log(id);
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
                  url: 'pembayaran/'+id+'/destroy',
                  method: 'DELETE',
                  dataType: 'json',
                  processData: false,
                  mimeType: "multipart/form-data",
                  contentType: false,
                  success: function(result){
                      if(result.success){
                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
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

    function setPaidBy(value){
        body.find('div.debitur').each(function(){
            $(this).css('display', 'none')
        })
        body.find('div.div-'+value).css('display', 'inline')
    }

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'pembayaran/list',
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
            url: 'pembayaran/create',
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
                url: 'pembayaran/create/add-item',
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
            // console.log(urut);
            $(this).attr('data-urut', urut)
            $(this).find('td').first().find('h3.urut-rows').html(urut)
        })

        $('button.bt-remove-item').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-id', urut)
        })
    }

    function hitungTotalHarga(elm, qty, harga){
        var elmTotal = elm.find('input[name="harga_total"]')
        var count = (parseFloat(qty) * parseFloat(harga))
        elmTotal.val(count)

        var totHarga = []
        $('body input[name="harga_stn"]').each(function(){
            totHarga.push($(this).val())
        })

        var totPotongan = []
        $('body input[name="harga_pot"]').each(function(){
            totPotongan.push($(this).val())
        })

        var totalharga = totHarga.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }, 0)
        var totpotongan = totPotongan.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }, 0)
        $('body input[name="totharga"]').val(totalharga)
        $('body input[name="totpot"]').val(totpotongan)
        $('body input[name="grandtotal"]').val(totalharga - totpotongan)

    }

    function setHargaBarang(elm, val){
        var workdir = body.find('input#workdir').val()
        console.log('VAL ;;;;', val);
        if(val){
            $.ajax({
                async: true,
                url: '/ajax/options/barang/harga-jual?bisnis_id='+workdir+'&barang_id='+val,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    if(parseInt(result.harga_jual) > 0){
                        elm.parents('tr.item-rows').find('input[name="harga_stn"]').val(result.harga_jual)
                        elm.parents('tr.item-rows').find('div.divHarga').removeClass( "has-error" )
                    }else{
                        alert('Harga tidak ditemukan pada master harga jual')
                        elm.parents('tr.item-rows').find('div.divHarga').toggleClass( "has-error" )
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
        }
    }

    function setHargaRental(elm, val){
        var workdir = body.find('input#workdir').val()
        if(val){
            $.ajax({
                async: true,
                url: '/ajax/options/equipment/harga-rental?bisnis_id='+workdir+'&equipment_id='+val,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    if(parseInt(result.harga) > 0){
                        elm.parents('tr.item-rows').find('input[name="harga_stn"]').val(result.harga)
                    }else{
                        alert('Harga tidak ditemukan pada master harga rental')
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
        }else{
            elm.parents('tr.item-rows').find('input[name="harga_stn"]').val('0')
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

                items.push(_.object(props, vals))
            })
            return items
        }

        var data = _.object(keys, values)

        return {
            ...data,
            items: itemData()
        }
    }
})