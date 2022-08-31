$(function(){
    console.log('ajax/opt-coa');

    $('select.selectCoaKasBank').select2()

    $('select.selectCoaKasBank').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/coa/kas-bank',
            method: 'GET',
            data: {
                selected: values,
            },
            dataType: 'json',
            success: function(result){
                if(result.length > 0){
                    elm.html(result.map( v => '<optgroup label="'+v.name+'">'+v.items.map( i => '<option value="'+i.id+'" kode="'+i.kode+'" '+i.selected+'>'+i.coa_name+'</option>')+'</optgroup>'))
                    elm.val(values).trigger('change');
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

