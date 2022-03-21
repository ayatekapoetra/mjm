$(function(){
    console.log('ajax/opt-barang-brand');


    $('select[name="brand"]').select2()

    $('select.selectBarangBrand').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        console.log(elm.val());
        $.ajax({
            async: true,
            url: '/ajax/options/barang-brand?selected='+values,
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
})

