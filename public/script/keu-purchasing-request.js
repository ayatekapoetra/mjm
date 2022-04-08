$(function(){
    console.log('script/keu-purchasing-request');

    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
        body.find('div#div-filter-limit').toggleClass('hidden')
    })

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        var id = $(this).data('id')
        removeItems(id)
    })

    $('body').on('click', '#apply-filter', function(){
        var limit = $('input[name="limit"]').val()
        var kode = $('input[name="kode"]').val() && '&kode=' + $('input[name="kode"]').val()
        var cabang_id = $('select[name="cabang_id"]').val() && '&cabang_id=' + $('select[name="cabang_id"]').val()
        var gudang_id = $('select[name="gudang_id"]').val() && '&gudang_id=' + $('select[name="gudang_id"]').val()
        var date_begin = $('input[name="date_begin"]').val() && '&date_begin=' + $('input[name="date_begin').val()
        var date_end = $('input[name="date_end"]').val()  && '&date_end=' + $('input[name="date_end"]').val()
        var url = `purchasing-request/list?keyword=true&limit=${limit}${kode}${cabang_id}${gudang_id}${date_begin}${date_end}`
        console.log(gudang_id);
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

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        var formdata = new FormData()
        formdata.append('data', JSON.stringify(data))
        // formdata.append('lampiran', $('input#lampiran')[0].files[0])
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'purchasing-request',
            method: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.success){
                    swal('Okey', result.message, 'success')
                    initDefault()
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log(err)
                swal('Opps', err.responseJSON?.error.message || 'error 500', 'error')
            }
        })
    })

    $('body').on('click', 'button.bt-approve', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'purchasing-request/'+id+'/approve',
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
                body.find('div#div-filter-limit').toggleClass('hidden')
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
            }
        })
    })

    $('body').on('submit', 'form#form-approved', function(e){
        e.preventDefault()
        var data = getDataForm()
        var formdata = new FormData()
        formdata.append('data', JSON.stringify(data))
        var id = $(this).data('id')

        console.log(data);
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'purchasing-request/'+id+'/approve',
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
                swal('Opps', err.responseJSON?.error.message || 'error 500', 'error')
            }
        })
    })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'purchasing-request/'+id+'/show',
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
                body.find('div#div-filter-limit').toggleClass('hidden')
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
            }
        })
    })

    // $('body').on('click', 'button.bt-approve', function(e){
    //     e.preventDefault()
    //     var id = $(this).data('id')
    //     $.ajax({
    //         async: true,
    //         url: 'purchasing-request/'+id+'/approve',
    //         method: 'GET',
    //         dataType: 'html',
    //         processData: false,
    //         mimeType: "multipart/form-data",
    //         contentType: false,
    //         success: function(result){
    //             body.find('div#content-form').html(result)
    //             body.find('div#content-list').html('')
    //         },
    //         error: function(err){
    //             console.log(err)
    //             body.find('div#content-form').css('display', 'none')
    //         },
    //         complete: function() {
    //             setUrut()
    //             body.find('button#bt-create-form').css('display', 'none')
    //             body.find('button.bt-back').css('display', 'inline')
    //             body.find('div#content-list').css('display', 'none')
    //             body.find('div#content-form').css('display', 'inline')
    //         }
    //     })
    // })

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
                  url: 'bisnis/'+id+'/destroy',
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

    

    // $('body').on('submit', 'form#form-update-approved', function(e){
    //     e.preventDefault()
    //     var data = getDataForm()
    //     var formdata = new FormData()
    //     formdata.append('items', JSON.stringify(data))
    //     formdata.append('action', 'approved')
    //     var id = $(this).data('id')

    //     console.log(data);
    //     $.ajax({
    //         async: true,
    //         headers: {'x-csrf-token': $('[name=_csrf]').val()},
    //         url: 'purchasing-request/'+id+'/approve',
    //         method: 'POST',
    //         data: formdata,
    //         dataType: 'json',
    //         processData: false,
    //         mimeType: "multipart/form-data",
    //         contentType: false,
    //         success: function(result){
    //             if(result.success){
    //                 swal("Okey,,,!", result.message, "success")
    //                 initDefault()
    //             }else{
    //                 swal("Opps,,,!", result.message, "warning")
    //             }
    //         },
    //         error: function(err){
    //             console.log(err);
    //             swal("Opps,,,!", 'Server Error', "error")
    //         }
    //     })
    // })
    
    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var data = getDataForm()
        var formdata = new FormData()
        formdata.append('items', JSON.stringify(data))
        formdata.append('lampiran', $('input#lampiran')[0].files[0])
        var id = $(this).data('id')

        console.log(data);
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'purchasing-request/'+id+'/update',
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
            url: 'purchasing-request/list',
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
            url: 'purchasing-request/create',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#div-filter-limit').toggleClass('hidden')
                body.find('div#content-form').html(result)
                body.find('div#content-list').html('')
                addItems(1)
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
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
                url: 'purchasing-request/create/add-item',
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

    function removeItems(id){
        body.find('tr[data-urut="'+id+'"]').remove()
        setUrut()
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

    function getDataForm(){
        let keys = []
        let values = []
        $('select.item-data, input.item-data').each(function(){
            var property = $(this).attr('name')
            var val = $(this).val()
            keys.push(property)
            values.push(val)
        })
        
        // itemData()

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