$(function(){
    console.log('script/acc-faktur-jual');

    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('click', 'input[name="actionCheck"]', function(){
        var body = $('body')
        var elm = $(this)
        var isBrg = elm.is(':checked')
        if(isBrg){
            body.find('tr.item-rows').each(function(){
                console.log($(this).find('select[name="coa_id"]'));
                // $(this).find('select[name="coa_id"]').val(null)
                // $(this).trigger('change')
                body.find('div.divEquipment').css('display', 'none')
                body.find('select[name="equipment_id"]').val(null).trigger('change')
                body.find('select[name="equipment_id"]').removeAttr('required')
                body.find('select[name="barang_id"]').attr('required', 'true')
                body.find('div.divBarang').css('display', 'inline')
                body.find('select[name="coa_id"]').val(null).trigger('change')
            })
        }else{
            body.find('tr.item-rows').each(function(){
                // $(this).find('select[name="coa_id"]').val(null)
                // $(this).trigger('change')
                body.find('div.divBarang').css('display', 'none')
                body.find('select[name="barang_id"]').val(null).trigger('change')
                body.find('select[name="barang_id"]').removeAttr('required')
                body.find('select[name="equipment_id"]').attr('required', 'true')
                body.find('div.divEquipment').css('display', 'inline')
                body.find('select[name="coa_id"]').val(null).trigger('change')
            })
        }
        // elmCoa.find('option').removeAttr('disabled')
    })

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        setUrut()
    })

    $('body').on('change', 'select[name="equipment_id"]', function(){
        var elm = $(this)
        var value = $(this).val()
        setHargaRental(elm, value)
    })

    $('body').on('keyup', 'input[name="qty"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        var pot = elm.find('input[name="harga_pot"]').val() || 0
        hitungTotalHarga(elm, qty, harga, pot)
    })

    $('body').on('keyup', 'input[name="harga_stn"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="qty"]').val() || 0
        var pot = elm.find('input[name="harga_pot"]').val() || 0
        hitungTotalHarga(elm, qty, harga, pot)
    })

    $('body').on('keyup', 'input[name="harga_pot"]', function(){
        var elm = $(this).parents('tr')
        var pot = $(this).val()
        var qty = elm.find('input[name="qty"]').val() || 0
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        hitungTotalHarga(elm, qty, harga, pot)
    })

    $('body').on('change', 'select[name="barang_id"]', function(){
        var values = $(this).val()
        var elmCoa = $(this).parents('tr').find('select[name="coa_id"]')
        elmCoa.val(null).trigger('change')
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
                        elmCoa.val(result.coa_out)
                        elmCoa.trigger('change')
                    }
                },
                error: function(err){
                    console.log(err)
                    elmCoa.val(null).trigger('change')
                }
            })
        }
    })

    $('body').on('change', 'select[name="equipment_id"]', function(){
        var values = $(this).val()
        var elmCoa = $(this).parents('tr').find('select[name="coa_id"]')
        elmCoa.val(null).trigger('change')
        if (values) {
            $.ajax({
                async: true,
                url: '/ajax/options/equipment/show/'+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    console.log(result);
                    if(result){
                        elmCoa.val(result.coa_out)
                        elmCoa.trigger('change')
                    }
                },
                error: function(err){
                    console.log(err)
                    elmCoa.val(null).trigger('change')
                }
            })
        }
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'faktur-jual',
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
                console.log('ERR', err)
            },
            complete: function() {
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
                      } else {
                        window.location.reload()
                      }
                  });
            }
        })
    })

    $('body').on('click', 'button.bt-view', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'faktur-jual/'+id+'/view',
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

    $('body').on('click', 'button.bt-print', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'faktur-jual/'+id+'/print',
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

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'faktur-jual/'+id+'/show',
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
            url: 'faktur-jual/'+id+'/update',
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
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'faktur-jual/'+id+'/destroy',
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
    })

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'faktur-jual/list',
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
            url: 'faktur-jual/create',
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
                url: 'faktur-jual/create/add-item',
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

    function hitungTotalHarga(elm, qty, harga, pot){
        var elmTotal = elm.find('input[name="subtotal"]')
        var count = (parseFloat(qty) * parseFloat(harga)) - parseFloat(pot)
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

                // console.log(props);
                // console.log(vals);
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