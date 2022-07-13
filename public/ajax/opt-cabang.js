$(function(){
    console.log('ajax/opt-bisnis');

    var body = $('body')

    $('select.selectCabang').select2()

    $('body select[name="cabang_id"]').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/options/cabang?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                elm.trigger('change');
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('select[name="cabang_id"]').on('change', function(){
        var values = $(this).val()
        var selected = body.find('select[name="gudang_id"]').data('values')
        if (values) {
            $.ajax({
                async: true,
                url: '/ajax/options/gudang?selected='+selected+'&cabang_id='+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    console.log(result);
                    body.find('.div-gudang').css('display','inline')
                    if(result.length > 0){
                        body.find('select[name="gudang_id"]').html(result.map( v => '<option cabang="'+v.cabang_id+'" value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                        body.find('select[name="gudang_id"]').trigger('change');
                    }else{
                        body.find('select[name="gudang_id"]').html('<option value="" selected>Blum ada data...</option>')
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
        }else{
            body.find('.div-gudang').css('display','none')
        }
    })

    $('body select[name="workspace"]').each(function(){
        var elm = $(this)
        var user = $(this).data('user')
        var values = $(this).data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/options/workspace?user_id='+user+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                elm.trigger('change');
                // if(result.length > 0){
                // }else{
                //     elm.html('<option value="" selected>Blum ada data...</option>')
                // }
            },
            error: function(err){
                console.log(err)
            }
        })
    })
})

