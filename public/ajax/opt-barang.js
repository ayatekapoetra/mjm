$(function(){
    console.log('ajax/opt-barang');

    var body = $('body')

    $('select.selectBarang').select2()

    $('select.selectBarang').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        $.ajax({
            async: true,
            url: '/ajax/options/barang?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>[ ' +v.num_part+ ' ] '+v.nama+'</option>'))
                    elm.trigger('change');
                    // setSelected(result, values)
                    // initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('select[name="barang_id"]').each(function(){
        var elm = $(this)
        elm.on('change', function(){
            if(elm.val()){
                var id = $(this).val()
                $.ajax({
                    async: true,
                    url: '/ajax/options/barang/show/'+id,
                    method: 'GET',
                    dataType: 'json',
                    processData: false,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    success: function(result){
                        // console.log(result);
                        elm.parents('tr').attr('data-barang', JSON.stringify(result))
                        elm.parents('tr').find('input[name="kode"]').val(result.kode)
                        elm.parents('tr').find('input[name="nama"]').val(result.nama)
                        elm.parents('tr').find('input[name="satuan"]').val(result.satuan)
                        elm.parents('tr').find('input[name="hargaJual"]').val(result.hargaJual?.harga_jual || 0.00)
                        elm.parents('tr').find('input[name="subkategori"]').val(result.subkategori?.nama)
                        elm.parents('tr').find('input[name="qualitas"]').val(result.qualitas?.nama)
                        elm.parents('tr').find('button.bt-add-barang').removeAttr('disabled')
                        sumHargaJual(elm)
                    },
                    error: function(err){
                        console.log(err)
                    }
                })
            }else{
                elm.parents('tr').attr('data-barang', '')
                elm.parents('tr').find('input[name="kode"]').val('')
                elm.parents('tr').find('input[name="satuan"]').val('')
                elm.parents('tr').find('input[name="hargaJual"]').val(0.00)
                elm.parents('tr').find('input[name="subkategori"]').val('')
                elm.parents('tr').find('input[name="qualitas"]').val('')
                elm.parents('tr').find('button.bt-add-barang').attr('disabled', 'disabled')
                sumHargaJual(elm)
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

    function sumHargaJual(elm){
        var qty = elm.parents('td').find('input[name="qty"]').val()
        var hargaJual = elm.parents('td').find('input[name="hargaJual"]').val()
        var totJual = parseFloat(qty) * parseFloat(hargaJual)
        elm.parents('td').find('input[name="totalJual"]').val(totJual)
    }
})

