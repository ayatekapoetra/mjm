$(function(){
    console.log('script/acc-entri-jurnal.js');

    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('click', 'button.bt-add-jurnal', function(){
        initCreateItem()
        $(this).removeClass('btn-warning').addClass('btn-default').attr('disabled', 'disabled')
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        setUrut()
    })

    $('body').on('keyup', 'input[name="d"], input[name="k"]', function(){
        hitungDebitKredit()
    })

    $('body').on('change', 'select[name="coa_id"]', function(e){
        e.preventDefault()
        var elm = $(this)
        var value = elm.val()
        setRelationEntry(elm, value)
    })

    $('body').on('change', 'select[name="pelanggan_id"]', function(e){
        e.preventDefault()
        var elm = $(this)
        var value = elm.val()
        console.log(value);
        if(value){
            optionInvoices(elm, value)
        }
        elm.parents('tr.item-rows').find('select[name="order_id"]').val(null).trigger('change')
    })

    $('body').on('change', 'select[name="barang_id"]', function(e){
        e.preventDefault()
        var elm = $(this)
        var value = elm.val()
        elm.parents('tr.item-rows').find('select[name="gudang_id"]').val('').trigger('change')
        if(value){
            optionGudang(elm)
        }
    })

    $('body').on('change', 'select[name="pemasok_id"]', function(e){
        e.preventDefault()
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
            beforeSend: function(){
                elm.find('span[id="faktur_id"]').html('<i class="fa fa-spinner fa-spin"></i>')
            },
            success: function(data){
                console.log(data);
                if(data.length > 0){
                    elm.find('select[name="faktur_id"]').html(
                        data.map( val => '<option value="'+val.id+'">['+val.kode+']  sisa pembayaran -----> Rp. '+(val.sisa).toLocaleString('ID')+'</option>')
                    )
                    elm.find('select[name="faktur_id"]').trigger('change')
                    elm.find('span[id="faktur_id"]').html('Faktur Hutang')
                }else{
                    elm.find('select[name="faktur_id"]').html('<option value="">Data tidak ditemukan...</option>')
                    elm.find('select[name="faktur_id"]').val('').trigger('change')
                    elm.find('span[id="faktur_id"]').html('<i class="fa fa-spinner fa-spin"></i>')
                }
            },
            error: function(err){
                console.log(err);
                elm.find('select[name="faktur_id"]').html('')
                elm.find('span[id="faktur_id"]').html('error data...')
            }
        })
    })
    

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var formdata = new FormData(this)
        var data = getDataForm()
        console.log(data);
        formdata.append('dataForm', JSON.stringify(data))
        formdata.append('file', $('input[name="attach"]').get(0).files)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entri-jurnal',
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

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'entri-jurnal/'+id+'/show',
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
                hitungDebitKredit()
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
        formdata.append('file', $('input[name="attach"]').get(0).files)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'entri-jurnal/'+id+'/update',
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

    $('body').on('click', 'button.bt-delete', function(e){
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
                  url: 'entri-jurnal/'+id+'/destroy',
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

    /** FUNC **/
    function initDefault(limit, page){
        var start_date = body.find('input[name="trxdate_begin"]').val()
        $.ajax({
            async: true,
            url: 'entri-jurnal/list',
            method: 'GET',
            data: {
                limit: limit,
                page: page || 1
            },
            dataType: 'html',
            contentType: false,
            beforeSend: function(){
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-list').html('Loading Data....')
            },
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form, div#div-filter-limit').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
            }
        })
    }

    function initCreate(){
        $.ajax({
            async: true,
            url: 'entri-jurnal/create',
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
                body.find('button#bt-create-form, div#div-filter-limit').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
                initCreateItem()
            }
        })
    }

    function initCreateItem(){
        $.ajax({
            async: true,
            url: 'entri-jurnal/create/add-item',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                // console.log(result);
                body.find('tbody#item-akun').append(result)
                setUrut()
            },
            error: function(err){
                console.log(err)
            }
        })
    }

    function setUrut(){
        $('tr.item-rows').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-urut', urut)
            $(this).find('td').first().find('h4.urut-rows').html(urut)
        })

        $('tr.item-rows').last().find('button.bt-add-jurnal').removeAttr('disabled').addClass('btn-warning').removeClass('btn-default')

        $('button.bt-remove-item').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-id', urut)
        })
    }

    function hitungDebitKredit(){
        var arrDebit = [0]
        $('input[name="d"]').each(function(){
            arrDebit.push($(this).val() || 0)
        })
        var arrKredit = [0]
        $('input[name="k"]').each(function(){
            arrKredit.push($(this).val() || 0);
        })
        var totDebit = arrDebit.reduce((a, b) => { return parseFloat(a) + parseFloat(b) })
        var totKredit = arrKredit.reduce((a, b) => { return parseFloat(a) + parseFloat(b) })
        $('span#totDebit').html(totDebit)
        $('span#totKredit').html(totKredit)
        $('span#totBalance').html(Math.abs(totDebit - totKredit))
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

        try {
            var data = _.object(keys, values)
    
            return {
                ...data,
                items: itemData()
            }
        } catch (error) {
            console.log(error);
            return error
        }

    }

    function setRelationEntry(elm, coa){
        elm.parents('tr.item-rows').find('div.entri-details').css('display', 'none')
        elm.parents('tr.item-rows').find('select.entri-items, input.entri-items').val('').trigger('change')
        $.ajax({
            async: true,
            url: 'entri-jurnal/create/' + coa + '/select-relation',
            method: 'GET',
            dataType: 'json',
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.group){
                    elm.parents('tr.item-rows').find('div.'+result.group).css('display', 'block')
                    elm.parents('tr.item-rows').find('select[name="order_id"]').html('<option value="">Pilih...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    }

    function optionGudang(elm){
        $.ajax({
            async: true,
            url: 'entri-jurnal/create/select-gudang',
            method: 'GET',
            dataType: 'json',
            contentType: false,
            beforeSend: function(){
                console.log('beforeSend...', elm.parents('tr.item-rows').find('select[name="gudang_id"]'));
                elm.parents('tr.item-rows').find('select[name="gudang_id"]').val('').trigger('change')
            },
            success: function(result){
                console.log('optionGudang :::', result);
                if(result.length > 0){
                    let data = result.map( o => '<option value="'+o.id+'">[ ' + o.kode + ' ] ' + o.nama + '</option>')
                    elm.parents('tr.item-rows').find('select[name="gudang_id"]').html(data)
                }else{
                    elm.parents('tr.item-rows').find('select[name="gudang_id"]').val('').trigger('change')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    }

    function optionInvoices(elm, pelanggan){
        elm.parents('tr.item-rows').find('select[name="order_id"]').val('').trigger('change')
        $.ajax({
            async: true,
            url: 'entri-jurnal/create/' + pelanggan + '/select-invoice',
            method: 'GET',
            dataType: 'json',
            contentType: false,
            success: function(result){
                console.log('optionInvoices :::', result);
                if(result.length > 0){
                    let data = result.map( o =>
                        '<optgroup label="Tanggal : '+o.date+'">'+
                            o.items?.map( i => '<option value="'+i.id+'">'+i.invoices+'</option>')+
                        '<optgroup>'
                    )
                    elm.parents('tr.item-rows').find('select[name="order_id"]').html(data)
                }else{
                    elm.parents('tr.item-rows').find('select[name="order_id"]').val('').trigger('change')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    }
})