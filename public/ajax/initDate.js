$(function(){
    'use strict'

    console.log('ajax/initDate.js');

    var body = $('body')

    $('input[type="date"].initDate').each(function(){
        $(this).val(moment().format('YYYY-MM-DD'))
    })

    $('input[type="date"].setDate').each(function(){
        var tgl = $(this).data('tgl')
        $(this).val(moment(tgl).format('YYYY-MM-DD'))
    })

    $('input[type="datetime-local"].initDateTime').each(function(){
        var now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        $(this).val(now.toISOString().slice(0,16))
    })

    $('input[type="datetime-local"].setDateTime').each(function(){
        var data = $(this).data('tgl')
        var now = new Date(data)
        // console.log('DATA ::', data != 'undefined' || data != 'null');
        console.log('now ::', now);
        if(data != 'undefined' || data){
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
            $(this).val(now.toISOString().slice(0,16))
        }else{
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
            $(this).val(now.toISOString().slice(0,16))
        }
    })

    /** ON ELEMENT TABLE **/
    $('.dateFormatDef').each(function(){
        var elm = $(this).data('elm')
        var format = $(this).data('patten') || 'DD-MM-YYYY'
        var data = $(this).data('tgl')
        if(data){
            if(elm){
                $(this).find(elm).html(moment(data).format(format))
            }else{
                $(this).html(moment(data).format(format))
            }
        }else{
            if(elm){
                $(this).find(elm).html('-')
            }else{
                $(this).html('-')
            }
        }
    })

    $('.diffDate').each(function(){
        var elm = $(this).data('elm')
        var format = $(this).data('patten')
        var dataAwal = $(this).data('awal')
        var dataAkhir = $(this).data('akhir')
        var a = moment(dataAwal)
        var b = moment(dataAkhir)
        var diff = a.diff(b, format)
        if(dataAwal && dataAkhir){
            if(elm){
                $(this).find(elm).html(diff + ' ' + format)
            }else{
                $(this).html(diff + ' ' + format)
            }
        }else{
            if(elm){
                $(this).find(elm).html('-')
            }else{
                $(this).html('-')
            }
        }
    })
})