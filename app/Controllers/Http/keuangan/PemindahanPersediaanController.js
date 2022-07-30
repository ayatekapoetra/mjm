'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuPindahPersediaanHelpers = use("App/Helpers/KeuPindahPersediaan")

class PemindahanPersediaanController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.pemindahan-persediaan.index', {
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

        const data = await KeuPindahPersediaanHelpers.LIST(req)
        return view.render('keuangan.pemindahan-persediaan.list', {list: data})
    }

    async create ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = await initFunc.WORKSPACE(user)
        const kodeINV = await initFunc.GEN_KODE_INVOICES(user)
        return view.render('keuangan.pemindahan-persediaan.create', { ws: cabang.cabang_id, kode: kodeINV })
    }

    async createItems ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('keuangan.pemindahan-persediaan.create-item')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let data = await KeuPindahPersediaanHelpers.SHOW(params)
        data.tot_inv = parseFloat(data.tot_order) + parseFloat(data.tot_service)
        // console.log(data);
        return view.render('keuangan.pemindahan-persediaan.show', { data: data })
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
        req = JSON.parse(req.dataForm)
        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }
        const attchment = request.file('photo', validateFile)
        // console.log(attchment);
        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal pemindahan persediaan tdk boleh kosong...'
            }
        }

        if(!req.kode){
            return {
                success: false,
                message: 'Kode pemindahan persediaan tdk boleh kosong...'
            }
        }

        if(req.gudang_src === req.gudang_target){
            return {
                success: false,
                message: 'Gudang asal dan gudang tujuan tidak boleh sama...'
            }
        }

        for (const [i, brg] of (req.items).entries()) {
            var urut = i + 1
            
            if(!brg.barang_id){
                return {
                    success: false,
                    message: 'Barang persediaan no.'+urut+' tdk boleh kosong...'
                }
            }
            if(parseInt(brg.qty) < 0){
                return {
                    success: false,
                    message: 'Jumlah Barang persediaan no.'+urut+' tdk valid...'
                }
            }
        }

        const data = await KeuPindahPersediaanHelpers.POST(req, user, attchment)
        return data
    }

    async update ( { auth, params, request } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }
        req = JSON.parse(req.dataForm)
        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }
        const attchment = request.file('photo', validateFile)

        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal pemindahan persediaan tdk boleh kosong...'
            }
        }

        if(!req.kode){
            return {
                success: false,
                message: 'Kode pemindahan persediaan tdk boleh kosong...'
            }
        }

        if(req.gudang_src === req.gudang_target){
            return {
                success: false,
                message: 'Gudang asal dan gudang tujuan tidak boleh sama...'
            }
        }

        for (const [i, brg] of (req.items).entries()) {
            var urut = i + 1
            
            if(!brg.barang_id){
                return {
                    success: false,
                    message: 'Barang persediaan no.'+urut+' tdk boleh kosong...'
                }
            }
            if(parseInt(brg.qty) < 0){
                return {
                    success: false,
                    message: 'Jumlah Barang persediaan no.'+urut+' tdk valid...'
                }
            }
        }

        const data = await KeuPindahPersediaanHelpers.UPDATE(params, req, user, attchment)
        return data
        
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }
        const result = await KeuPindahPersediaanHelpers.DELETE(params)
        return result
    }

    async addItem ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('components.items.pemindahan-persediaan.item-details')
    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }
        const data = await KeuPindahPersediaanHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)

        let body = []
        body.push([
            {text: 'No', bold: true, fillColor: '#ddd'},
            {text: 'Kode', bold: true, fillColor: '#ddd'},
            {text: 'Nama Barang', bold: true, fillColor: '#ddd'},
            {text: 'No.Part', bold: true, fillColor: '#ddd', alignment: 'center'},
            {text: 'Jumlah', bold: true, fillColor: '#ddd', alignment: 'right'},
        ])

        for (const [i, obj] of (data.items).entries()) {
            body.push([
                {text: i+1},
                {text: obj.barang.kode, fontSize: 9},
                {text: obj.barang.nama, fontSize: 10},
                {text: obj.barang.num_part, alignment: 'left', fontSize: 8},
                {text: obj.qty + ' ' + obj.barang.satuan, alignment: 'right'},
            ])
        }

        var dd = {
            pageSize: 'A4',
            pageMargins: [ 20, 30, 20, 45 ],
            watermark: { 
                angle: 0,
                fontSize: 50,
                text: 'Transfer Barang',
                color: 'red',
                angle: -25,
                opacity: 0.3, 
                bold: true, 
                italics: false,
            },
            info: {
                title: 'Pindah Persediaan Makassar Jaya Marine',
                author: 'ayat ekapoetra',
                subject: 'Makassar Jaya Marine Personal license',
                keywords: 'Pindah Persediaan MJM',
            },
            content: [
                {
                    alignment: 'justify',
                    columns: [
                        {
                            width: 120,
                            style: 'tableExample',
                            table: {
                                body: [
                                    [
                                        {
                                            width: 100,
                                            image: `${logoAsBase64}`,
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Jln.Banda No.87\nMakassar, Sulawesi-Selatan\nIndonesia 90173\n0411 3630014\n0813 1196 799',
                                            fontSize: 8
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            width: '*',
                            margin: [5, 15, 5, 5],
                            style: 'tableExample',
                            table: {
                                widths: [150, '*'],
                                body: [
                                    [
                                        {text: 'Tanggal', bold: true, fontSize: 10},
                                        {text: ':  ' + moment(data.trx_date).format('DD MMMM YYYY'), fontSize: 10}
                                    ],
                                    [
                                        {text: 'No.Document', bold: true, fontSize: 10},
                                        {text: ':  ' + data.kode, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Dari Gudang', bold: true, fontSize: 10},
                                        {text: ':  [' +data.gudangFrom.kode+ '] ' + data.gudangFrom.nama, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Ke Gudang', bold: true, fontSize: 10},
                                        {text: ':  [' +data.gudangTo.kode+ '] '+ data.gudangTo.nama, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Keterangan', bold: true, fontSize: 10},
                                        {text: ':  ' + data.narasi, fontSize: 10}
                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        },
                        
                    ]
                },
                {text: '\n'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [30, 100, '*', 'auto', 70],
                        body: body
                    }
                }
            ]
            
        }
        return dd
    }
}

module.exports = PemindahanPersediaanController

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