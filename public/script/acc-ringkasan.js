$(function(){
    console.log('script/acc-ringkasan');
    var body = $('body')

    

    initDefault()

    $('body').on('click', 'button.bt-back', function(){
        body.find('div#content-list').css('display', 'block')
        body.find('button#open-filter').css('display', 'inline')
        body.find('div#content-details').css('display', 'none').html('')
    })
    
    $('body').on('click', 'button#apply-filter', function(){
        var rangeAwal = body.find('input[name="rangeAwal"]').val()
        var rangeAkhir = body.find('input[name="rangeAkhir"]').val()
        var workdir = body.find('select#cabang_id').val()
        var filter = {
            cabang_id: workdir,
            rangeAwal: rangeAwal,
            rangeAkhir: rangeAkhir
        }
        localStorage.setItem("@filter", JSON.stringify(filter))
        initDefault()
    })

    // $('body').on('change', 'select[name="cabang_id"]', function(){
    //     var workdir = $(this).val()
    //     var rangeAwal = body.find('input[name="rangeAwal"]').val()
    //     var rangeAkhir = body.find('input[name="rangeAkhir"]').val()
    //     console.log(workdir);
    //     if(workdir){
    //         // getValuesAkun(workdir, rangeAwal, rangeAkhir)
    //         getPnL(workdir, rangeAwal, rangeAkhir)
    //     }else{
    //         // getValuesAkun(null, rangeAwal, rangeAkhir)
    //         getPnL(null, rangeAwal, rangeAkhir)
    //     }
    // })

    $('body').on('click', 'input[name="hideZero"]', function(){
        var elm = $(this)
        if(elm.is(":checked")){
            elm.val('Y').prop('checked', true)
            $('label#txthideZero').removeClass('text-inverse').addClass('text-danger')
            hideZeroValues()
        }else{
            elm.val('N').removeAttr('checked')
            $('label#txthideZero').removeClass('text-danger').addClass('text-inverse')
            hideZeroValues()
        }

        function hideZeroValues(){
            $('body').find('ul.feeds > li.item-coa').each(function(){
                console.log($(this));
                let values = $(this).find('span.count-values').html()
                values = parseFloat(values.replace('Rp. ', ''))
                if(values === 0){
                    $(this).toggleClass('hidden')
                }
            })
        }
    })

    function initDefault(){
        var cabang_id = $('body').find('select[name="cabang_id"]').val()
        var rangeAwal = $('body').find('input[name="rangeAwal"]').val()
        var rangeAkhir = $('body').find('input[name="rangeAkhir"]').val()
        

        let localFilter = localStorage.getItem("@filter")

        if(localFilter){
            var qstring = JSON.parse(localFilter)
        }else{
            var qstring = {
                cabang_id: cabang_id,
                rangeAwal: rangeAwal,
                rangeAkhir: rangeAkhir
            }
        }

        $.ajax({
            async: true,
            url: 'ringkasan/list',
            method: 'GET',
            data: qstring,
            dataType: 'html',
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-details').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
            }
        })
    }

    // function getPnL(rangeAwal, rangeAkhir){
    //     var workdir = body.find('select#cabang_id').val()
    //     var elm = body.find('div#PnL')
    //     $.ajax({
    //         async: true,
    //         url: 'ringkasan/profit-loss',
    //         method: 'GET',
    //         data: {
    //             cabang_id: workdir != '' ? workdir : null,
    //             rangeAwal: rangeAwal || moment().startOf('year').format('YYYY-MM-DD'),
    //             rangeAkhir: rangeAkhir || moment().format('YYYY-MM-DD')
    //         },
    //         dataType: 'json',
    //         contentType: false,
    //         beforesend: function(){
    //             elm.html(
    //                 '<div class="panel-heading bg-inverse" style="color: #FFF">'+
    //                 'Waiting response...<span class="pull-right"><i class="fa fa-spin fa-spinner"></i></span>'+
    //                 '</div>'
    //             )
    //         },
    //         success: function(result){
    //             if(result.profit){
    //                 elm.html(
    //                     '<div class="panel-heading bg-inverse" style="color: #FFF">'+
    //                     'LABA BERSIH <span class="pull-right">Rp. '+(result.total).toLocaleString('id-ID')+'</span>'+
    //                     '</div>'
    //                 )
    //             }else{
    //                 elm.html(
    //                     '<div class="panel-heading bg-inverse" style="color: #FFF">'+
    //                     'RUGI BERSIH <span class="pull-right">Rp. '+(result.total).toLocaleString('id-ID')+'</span>'+
    //                     '</div>'
    //                 )
    //             }
    //         },
    //         error: function(err){
    //             console.log(err)
    //         }
    //     })
    // }
})