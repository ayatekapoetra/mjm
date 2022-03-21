$(function(){
    'use strict'

    console.log('ajax/index.js');

    var body = $('body')

    $('body td.long-text').each(function(){
        var elm = $(this)
        var text = elm.data('text')
        var tag = elm.data('elm')
        if(text.length > 100)
        elm.find(tag).html(text.slice(0, 100) + '<br/><a class="more-text text-info">show more...</a>')
        else
        elm.find(tag).html(text)
    })

    $('body').on('click', 'a.more-text', function(){
        var elm = $(this)
        var text = elm.parents('td').data('text')
        var tag = elm.parents('td').data('elm')
        if(text){
            var len = Math.ceil(text.length / 100)
            for (let i = 0; i < len; i++) {
                let end = parseInt(i + 100)
                elm.parents('td').find(tag).html((text.slice(i, end) + 
                '<br/>' + 
                text.slice(i+100, end+100) + '<br/><a class="less-text text-primary">show less...</a>'))
            }
        }
    })

    $('body').on('click', 'a.less-text', function(){
        var elm = $(this)
        var text = elm.parents('td').data('text')
        var tag = elm.parents('td').data('elm')
        if(text)
        elm.parents('td').find(tag).html((text.slice(0, 100) + '<br/><a class="more-text text-info">show more...</a>'))
    })

    /** LIST NAMA COA **/
    $('body select.listCoaName').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        var workdir = body.find('input#workdir').val()
        $.ajax({
            async: true,
            url: '/ajax/coa?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.coa_name+'</option>'))
                    initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    /** LIST NAMA BANK **/
    $('body select.selectBank').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        var workdir = body.find('input#workdir').val()
        $.ajax({
            async: true,
            url: '/ajax/bank?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.coa_name+'</option>'))
                    initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    /** LIST NAMA KAS **/
    $('body select.selectKas').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        var workdir = body.find('input#workdir').val()
        console.log(values, workdir);
        $.ajax({
            async: true,
            url: '/ajax/kas?bisnis_id='+workdir+'&selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.coa_name+'</option>'))
                    initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    /** LIST NAMA CABANG **/
    $('body select.selectCabang').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        // console.log(values, workdir);
        $.ajax({
            async: true,
            url: '/ajax/options/cabang?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.nama+'</option>'))
                    initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    /** LIST NAMA GUDANG **/
    $('body select.selectGudang').each(function(){
        var elm = $(this)
        var values = $(this).data('values')
        // console.log(values, workdir);
        $.ajax({
            async: true,
            url: '/ajax/options/gudang?selected='+values,
            method: 'GET',
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                // console.log(result);
                if(result.length > 0){
                    setSelected(result, values)
                    elm.html(result.map( v => '<option value="'+v.id+'" '+v.selected+'>'+v.nama+'</option>'))
                    initSelected(result, elm)
                }else{
                    elm.html('<option value="" selected>Blum ada data...</option>')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
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