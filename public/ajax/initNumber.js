$(function(){
    'use strict'

    console.log('ajax/initNumber.js');

    var body = $('body')

    /** ON ELEMENT TABLE **/
    $('.formatRp').each(function(){
        var elm = $(this).data('elm')
        var data = $(this).data('number')
        // console.log('INIT NUMBER ::', data.toLocaleString('id-ID'));
        if(data){
            if(elm){
                $(this).find(elm).html('Rp. ' + data.toLocaleString('id-ID'))
            }else{
                $(this).html('Rp. ' + data.toLocaleString('id-ID'))
            }
        }else{
            if(elm){
                $(this).find(elm).html('')
            }else{
                $(this).html('Rp. -')
            }
        }
    })

    $('.formatIDR').each(function(){
        var elm = $(this).data('elm')
        var data = $(this).data('number')
        if(data){
            if(elm){
                $(this).find(elm).html('IDR ' + data.toLocaleString('id-ID'))
            }else{
                $(this).html('IDR ' + data.toLocaleString('id-ID'))
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