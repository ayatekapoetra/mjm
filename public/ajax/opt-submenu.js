$(function(){
    console.log('ajax/opt-bisnis');

    var body = $('body')

    $('select.selectSubmenu').select2()

    $('body select.selectSubmenu').each(function(){
        var elm = $(this)
        // var menu = body.find('select[name="menu_id"]').val() || null
        var values = $(this).data('values') || elm.val()
        console.log(values);
        $.ajax({
            async: true,
            url: '/ajax/options/submenu?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(
                        result.map( v => '<option value="'+v.id+'" menuid="'+v.menu_id+'" '+v.selected+'>'+v.menu.name+' -> '+v.name+'</option>')
                        )
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

