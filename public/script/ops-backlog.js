$(function(){
    var body = $('body')

    initDefault()

    $('body').on('click', 'button#bt-create-form', function(){
        initCreate()
    })

    $('body').on('click', 'button.bt-back, button#bt-back', function(){
        initDefault()
    })

    $('body').on('blur', 'input[name="limit"]', function(){
        var limit = $(this).val()
        initDefault(limit, null)
    })

    $('body').on('click', 'div#bt-add-rows', function(){
        var tambahRows = body.find('input#row-number').val() || 1
        addItems(tambahRows)
    })

    $('body').on('click', 'button.bt-remove-item', function(){
        $(this).parents('tr.item-rows').remove()
        setUrut()
    })

    $('body').on('keyup', 'input[name="smu_begin"]', function(){
        var hm_awal = $(this).val() || 0
        var hm_akhir = body.find('input[name="smu_end"]').val() || 0
        var used = body.find('input[name="smu_used"]')
        var total = (parseFloat(hm_akhir) - parseFloat(hm_awal)).toFixed(2)
        used.val(total)
    })

    $('body').on('keyup', 'input[name="smu_end"]', function(){
        var hm_akhir = $(this).val() || 0
        var hm_awal = body.find('input[name="smu_begin"]').val() || 0
        var used = body.find('input[name="smu_used"]')
        var total = (parseFloat(hm_akhir) - parseFloat(hm_awal)).toFixed(2)
        used.val(total)
    })

    $('body').on('keyup', 'input[type="number"]', function(){
        var rest_meal = body.find('input[name="rest_meal"]').val() || 0
        var wet = body.find('input[name="wet"]').val() || 0
        var public = body.find('input[name="public"]').val()
        var fuel = body.find('input[name="fuel"]').val()
        var no_job = body.find('input[name="no_job"]').val()
        var no_driver = body.find('input[name="no_driver"]').val()
        var break_down = body.find('input[name="break_down"]').val()
        var no_opr = body.find('input[name="no_opr"]').val()
        var tot_delay = body.find('input[name="tot_delay"]')

        var total = parseFloat(rest_meal) + parseFloat(wet) + parseFloat(public) + parseFloat(fuel) + parseFloat(no_job) + parseFloat(no_driver) + parseFloat(break_down) + parseFloat(no_opr)
        tot_delay.val(total.toFixed(2))
    })

    $('body').on('click', '#apply-filter', function(){
        var limit = $('input[name="limit"]').val()
        var priority = $('select[name="priority"]').val() && '&priority=' + $('select[name="priority"]').val()
        var status = $('select[name="status"]').val() && '&status=' + $('select[name="status').val()
        var equipment_id = $('select[name="equipment_id"]').val()  && '&equipment_id=' + $('select[name="equipment_id"]').val()
        var url = `backlog/list?keyword=true&limit=${limit || 100}${priority}${status}${equipment_id}`
        
        $.ajax({
            async: true,
            url: url,
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'inline')
            }
        })
    })

    $('body').on('click', '#reset-filter', function(){
        var limit = $('input[name="limit"]').val()
        initDefault(limit)
        $('div#filtermodal').find('input').val('')
        $('div#filtermodal').find('select').val(null).trigger('change')
    })

    $('body').on('submit', 'form#form-create', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'backlog',
            method: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                console.log(result);
                if(result.success){
                    swal('Okey', result.message, 'success')
                    initCreate()
                }else{
                    swal('Opps', result.message, 'warning')
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

    $('body').on('click', 'button.bt-show', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        $.ajax({
            async: true,
            url: 'backlog/'+id+'/show',
            method: 'GET',
            dataType: 'html',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                body.find('div#content-form').html(result)
                body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
                body.find('div#content-form').css('display', 'none')
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-list').css('display', 'none')
                body.find('div#content-form').css('display', 'inline')
                body.find('div#div-filter-limit').css('display', 'none')
            }
        })
    })

    $('body').on('click', 'button#bt-delete', function(e){
        e.preventDefault()
        var id = $(this).data('id')
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
          },
          function(){
              $.ajax({
                  async: true,
                  headers: {'x-csrf-token': $('[name=_csrf]').val()},
                  url: 'backlog/'+id+'/destroy',
                  method: 'DELETE',
                  dataType: 'json',
                  processData: false,
                  mimeType: "multipart/form-data",
                  contentType: false,
                  success: function(result){
                      if(result.success){
                          swal("Okey,,,!", result.message, "success")
                          initDefault()
                      }else{
                          swal("Opps,,,!", result.message, "warning")
                      }
                  },
                  error: function(err){
                      console.log(err);
                      swal("Opps,,,!", 'Server Error', "error")
                  }
              })
          });
    })

    $('body').on('submit', 'form#form-update', function(e){
        e.preventDefault()
        var data = getDataForm()
        console.log(data);
        var formdata = new FormData()
        formdata.append('dataForm', JSON.stringify(data))
        var id = $(this).data('id')
        $.ajax({
            async: true,
            headers: {'x-csrf-token': $('[name=_csrf]').val()},
            url: 'backlog/'+id+'/update',
            method: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            success: function(result){
                if(result.success){
                    swal("Okey,,,!", result.message, "success")
                    initDefault()
                }else{
                    swal("Opps,,,!", result.message, "warning")
                }
            },
            error: function(err){
                console.log(err);
                swal("Opps,,,!", 'Server Error', "error")
            }
        })
    })

    function addItems(len){
        for (let index = 0; index < len; index++) {
            $.ajax({
                async: true,
                url: 'backlog/create/add-item',
                method: 'GET',
                dataType: 'html',
                contentType: false,
                success: function(result){
                    body.find('tbody#item-details').append(result)
                    setUrut()
                },
                error: function(err){
                    console.log(err)
                }
            })
            
        }
    }

    function setUrut(){
        $('tr.item-rows').each(function(i, e){
            var urut = i + 1
            // console.log(urut);
            $(this).attr('data-urut', urut)
            $(this).find('td').first().find('h3.urut-rows').html(urut)
        })

        $('button.bt-remove-item').each(function(i, e){
            var urut = i + 1
            $(this).attr('data-id', urut)
        })
    }

    function initDefault(limit, page){
        $.ajax({
            async: true,
            url: 'backlog/list',
            method: 'GET',
            data: {
                limit: limit || 100,
                page: page || 1,
                keyword: null
            },
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-list').html(result)
                body.find('div#content-form').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'inline')
                body.find('button.bt-back').css('display', 'none')
                body.find('div#content-list').css('display', 'block')
                body.find('div#content-form').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'inline')
            }
        })
    }

    function initCreate(){
        $.ajax({
            async: true,
            url: 'backlog/create',
            method: 'GET',
            dataType: 'html',
            contentType: false,
            success: function(result){
                body.find('div#content-form').html(result)
                body.find('div#content-list').html('')
            },
            error: function(err){
                console.log(err)
            },
            complete: function() {
                body.find('button#bt-create-form').css('display', 'none')
                body.find('button.bt-back').css('display', 'inline')
                body.find('div#content-form').css('display', 'block')
                body.find('div#content-list').css('display', 'none')
                body.find('div#div-filter-limit').css('display', 'none')
                var tambahRows = body.find('input#row-number').val() || 1
                addItems(tambahRows)
            }
        })
    }

    function getDataForm(){
        let keys = []
        let values = []
        $('select.item-data, input.item-data, textarea.item-data').each(function(){
            var property = $(this).attr('name')
            var val = $(this).val()
            keys.push(property)
            values.push(val)
        })

        function itemData(){
            let items = []
            $('tr.item-rows').each(function(){
                var elm = $(this)

                var props = []
                var vals = []
                elm.find('select.item-data-details, input.item-data-details').each(function(){
                    props.push($(this).attr('name'))
                    vals.push($(this).val())
                })

                items.push(_.object(props, vals))
            })
            return items
        }

        var data = _.object(keys, values)

        return {
            ...data,
            items: itemData()
        }
    }
})