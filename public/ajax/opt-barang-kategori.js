$(function(){
    console.log('ajax/opt-barang-kategori');

    var body = $('body')

    $('select[name="kategori"]').select2()

    $('select.selectBarangKategori').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        console.log(elm.val());
        $.ajax({
            async: true,
            url: '/ajax/options/barang-kategori?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.length > 0){
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.nama+'</option>'))
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

    $('select[name="kategori_id"]').on('change', function(){
        var values = $(this).val()
        var selected = body.find('select[name="subkategori_id"]').data('values')
        if (values) {
            $.ajax({
                async: true,
                url: '/ajax/options/barang-subkategori?selected='+selected+'&kategori_id='+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    console.log(result);
                    body.find('.div-subkategori').css('display','inline')
                    if(result.length > 0){
                        body.find('select[name="subkategori_id"]').html(result.map( v => '<option gudang="'+v.gudang_id+'" value="'+v.id+'" '+v.selected+'>['+v.kode+']  '+v.nama+'</option>'))
                        body.find('select[name="subkategori_id"]').trigger('change');
                    }else{
                        body.find('select[name="subkategori_id"]').html('<option value="" selected>Blum ada data...</option>')
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
        }else{
            body.find('.div-subkategori').css('display','none')
        }
    })
})

