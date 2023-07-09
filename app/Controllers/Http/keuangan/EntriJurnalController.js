'use strict'

const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const Kas = use("App/Models/akunting/Kas")
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const Bank = use("App/Models/akunting/Bank")
const GudangHelpers = use("App/Helpers/Gudang")
const Pemasok = use("App/Models/master/Pemasok")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const Pelanggan = use("App/Models/master/Pelanggan")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const KeuEntriJurnalHelpers = use("App/Helpers/KeuEntriJurnal")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
const KeuEntriJurnalItem = use("App/Models/transaksi/KeuEntriJurnalItem")

class EntriJurnalController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.entry-jurnal.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const data = await KeuEntriJurnalHelpers.LIST(req, user)
        console.log('req', data);
        return view.render('keuangan.entry-jurnal.list', {list: data})
    }

    async create ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        return view.render('keuangan.entry-jurnal.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        let data = await KeuEntriJurnalHelpers.SHOW(params)
        
        return view.render('keuangan.entry-jurnal.show', { data })
    }

    async showItem ({ params }) {
        let items = (await KeuEntriJurnalItem.query().where( w => {
            w.where('sesuai_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        let akunCoa = (await AccCoa.query().where('aktif', 'Y').fetch()).toJSON()
        akunCoa = _.groupBy(akunCoa, 'coa_tipe_nm')
        akunCoa = Object.keys(akunCoa).map( key => {
            return {
                coa: key,
                itemCoa: akunCoa[key]
            }
        })

        const barang = (await Barang.query().where('aktif', 'Y').fetch()).toJSON()
        const gudang = (await Gudang.query().where('aktif', 'Y').fetch()).toJSON()
        const pemasok = (await Pemasok.query().where('aktif', 'Y').fetch()).toJSON()
        const pelanggan = (await Pelanggan.query().where('aktif', 'Y').fetch()).toJSON()
        const keuFakturPembelian = (await KeuFakturPembelian.query().where( w => {
            w.where('aktif', 'Y')
            w.where('sts_paid', 'bersisa')
        }).fetch()).toJSON()

        const opsPelangganOrder = (await OpsPelangganOrder.query().where( w => {
            w.where('aktif', 'Y')
            w.whereIn('status', ['dp', 'ready'])
        }).fetch()).toJSON()

        console.log(items);

        items = items.map( elm => {
            return '<tr class="item-rows">'+
                    '    <td class="urut"><h4 class="urut-rows"></h4></td>'+
                    '    <td style="vertical-align: middle;">'+
                    '        <div class="row">'+
                    '            <div class="col-md-6">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-btn">'+
                    '                        <button class="btn btn-danger bt-remove-item" type="button">'+
                    '                            <i class="ti-trash"></i>'+
                    '                        </button>'+
                    '                    </span>'+
                    '                    <select class="form-control item-data-details" name="coa_id" required>'+
                    '                        <option value="">Pilih...</option>'+
                                                akunCoa.map(v => '<optgroup label="'+v.coa+'">'+v.itemCoa.map(c => '<option value="'+c.id+'" '+`${elm.coa_id == c.id ? 'selected':''}`+'>'+c.coa_name+'</option>')+'</optgroup>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-3">'+
                    '                <div class="input-group has-warning m-b-10">'+
                    '                    <span class="input-group-addon border-all">Debit</span>'+
                    '                    <input type="number" step="any" class="form-control item-data-details" name="debit" value="'+elm.d+'" required>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-3">'+
                    '                <div class="input-group has-success m-b-10">'+
                    '                    <span class="input-group-addon border-all">Kredit</span>'+
                    '                    <input type="number" step="any" class="form-control item-data-details" name="kredit" value="'+elm.k+'" required>'+
                    '                </div>'+
                    '            </div>'+
                    '        </div>'+
                    '        <div class="row">'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-pemasok" style="display:'+`${elm.pemasok_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">Pemasok</span>'+
                    '                    <select class="form-control entri-items selectPemasok item-data-details" name="pemasok_id" data-value="'+elm.pemasok_id+'">'+
                    '                        <option value="">Pilih...</option>'+
                                             pemasok.map(p => '<option value="'+p.id+'" '+`${p.id == elm.pemasok_id?"selected":""}`+'>'+p.nama+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-pemasok" style="display:'+`${elm.faktur_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="faktur_id">Faktur Hutang</span>'+
                    '                    <select class="form-control entri-items item-data-details" name="faktur_id">'+
                    '                        <option value="">Pilih...</option>'+
                                            keuFakturPembelian.map( f => '<option value="'+f.id+'" '+`${f.id == elm.faktur_id?"selected":""}`+'>'+`[${f.kode || '...'}] sisa pembayaran ---> Rp. ${f.sisa}`+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-pelanggan" style="display:'+`${elm.pelanggan_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">Pelanggan</span>'+
                    '                    <select class="form-control entri-items selectPelanggan item-data-details" name="pelanggan_id">'+
                    '                        <option value="">Pilih...</option>'+
                                            pelanggan.map( p => '<option value="'+p.id+'" '+`${p.id == elm.pelanggan_id?"selected":""}`+'>'+p.nama+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-pelanggan" style="display:'+`${elm.order_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="invoice-pelanggan">Invoice</span>'+
                    '                    <select class="form-control entri-items item-data-details" name="order_id">'+
                    '                        <option value="">Pilih...</option>'+
                                            opsPelangganOrder.map( o => '<option value="'+o.id+'" '+`${o.id == elm.order_id?"selected":""}`+'>'+`[${o.status} - ${o.kdpesanan}] Sisa ---> Rp. ${o.sisa_trx}`+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-persediaan" style="display:'+`${elm.barang_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">Barang</span>'+
                    '                    <select class="form-control entri-items selectBarang item-data-details" name="barang_id">'+
                    '                        <option value="">Pilih...</option>'+
                                                barang.map( b => '<option value="'+b.id+'" '+`${b.id == elm.barang_id?"selected":""}`+'>['+b.num_part+']'+b.nama+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-6 entri-details visible-entri-jurnal-persediaan" style="display:'+`${elm.gudang_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">Gudang</span>'+
                    '                    <select class="form-control entri-items selectGudang item-data-details" name="gudang_id" data-values="">'+
                    '                        <option value="">Pilih...</option>'+
                                                gudang.map( g => '<option value="'+g.id+'" '+`${g.id == elm.gudang_id?"selected":""}`+'>['+g.kode+']'+g.nama+'</option>')+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-3 col-md-offset-6 entri-details visible-entri-jurnal-persediaan" style="display:'+`${elm.barang_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">...</span>'+
                    '                    <select class="form-control entri-items item-data-details" name="sync_stok">'+
                    '                        <option value="">Pilih</option>'+
                    '                        <option value="Y">Pengaruhi Stok</option>'+
                    '                        <option value="N">Jangan Pengaruhi Stok</option>'+
                    '                    </select>'+
                    '                </div>'+
                    '            </div>'+
                    '            <div class="col-md-3 entri-details visible-entri-jurnal-persediaan" style="display:'+`${elm.barang_id ? 'inline':'none'}`+';">'+
                    '                <div class="input-group m-b-10">'+
                    '                    <span class="input-group-addon" id="basic-addon2">Qty</span>'+
                    '                    <input type="number" class="form-control entri-items item-data-details" name="qty" value="'+elm.qty+'">'+
                    '                </div>'+
                    '            </div>'+
                    '        </div>'+
                    '    </td>'+
                    '    <td style="vertical-align: middle;border-left:1px dashed">'+
                    '        <button type="button" class="btn btn-default btn-circle bt-add-jurnal" disabled>'+
                    '            <i class="fa fa-plus"></i> '+
                    '        </button>'+
                    '    </td>'+
                    '</tr>'+
                    '{{ script("ajax/opt-pelanggan") }}'+
                    '{{ script("ajax/opt-pemasok") }}'+
                    '{{ script("ajax/opt-gudang") }}'+
                    '{{ script("ajax/opt-barang") }}'+
                    '{{ script("ajax/opt-kas") }}'+
                    '{{ script("ajax/opt-bank") }}'+
                    '<script>'+
                    '    $(function(){'+
                    '        $("select").select2({'+
                    '            placeholder: "Pilih...",'+
                    '            allowClear: true'+
                    '        })'+
                    '    })'+
                    '</script>'+
                    '<style>'+
                    '    .border-all {'+
                    '        border: 1px solid #ddd !important;'+
                    '    }'+
                    '</style>';
            })
        return items
    }

    async store ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        let attach = request.files()
        if(attach?.attach?.length > 0){
            for (const obj of attach.attach) {
    
               if(!(validateFile.extnames).includes(obj.extname)){
                   return {
                       success: false,
                       message: obj.clientName + ' files not support....'
                   }
               }
    
               if((parseFloat(validateFile.size) * 1024 * 1024) <= obj.size){
                    return {
                        success: false,
                        message: obj.clientName + ' file size is too big....'
                    }
               }
            }
        }

        console.log('request.files()');
        const data = JSON.parse(req.dataForm)
        req.dataForm = data

        for (let [i, obj] of (req.dataForm.items).entries()) {
            const coa = await DefCoa.query().where( w => {
                w.where('group', 'entri-jurnal')
                w.where('coa_id', obj.coa_id)
            }).last()

            if((coa?.description === 'Persediaan')){
                req.dataForm.items[i].pemasok_id = null
                obj.pelanggan_id = null
                obj.faktur_id = null
                obj.order_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.barang_id){
                    return {
                        success: false,
                        message: 'Nama Barang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.gudang_id){
                    return {
                        success: false,
                        message: 'Nama Gudang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.qty){
                    return {
                        success: false,
                        message: 'Jumlah Barang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Piutang Dagang')){
                obj.pemasok_id = null
                obj.barang_id = null
                obj.gudang_id = null
                obj.faktur_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.pelanggan_id){
                    return {
                        success: false,
                        message: 'Nama Pelanggan blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.order_id){
                    return {
                        success: false,
                        message: 'No. Invoices blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Hutang Dagang')){
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.pemasok_id){
                    return {
                        success: false,
                        message: 'Nama Pemasok blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.faktur_id){
                    return {
                        success: false,
                        message: 'No. Faktur blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Kas')){
                console.log('isKas');
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.pemasok_id = null
                obj.faktur_id = null
                obj.bank_id = null
                obj.kas_id = obj.coa_id
            }

            if((coa?.description === 'Bank')){
                console.log('isBank');
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.pemasok_id = null
                obj.faktur_id = null
                obj.kas_id = null
                obj.bank_id = obj.coa_id
            }
        }

        // console.log(data);
        attach = _.size(attach) > 0 ? attach : null
        const result = await KeuEntriJurnalHelpers.POST(data, user, attach)
        return result
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        let attach = request.files()
        if(attach?.attach?.length > 0){
            for (const obj of attach.attach) {
    
               if(!(validateFile.extnames).includes(obj.extname)){
                   return {
                       success: false,
                       message: obj.clientName + ' files not support....'
                   }
               }
    
               if((parseFloat(validateFile.size) * 1024 * 1024) <= obj.size){
                    return {
                        success: false,
                        message: obj.clientName + ' file size is too big....'
                    }
               }
            }
        }

        // console.log(request.files());
        const data = JSON.parse(req.dataForm)
        req.dataForm = data

        for (let [i, obj] of (req.dataForm.items).entries()) {
            const coa = await DefCoa.query().where( w => {
                w.where('group', 'entri-jurnal')
                w.where('coa_id', obj.coa_id)
            }).last()

            console.log('====================================');
            console.log(coa?.toJSON() || 'Akun '+obj.coa_id+' tdk ditemukan pada DEF-COAS...');
            console.log('====================================');

            if((coa?.description === 'Persediaan')){
                req.dataForm.items[i].pemasok_id = null
                obj.pelanggan_id = null
                obj.faktur_id = null
                obj.order_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.barang_id){
                    return {
                        success: false,
                        message: 'Nama Barang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.gudang_id){
                    return {
                        success: false,
                        message: 'Nama Gudang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.qty){
                    return {
                        success: false,
                        message: 'Jumlah Barang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.sync_stok){
                    return {
                        success: false,
                        message: 'Setting Stok Barang blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Piutang Dagang')){
                obj.pemasok_id = null
                obj.barang_id = null
                obj.gudang_id = null
                obj.faktur_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.pelanggan_id){
                    return {
                        success: false,
                        message: 'Nama Pelanggan blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.order_id){
                    return {
                        success: false,
                        message: 'No. Invoices blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Hutang Dagang')){
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.bank_id = null
                obj.kas_id = null
                if(!obj.pemasok_id){
                    return {
                        success: false,
                        message: 'Nama Pemasok blum ditentukan pada item ke-' + (i + 1)
                    }
                }
                if(!obj.faktur_id){
                    return {
                        success: false,
                        message: 'No. Faktur blum ditentukan pada item ke-' + (i + 1)
                    }
                }
            }

            if((coa?.description === 'Kas')){
                console.log('isKas');
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.pemasok_id = null
                obj.faktur_id = null
                obj.bank_id = null
                obj.kas_id = obj.coa_id
            }

            if((coa?.description === 'Bank')){
                console.log('isBank');
                obj.barang_id = null
                obj.gudang_id = null
                obj.pelanggan_id = null
                obj.order_id = null
                obj.pemasok_id = null
                obj.faktur_id = null
                obj.kas_id = null
                obj.bank_id = obj.coa_id
            }
        }

        // console.log(data);
        attach = _.size(attach) > 0 ? attach : null
        const updated = await KeuEntriJurnalHelpers.UPDATE(params, req, user, attach)
        return updated
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuEntriJurnalHelpers.DELETE(params)
        return data
    }

    async addItem ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const coa = (await AccCoa.query().fetch()).toJSON()
        let data = _.groupBy(coa, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })

        const barang = (await Barang.query().where('aktif', 'Y').fetch()).toJSON()
        const gudang = (await Gudang.query().where('aktif', 'Y').fetch()).toJSON()
        const pemasok = (await Pemasok.query().where('aktif', 'Y').fetch()).toJSON()
        const pelanggan = (await Pelanggan.query().where('aktif', 'Y').fetch()).toJSON()
        const keuFakturPembelian = (await KeuFakturPembelian.query().where( w => {
            w.where('aktif', 'Y')
            w.where('sts_paid', 'bersisa')
        }).fetch()).toJSON()

        const opsPelangganOrder = (await OpsPelangganOrder.query().where( w => {
            w.where('aktif', 'Y')
            w.whereIn('status', ['dp', 'ready'])
        }).fetch()).toJSON()
        
        return view.render('keuangan.entry-jurnal.create-items', {
            akun : data,
            arrBarang: barang,
            arrGudang: gudang,
            arrPemasok: pemasok,
            arrPelanggan: pelanggan,
            arrFakturBeli: keuFakturPembelian,
            arrFakturJual: opsPelangganOrder
        })
    }

    async selectRelation ( { params } ) {
        const data = (await DefCoa.query().where( w => {
            w.where('coa_id', params.coa)
            w.where('group', 'like', `visible-entri-jurnal%`)
        }).last())?.toJSON() || {}
        return data
    }

    async selectGudang ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const result = await GudangHelpers.LIST(req, user)
        let data = result.data

        if(req?.selected){
            data = data.map(el => el.id === parseInt(req?.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
        }
        return data
    }

    async selectFaktur ( { params } ) {
        // const data = (await DefCoa.query().where( w => {
        //     w.where('coa_id', params.coa)
        //     w.where('group', 'like', `entri-jurnal%`)
        // }).last())?.toJSON() || {}
        // return data
    }

    async selectInvoice ( { params } ) {
        const pelanggan = {id: params.pelanggan}
        let data = await BayarPelangganHelpers.PENDING_PAYMENT(pelanggan)
        data = _.groupBy(data, 'date')
        data = Object.keys(data).map(key => {
            return {
                date: key,
                items: data[key].map(el => {
                    return {
                        ...el,
                        invoices: el.kdpesanan + ' ---------- [ Sisa Bayar : ' + el.sisa_trx + ' ]'
                    }
                })
            }
        })
        data.unshift({date: '', items: [{id: '', invoices: 'Silahkan pilih invoices....'}]})
        return data
    }
}

module.exports = EntriJurnalController
async function userValidate(auth){
    let user
    try {
        user = await auth.getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}