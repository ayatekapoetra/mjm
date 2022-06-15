$(function(){
    console.log('ajax/opt-jasa');

    var body = $('body')

    $('select.selectJasa').select2()

    $('select.selectJasa').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/options/jasa?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>[ ' +v.kode+ ' ] '+v.nama+'</option>'))
                    // setSelected(result, values)
                    // initSelected(result, elm)
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

    $('select[name="jasa_id"]').each(function(){
        var elm = $(this)
        elm.on('change', function(){
            if(elm.val()){
                var id = $(this).val()
                $.ajax({
                    async: true,
                    url: '/ajax/options/jasa/show/'+id,
                    method: 'GET',
                    dataType: 'json',
                    processData: false,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    success: function(result){
                        console.log(result);
                        elm.parents('tr').find('input[name="kode"]').val(result.kode)
                        elm.parents('tr').find('input[name="nama"]').val(result.nama)
                        elm.parents('tr').find('input[name="biaya"]').val(result.biaya || 0.00)
                        elm.parents('tr').find('button.bt-add-jasa').removeAttr('disabled')
                        sumBiayaJasa(elm)
                    },
                    error: function(err){
                        console.log(err)
                    }
                })
            }else{
                elm.parents('tr').find('input[name="kode"]').val('')
                elm.parents('tr').find('input[name="biaya"]').val('0.00')
                elm.parents('tr').find('button.bt-add-jasa').attr('disabled', 'disabled')
                sumBiayaJasa(elm)
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

    function sumBiayaJasa(elm){
        var qty = elm.parents('td').find('input[name="qty"]').val()
        var biayaJasa = elm.parents('td').find('input[name="biaya"]').val()
        var totBiaya = parseFloat(qty) * parseFloat(biayaJasa)
        elm.parents('td').find('input[name="totalBiaya"]').val(totBiaya)
    }
})

