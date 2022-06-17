'use strict'

const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Barang = use("App/Models/master/Barang")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const SysConfig = use("App/Models/SysConfig")

class PembayaranPelangganController {
    async index ( { auth, view } ) {
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

        console.log('...');
        const data = await OrderPelangganHelpers.LIST(req)
        return view.render('operational.pembayaran-pelanggan.list-order', {list: data})
    }

    async list ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log('...');
        const data = await BayarPelangganHelpers.LIST(req)
        return view.render('operational.pembayaran-pelanggan.list-order', {list: data})
    }

    async create ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = await initFunc.WORKSPACE(user)
        const kodeKwitansi = await initFunc.GEN_KODE_KWITANSI(user)
        return view.render('operational.pembayaran-pelanggan.create', { ws: cabang.cabang_id, kode: kodeKwitansi })
    }

    async invoice ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await OrderPelangganHelpers.SHOW(params)
        data.tot_inv = parseFloat(data.tot_order) + parseFloat(data.tot_service)
        // console.log(data);
        return view.render('operational.pembayaran-pelanggan.invoice', { data: data })
    }

    async payment ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await OrderPelangganHelpers.SHOW(params)
        const kodeKwitansi = await initFunc.GEN_KODE_KWITANSI(user)
        return view.render('operational.pembayaran-pelanggan.show', { data: data, no_kwitansi: kodeKwitansi })
    }

    async store ( { auth, request } ) {
        let req = request.all()
        req.dataForm = JSON.parse(req.dataForm)
        // console.log(JSON.stringify(req, null, 2));

        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }

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