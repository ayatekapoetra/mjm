$(function(){
    console.log('ajax/opt-faktur-beli');

    var body = $('body')

    $('select.selectFakturJual').select2()

    $('select.selectFakturJual').each(function(i){
        console.log(i);
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        var workdir = body.find('input#workdir').val()
        var uri = elm.val() ? '/ajax/options/faktur-jual?bisnis_id='+workdir : '/ajax/options/faktur-jual?bisnis_id='+workdir+'&selected='+values
        console.log('values ', $(this).data('values') || elm.val());
        console.log('values ', uri);
        $.ajax({
            async: true,
            url: uri,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( el => '<option value="'+el.id+'">'+el.pelanggan.kode+' -> '+el.no_faktur+' Rp.'+el.sisa+'</option>'))
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

    $('select.xselectFakturJual').each(function(){
        var elm = $(this)
        console.log(elm);
        var values = $(this).data('values')
        var workdir = body.find('input#workdir').val()
        // var uri = elm.val() ? '/ajax/options/faktur-jual?bisnis_id='+workdir : '/ajax/options/faktur-jual?bisnis_id='+workdir+'&selected='+values
        $.ajax({
            async: true,
            url: '/ajax/options/faktur-jual?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    elm.html(result.map( el => '<option value="'+el.id+'" '+el.selected+'>'+el.pelanggan.kode+' -> '+el.no_faktur+'--> Rp.'+el.sisa+'</option>'))
                    
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

