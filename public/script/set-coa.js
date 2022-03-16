$(function(){
    var body = $('body')

    body.on('click', 'button.bt-create-group', function(){
        $.ajax({
            async: true,
            url: '/setting/coa/create-group',
            method: 'GET',
            data: {
                id: $(this).data('id'),
                kode: $(this).data('kode'),
                is_akun: 'G'
            },
            dataType: 'html',
            contentType: false,
            success: function(result){
                $('div.init-form').html(result)
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('div#modal-add-group').modal('show')
            }
        })
    })


    body.on('click', 'button.bt-create-akun', function(){

        $.ajax({
            async: true,
            url: '/setting/coa/create-akun',
            method: 'GET',
            data: {
                id: $(this).data('id'),
                reff: $(this).data('reff'),
                kode: $(this).data('kode'),
                is_akun: 'A'
            },
            dataType: 'html',
            contentType: false,
            success: function(result){
                $('div.init-form').html(result)
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('div#modal-add-group').modal('show')
            }
        })
    })


    body.on('click', 'i.bt-upd-akun', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var tipe = $(this).data('tipe')
        var uri = tipe === 'A' ? '/setting/coa/'+id+'/show-akun' : '/setting/coa/'+id+'/show-group'
        $.ajax({
            async: true,
            url: uri,
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                $('div.init-form').html(result)
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('div#modal-upd-coa').modal('show')
            }
        })
    })
    
    body.on('submit', 'form#form-create-group', function(e){
        e.preventDefault()
        var data = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: '/setting/coa-group',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            beforeSend: function(){
                $('#modal-add-group').modal('hide')
            },
            success: function(result){
                console.log(result)
                const { message } = result
                if(result.success){
                    swal("Okey,,,!", message, "success")
                }else{
                    swal("Opps,,,!", message, "warning")
                }
            },
            error: function(err){
                console.log(err)
                // const { message } = err.responseJSON
                swal("Opps,,,!", message, "warning")
            },
            complete: function() {
                window.location.reload()
            }
        })
    })

    body.on('submit', 'form#form-create-akun', function(e){
        e.preventDefault()
        var data = new FormData(this)
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: '/setting/coa-akun',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            beforeSend: function(){
                $('#modal-add-group').modal('hide')
            },
            success: function(result){
                console.log(result)
                const { message } = result
                if(result.success){
                    swal("Okey,,,!", message, "success")
                }else{
                    swal("Opps,,,!", message, "warning")
                }
            },
            error: function(err){
                console.log(err)
                // const { message } = err.responseJSON
                swal("Opps,,,!", message, "warning")
            },
            complete: function() {
                window.location.reload()
            }
        })
    })


    body.on('submit', 'form#form-update-akun', function(e){
        e.preventDefault()
        var data = new FormData(this)
        var id = $(this).data('id')
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: '/setting/coa/'+id+'/update-akun',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            beforeSend: function(){
                $('#modal-add-group').modal('hide')
            },
            success: function(result){
                console.log(result)
                const { message } = result
                if(result.success){
                    swal("Okey,,,!", message, "success")
                    window.location.reload()
                }else{
                    swal("Opps,,,!", message, "warning")
                }
            },
            error: function(err){
                console.log(err)
                const { message } = err.responseJSON
                swal("Opps,,,!", message ? message : 'something wrong...', "warning")
            },
            complete: function() {
                // window.location.reload()
            }
        })
    })

    body.on('submit', 'form#form-update-group', function(e){
        e.preventDefault()
        var data = new FormData(this)
        var id = $(this).data('id')
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: '/setting/coa/'+id+'/update-group',
            method: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            beforeSend: function(){
                $('#modal-add-group').modal('hide')
            },
            success: function(result){
                console.log(result)
                const { message } = result
                if(result.success){
                    swal("Okey,,,!", message, "success")
                }else{
                    swal("Opps,,,!", message, "warning")
                }
            },
            error: function(err){
                console.log(err)
                const { message } = err.responseJSON
                swal("Opps,,,!", message ? message : 'something wrong...', "warning")
            },
            complete: function() {
                // window.location.reload()
            }
        })
    })

    body.on('click', 'button.bt-delete-akun', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        var tipe = $(this).data('tipe')
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm) {
            if (isConfirm) {
                $.ajax({
                    async: true,
                    headers: {'x-csrf-token': $('[name=_csrf]').val()},
                    url: '/setting/coa/'+id+'/destroy?tipe='+tipe,
                    method: 'DELETE',
                    dataType: 'json',
                    contentType: false,
                    success: function(result){
                        const { message } = result
                        if(result.success){
                            swal("Okey,,,!", message, "success")
                        }else{
                            swal("Opps,,,!", message, "warning")
                        }
                    },
                    error: function(err){
                        console.log(err)
                    },
                    complete: function() {
                        window.location.reload()
                    }
                })
            } else {
              swal("Cancelled", "Your imaginary file is safe :)", "error")
              body.find('div#modal-upd-coa').modal('hide')
            }
          });
    })


})