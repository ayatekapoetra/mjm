$(function(){
    console.log('ajax/opt-gudang');

    var body = $('body')

    $('select.selectGudang').select2()

    $('body select[name="gudang_id"]').each(function(){
        var elm = $(this)
        var link = $(this).data('link')
        var relation = body.find('#'+link).data('values') || ''
        var values = $(this).data('values') || elm.val()
        var cabang = $(this).data('cabang') && '&cabang_id='+$(this).data('cabang')
        console.log('values ::', values);
        $.ajax({
            async: true,
            url: '/ajax/options/gudang?selected='+values + cabang +'&'+link+'='+relation,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.length > 0){
                    elm.html(result.map( v => '<option cabang="'+v.cabang_id+'" value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                    elm.trigger('change');
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('select[name="gudang_id"]').on('change', function(){
        var values = $(this).val()
        var selected = body.find('select[name="rack_id"]').data('values')
        if (values) {
            $.ajax({
                async: true,
                url: '/ajax/options/rack?selected='+selected+'&gudang_id='+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    console.log(result);
                    body.find('.div-rack').css('display','inline')
                    if(result.length > 0){
                        body.find('select[name="rack_id"]').html(result.map( v => '<option gudang="'+v.gudang_id+'" value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                        body.find('select[name="rack_id"]').trigger('change');
                    }else{
                        body.find('select[name="rack_id"]').html('<option value="" selected>Blum ada data...</option>')
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
        }else{
            body.find('.div-rack').css('display','none')
        }
    })
})

