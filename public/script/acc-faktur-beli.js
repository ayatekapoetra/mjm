$(function(){
    console.log('script/acc-faktur-beli');

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

    $('body').on('keyup', 'input[name="qty"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="harga_stn"]').val() || 0
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('keyup', 'input[name="harga_stn"]', function(){
        var elm = $(this).parents('tr')
        var qty = $(this).val()
        var harga = elm.find('input[name="qty"]').val() || 0
        hitungTotalHarga(elm, qty, harga)
    })

    $('body').on('change', 'select[name="barang_id"]', function(){
        var values = $(this).val()
        var elmCoa = $(this).parents('tr').find('select[name="coa_id"]')
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
                        console.log(elmCoa);
                        elmCoa.val(result.coa_in)
                        elmCoa.trigger('change')
                        elmCoa.find('option[value!="'+result.coa_in+'"]').attr('disabled', true)
                    }
                },
                error: function(err){
                    console.log(err)
                    elmCoa.val(null).trigger('change')
                    elmCoa.find('option').removeAttr('disabled')
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
            url: 'faktur-beli',
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
                window.location.reload()
            }
        })
    })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'faktur-beli/'+id+'/show',
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
            url: 'faktur-beli/'+id+'/print',
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
            url: 'faktur-beli/'+id+'/update',
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
            url: 'faktur-beli/list',
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
            url: 'faktur-beli/create',
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
                url: 'faktur-beli/create/add-item',
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

    function hitungTotalHarga(elm, qty, harga){
        var elmTotal = elm.find('input[name="subtotal"]')
        var count = parseFloat(qty) * parseFloat(harga)
        elmTotal.val(count)
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