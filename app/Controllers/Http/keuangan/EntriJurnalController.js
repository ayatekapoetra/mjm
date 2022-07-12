'use strict'

const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const Kas = use("App/Models/akunting/Kas")
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const Bank = use("App/Models/akunting/Bank")
const GudangHelpers = use("App/Helpers/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const KeuEntriJurnalHelpers = use("App/Helpers/KeuEntriJurnal")

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
        data = {
            ...data, 
            status_out: moment(data.trx_date).format('YYYY-MM-DD') != moment(data.out_date).format('YYYY-MM-DD') ? 'tunda':'sesuai',
            status_in: moment(data.trx_date).format('YYYY-MM-DD') != moment(data.in_date).format('YYYY-MM-DD') ? 'tunda':'sesuai'
        }
        return view.render('keuangan.entry-jurnal.show', { data })
    }

    async store ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image', 'application'],
            size: '1mb',
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
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf']
        }

        if(req.trx_date != req.delay_out){
            req.isDelayOut = 'Y'
        }else{
            req.isDelayOut = 'N'
        }

        if(req.trx_date != req.delay_in){
            req.isDelayIn = 'Y'
        }else{
            req.isDelayIn = 'N'
        }

        // console.log(req);
        const attchment = request.file('photo', validateFile)
        const data = await KeuEntriJurnalHelpers.UPDATE(params, req, user, attchment)
        return data
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
        return view.render('keuangan.entry-jurnal.create-items', {akun : data})
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