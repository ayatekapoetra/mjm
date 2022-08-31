$(function(){
    console.log('ajax/opt-coa-nasting-list');

    // $('select.selectCoaDebit').select2()

    $('select[name="coa_debit"]').each(function(){
        var elm = $(this)
        var values = $(this).data('values') || elm.val()
        console.log('values :::', elm);
        $.ajax({
            async: true,
            url: '/ajax/options/coa-nasting-list',
            method: 'GET',
            data: { selected: values },
            dataType: 'html',
            success: function(result){
                elm.html(result)
                elm.find('option[value!="'+values+'"]').attr('disabled')
                // let arr = []
                // for (const obj of result) {
                //     arr.push(obj)
                // }
                // elm.html(arr.map( val => '<option value="'+val.id+'" '+val.selected+'>'+val.coa_name+'</option>'))
                // elm.html(result)
                // if(result.length > 0){
                //     var htm = result.map(grp => {
                //         return '<optgroup label="'+grp.tipe+'" style="color:white">'+
                //             grp.items.map(itm => '<option value="'+itm.id+'" selected="'+itm.selected+'">'+itm.coa_name+'</option>') +
                //         '</optgroup>'
                //     })
                //     elm.html(htm)
                    // elm.val(values).trigger('change')
                // }else{
                //     elm.html('<option value="" selected>Blum ada data...</option>')
                // }
            },
            error: function(err){
                console.log(err)
            },
            complete: function(){
                // elm.val(values).trigger('change')
                // elm.val('11005').change()
                // console.log('values :::', elm);
            }
        })
    })
})

