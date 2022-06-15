$(function(){
    console.log('ajax/opt-coa-group');

    var body = $('body')
    
    optionCoaGroup()
    
    $('select.selectCoaGroup').select2()
    
    $('select[name="coa_tipe"]').on('change', function(){
        var kategori = $(this).val()
        optionCoaGroup(kategori)
        console.log('KATEGORI :::', kategori);
    })

    $('body').on('change', 'select[name="coa_group"], select[name="coa_grp"]', function(){
        var elm = $(this)
        var values = elm.val()
        var selected = elm.data('values')
        var elmTarget = elm.parents('div.row').find('select[name="coa_subgrp"]')
        console.log(elmTarget);
        optionCoaSubGroup(values, selected, elmTarget)
    })

    function optionCoaSubGroup(values, selected, elm){
        $.ajax({
            async: true,
            url: '/ajax/options/coa-subgroup?coa_group='+values+'&selected='+selected,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.subgrp_name+'</option>'))
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
    }


    function optionCoaGroup(kategori){
        $('select.selectCoaGroup').each(function(){
            var elm = $(this)
            var values = $(this).data('values') || elm.val()
            var workdir = body.find('input#workdir').val()
            $.ajax({
                async: true,
                url: '/ajax/options/coa-group?coa_tipe='+kategori+'&selected='+values,
                method: 'GET',
                dataType: 'json',
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                success: function(result){
                    console.log(result);
                    if(result.length > 0){
                        setSelected(result, values)
                        elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.grp_name+'</option>'))
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
    }


    function setSelected(list, value){
        let data = list.map(elm => elm.id === parseInt(value) ? {...elm, selected: 'selected'} : {...elm, selected: ''})
        return data
    }
    
    function initSelected(data, elm){
        var lenSelected = data.filter( a => a.selected === 'selected')
        if(!lenSelected.length > 0){
            elm.prepend('<option value="" selected>Pilih</option>')
        }
    }
})

