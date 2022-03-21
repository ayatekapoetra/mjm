$(function(){
    console.log('ajax/opt-pelanggan');

    var body = $('body')

    $('select.selectPelanggan').select2()

    $('select.selectPelanggan').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        var workdir = body.find('input#workdir').val()
        $.ajax({
            async: true,
            url: '/ajax/options/pelanggan?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>' +v.kode+ ' | '+v.nama+'</option>'))
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
