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

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        hitungDebitKredit()
        setUrut()
    })

    $('body').on('change', 'select[name="coa_id"]', function(e){
        e.preventDefault()
        var elm = $(this)
        var value = elm.val()
        setCoaRalation(elm, value)
    })

    $('body').on('keyup', 'input[name="d"], input[name="k"]', function(){
        hitungDebitKredit()
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        // $('body').find('button[type="submit"]').attr('disabled', true)
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
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
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
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
                var tambahRows = body.find('input#row-number').val() || 1
                addItems(tambahRows)
            }
        })
    }

    function setCoaRalation(elm, value) {
        var persediaan = $('input#coa_persediaan').val()
        var hutangdagang = $('input#coa_hutangdagang').val()
        var piutangdagang = $('input#coa_piutangdagang').val()
        if(value){
            var elmCoa = elm.parents('tr').find('select[name="coa_id"]')
            var elmCoaID = elmCoa.find('option[value="'+value+'"]').attr('kode')
            var rootTr = elm.parents('tr.item-rows')
            if (elmCoaID === piutangdagang) {
                rootTr.find('div.piutangdagang').css('display', 'inline')
                rootTr.find('div.hutangdagang').css('display', 'none')
                rootTr.find('div.persediaan').css('display', 'none')
                rootTr.find('select[name="trx_jual"]').attr('required', true)
                rootTr.find('select[name="trx_beli"]').removeAttr('required', true)
                rootTr.find('select[name="gudang_id"]').removeAttr('required', true)
                rootTr.find('select[name="barang_id"]').removeAttr('required', true)
                rootTr.find('select[name="gudang_id"]').val(null)
                rootTr.find('select[name="barang_id"]').val(null)
                rootTr.find('select[name="trx_beli"]').val(null)
                rootTr.find('input[name="qty"]').val(0)
            } else if(elmCoaID === hutangdagang) {
                rootTr.find('div.hutangdagang').css('display', 'inline')
                rootTr.find('div.piutangdagang').css('display', 'none')
                rootTr.find('div.persediaan').css('display', 'none')
                rootTr.find('select[name="trx_beli"]').attr('required', true)
                rootTr.find('select[name="trx_jual"]').removeAttr('required', true)
                rootTr.find('select[name="gudang_id"]').removeAttr('required', true)
                rootTr.find('select[name="barang_id"]').removeAttr('required', true)
                rootTr.find('select[name="gudang_id"]').val(null)
                rootTr.find('select[name="barang_id"]').val(null)
                rootTr.find('select[name="trx_jual"]').val(null)
                rootTr.find('input[name="qty"]').val(0)
            }else if(elmCoaID === persediaan){
                rootTr.find('div.persediaan').css('display', 'inline')
                rootTr.find('div.hutangdagang').css('display', 'none')
                rootTr.find('div.piutangdagang').css('display', 'none')
                rootTr.find('select[name="gudang_id"]').attr('required', true)
                rootTr.find('select[name="barang_id"]').attr('required', true)
                rootTr.find('select[name="trx_beli"]').removeAttr('required', true)
                rootTr.find('select[name="trx_jual"]').removeAttr('required', true)
                rootTr.find('select[name="trx_jual"]').val(null)
                rootTr.find('select[name="trx_beli"]').val(null)
            }else{
                rootTr.find('div.div-relation').css('display', 'none')
            }
        }

        // console.log(persediaan);
    }

    function addItems(len){
        for (let index = 0; index < len; index++) {
            $.ajax({
                async: true,
                url: 'entri-jurnal/create/add-item',
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

                // console.log(props);
                // console.log(vals);
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
})