$(function(){
    console.log('ajax/opt-coaKas');

    var body = $('body')

    $('select.selectCoaAsset').select2()

    $('select.selectCoaAsset').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        var workdir = body.find('input#workdir').val()
        $.ajax({
            async: true,
            // url: '/ajax/coa/by-aset?bisnis_id='+workdir+'&selected='+values,
            url: '/ajax/coa/kas-bank?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" kode="'+v.kode+'" '+v.selected+'>'+v.coa_name+'</option>'))
                    initSelected(result, elm)
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

    function setSelected(list, value){
        let data = list.map(elm => elm.id === value ? {...elm, selected: 'selected'} : {...elm, selected: ''})
        return data
    }
    
    function initSelected(data, elm){
        var lenSelected = data.filter( a => a.selected === 'selected')
        if(!lenSelected.length > 0){
            elm.prepend('<option value="" selected>Pilih</option>')
        }
    }
})

