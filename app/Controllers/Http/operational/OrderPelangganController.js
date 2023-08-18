'use strict'

const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Barang = use("App/Models/master/Barang")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")

class OrderPelangganController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('operational.order-pelanggan.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await OrderPelangganHelpers.LIST(req)
        return view.render('operational.order-pelanggan.list', {list: data})
    }

    async create ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = await initFunc.WORKSPACE(user)
        const kodeINV = await initFunc.GEN_KODE_INVOICES(user)
        return view.render('operational.order-pelanggan.create', { 
            ws: cabang.cabang_id, 
            kode: kodeINV 
        })
    }

    async createItems ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('operational.order-pelanggan.create-item')
    }

    async createJasa ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('operational.order-pelanggan.create-jasa')
    }

    async invoice ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await OrderPelangganHelpers.SHOW(params)
        data.tot_inv = parseFloat(data.tot_order) + parseFloat(data.tot_service)
        // console.log(data);
        return view.render('operational.order-pelanggan.invoice', { data: data })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await OrderPelangganHelpers.SHOW(params)
        data.tot_inv = parseFloat(data.tot_order) + parseFloat(data.tot_service)
        console.log(data);
        return view.render('operational.order-pelanggan.show', { data: data })
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

        let arrBarang = req.dataForm.items.filter( a => a.barang_id != '' || parseInt(a.qty) > 0)
        let arrJasa = req.dataForm.jasa.filter( b => b.jasa_id != ''|| parseInt(b.qty) > 0)

        req.dataForm.items = arrBarang
        req.dataForm.jasa = arrJasa
        
        if(!req.pelanggan_id){
            return {
                success: false,
                message: 'Data pelanggan belum ditentukan...'
            }
        }

        for (const [i, item] of arrBarang.entries()) {
            var urut = i + 1
            if(item.qty <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Quantity item barang No.' + urut + '\ntidak valid...'
                }
            }
            if(item.hargaJual <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Harga item barang No.' + urut + '\ntidak valid...'
                }
            }
        }

        for (const [i, item] of arrJasa.entries()) {
            var urut = i + 1
            if(item.qty <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Quantity jasa No.' + urut + '\ntidak valid...'
                }
            }
            if(item.hargaJual <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Biaya jasa  No.' + urut + '\ntidak valid...'
                }
            }
        }

        
        const kodeINV = await initFunc.GEN_KODE_INVOICES(user)
        req.dataForm.kode = kodeINV
        const result = await OrderPelangganHelpers.POST(req.dataForm, user)
        // console.log(arrJasa);
        return result

    }

    async update ( { auth, params, request } ) {
        let req = request.all()
        req.dataForm = JSON.parse(req.dataForm)

        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }

        let arrBarang = req.dataForm.items.filter( a => a.barang_id != '' || parseInt(a.qty) > 0)
        let arrJasa = req.dataForm.jasa.filter( b => b.jasa_id != ''|| parseInt(b.qty) > 0)

        req.dataForm.items = arrBarang
        req.dataForm.jasa = arrJasa

        if(!req.pelanggan_id){
            return {
                success: false,
                message: 'Data pelanggan belum ditentukan...'
            }
        }

        for (const [i, item] of arrBarang.entries()) {
            var urut = i + 1
            if(item.qty <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Quantity item barang No.' + urut + '\ntidak valid...'
                }
            }
            if(item.hargaJual <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Harga item barang No.' + urut + '\ntidak valid...'
                }
            }
        }

        for (const [i, item] of arrJasa.entries()) {
            var urut = i + 1
            if(item.qty <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Quantity jasa No.' + urut + '\ntidak valid...'
                }
            }
            if(item.hargaJual <= 0){
                return {
                    success: false,
                    urut: i,
                    message: 'Biaya jasa  No.' + urut + '\ntidak valid...'
                }
            }
        }

        // console.log(req.dataForm);
        const result = await OrderPelangganHelpers.UPDATE(params, req.dataForm, user)
        return result
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }
        const result = await OrderPelangganHelpers.DELETE(params)
        return result
    }
}

module.exports = OrderPelangganController

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