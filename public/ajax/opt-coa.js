$(function(){
    console.log('ajax/opt-coa');

    var body = $('body')

    $('select.selectCoa').select2()

    $('select.selectCoa').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        var workdir = body.find('input#workdir').val()
        // console.log('values :::', values);
        $.ajax({
            async: true,
            url: '/ajax/options/coa?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.length > 0){
                    var data = setSelected(result, values)
                    elm.html(data.map( v => '<option value="'+v.id+'" kode="'+v.kode+'" '+v.selected+'>'+v.coa_name+'</option>'))
                    initSelected(result, elm)
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

