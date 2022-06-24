'use strict'

const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Barang = use("App/Models/master/Barang")
const Bank = use("App/Models/akunting/Bank")
const Kas = use("App/Models/akunting/Kas")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const SysConfig = use("App/Models/SysConfig")

class PembayaranPelangganController {
    async index ( { auth, view } ) {
        await initFunc.UPDATE_JURNAL_DELAY()
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            // console.log(await initFunc.GEN_KODE_KWITANSI(user));
            return view.render('operational.pembayaran-pelanggan.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async listOrder ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await BayarPelangganHelpers.LIST_ORDER(req)
        // console.log('...', data);
        return view.render('operational.pembayaran-pelanggan.list-order', {list: data})
    }

    async listBayar ( { auth, params, request, view } ) {
        let req = request.all()
        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log('...');
        const data = await BayarPelangganHelpers.LIST(params)
        return view.render('operational.pembayaran-pelanggan.list-bayar', {list: data})
    }

    async create ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = await initFunc.WORKSPACE(user)
        const kodeKwitansi = await initFunc.GEN_KODE_KWITANSI(user)
        return view.render('operational.pembayaran-pelanggan.create', { 
            ws: cabang.cabang_id, 
            kode: kodeKwitansi 
        })
    }

    async invoicing ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await OrderPelangganHelpers.SHOW(params)
        const initTax = await SysConfig.query().select('pajak').last()
        data.tot_inv = parseFloat(data.tot_order) + parseFloat(data.tot_service)
        // console.log(data);
        return view.render('operational.pembayaran-pelanggan.invoicing', { data: data, ppn: initTax.pajak })
    }

    async payment ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const initTax = await SysConfig.query().select('pajak').last()
        let data = await OrderPelangganHelpers.SHOW(params)
        const kodeKwitansi = await initFunc.GEN_KODE_KWITANSI(user)
        return view.render('operational.pembayaran-pelanggan.show', { 
            data: data, 
            tax: initTax.pajak,
            // no_kwitansi: kodeKwitansi 
        })
    }

    async invoicingStore ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        const data = await BayarPelangganHelpers.INVOICING(params, req, user)
        return data
    }

    async store ( { auth, request } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }

        if(!req.paid_trx){
            return {
                success: false,
                message: 'Jumlah pembayaran tidak valid...'
            }
        }

        if(req.metode_paid === 'tunai'){
            const kass = (await Kas.query().where('id', req.kas_id).last())?.toJSON()
            req.bank_id = null
            req.kas = kass
            req.coa_id = kass.coa_id
        }else{
            const bank = (await Bank.query().where('id', req.bank_id).last())?.toJSON()
            req.isDelay = moment(req.delay_date).format('YYYY-MM-DD') != moment(req.date).format('YYYY-MM-DD')
            req.kas_id = null
            req.bank = bank
            req.coa_id = bank.coa_id
            req.date = req.delay_date
        }

        const data = await BayarPelangganHelpers.POST(req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        // console.log(user);
        const data = await BayarPelangganHelpers.DELETE(params, user)
        return data
    }
}

module.exports = PembayaranPelangganController

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