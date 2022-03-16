$(function(){
    console.log('ajax/opt-options');

    var body = $('body')

    $('select.selectOptions').select2()

    $('select.selectOptions').each(function(){
        var elm = $(this)
        var group = $(this).data('group')
        var values = $(this).data('values')
        $.ajax({
            async: true,
            url: '/ajax/options?group='+group+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.nilai+'" '+v.selected+'>'+v.teks+'</option>'))
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

