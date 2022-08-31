'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuPurchasingOrderHelpers = use("App/Helpers/KeuPurchasingOrder")

class PurchasingRequestController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.purchasing-request.index', {
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

        const data = await KeuPurchasingOrderHelpers.LIST(req, user)
        return view.render('keuangan.purchasing-request.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const kode = await initFunc.GEN_KODE_PR(user)
        return view.render('keuangan.purchasing-request.create', { kode_PR: kode })
    }

    async view ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.view', { data: data })
    }

    async approve ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        try {
            const doc = await DB.from('sys_config_documents').where( w => {
                w.where('document_type', 'purchasing order')
                w.where('user_id', user.id)
            }).last()
            if (!doc) {
                return view.render('unauthorized')
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Error sys_config_documents...'
            }
        }
        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.approve', { data: data })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        let req = request.all()
        req = JSON.parse(req.items)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuPurchasingOrderHelpers.UPDATE(params, req, user)
        return data
    }

    async store ( { auth, request } ){
        let req = request.all()
        req = JSON.parse(req.data)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        // console.log(req);
        if(!req.cabang_id){
            return {
                success: false,
                message: 'Tentukan cabang lebih dulu...'
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: 'Tentukan gudang lebih dulu...'
            }
        }
        if(!req.priority){
            return {
                success: false,
                message: 'Tentukan prioritas lebih dulu...'
            }
        }
        if(!req.date){
            return {
                success: false,
                message: 'Tentukan tanggal lebih dulu...'
            }
        }

        for (const [i, obj] of (req.items).entries()) {
            var urut = i + 1
            if(!obj.barang_id){
                return {
                    success: false,
                    message: 'Barang pada list ke-'+urut+' harus ditentukan...'
                }
            }
            if(!obj.pemasok_id){
                return {
                    success: false,
                    message: 'Pemasok pada list ke-'+urut+' harus ditentukan...'
                }
            }
            if(!obj.metode){
                return {
                    success: false,
                    message: 'Metode pembayaran pada list ke-'+urut+' harus ditentukan...'
                }
            }
            if(!obj.qty || obj.qty <= 0){
                return {
                    success: false,
                    message: 'Jumlah barang pada list ke-'+urut+' harus lebih dari kosong...'
                }
            }
        }
        
        const data = await KeuPurchasingOrderHelpers.POST(req, user)
        return data
    }

    async approveStore ( { auth, params, view } ){
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.APPROVE(params, user)
        return data
    }

    async printRequest ( { auth, params, view } ) {
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)

        const result = GENPDF_REQUEST(data, logoAsBase64)
        
        return result
    }

    async printOrder ( { auth, params, view } ) {
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)

        let arrData = []
        for (const item of data) {
            console.log(item);
            const result = GENPDF_ORDER(item, logoAsBase64)
            arrData.push(result)
        }
        
        return arrData
    }

    async addItem ( { view } ) {
        return view.render('components.items.purchasing-order.item-details')
    }
}

module.exports = PurchasingRequestController

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

function GENPDF_REQUEST(data, logo){
    console.log(data);
    let body = []

    body.push([
        {text: 'No', bold: true, fillColor: '#ddd'},
        {text: 'Kode', bold: true, fillColor: '#ddd'},
        {text: 'Descriptions', bold: true, fillColor: '#ddd'},
        {text: 'Pemasok', bold: true, fillColor: '#ddd', alignment: 'center'},
        {text: 'Jumlah', bold: true, fillColor: '#ddd', alignment: 'right'},
    ])

    for (const [i, obj] of (data.items).entries()) {
        body.push([
            {text: i+1},
            {text: obj.barang.num_part + '\n' + obj.barang.kode, fontSize: 9},
            {text: obj.barang.nama, fontSize: 10},
            {text: '[' + obj.pemasok.kode + ']\n' + obj.pemasok.nama, alignment: 'left', fontSize: 8},
            {text: obj.qty + ' ' + obj.barang.satuan, alignment: 'right'},
        ])
    }

    var dd = {
        pageSize: 'A4',
        pageMargins: [ 20, 30, 20, 45 ],
        watermark: { 
            angle: 0,
            fontSize: 50,
            text: 'Purchasing Request',
            color: 'red',
            angle: -25,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Purchasing Request Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Purchasing Request MJM',
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
                                        image: `${logo}`,
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
                                    {text: ':  ' + moment(data.date).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'Purchasing Request', bold: true, fontSize: 10},
                                    {text: ':  ' + data.kode, fontSize: 10}
                                ],
                                [
                                    {text: 'Cabang', bold: true, fontSize: 10},
                                    {text: ':  [' +data.cabang.kode+ '] '+ data.cabang.nama, fontSize: 10}
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
            },
            {text: '\n'},
            {text: 'Priority '+data.priority, italics: true, fontSize: 8},
            {text: '\n\n'},
            {
                alignment: 'center',
                columns: [
                    {
                        width: 350,
                        text: 'DIsetujui Oleh, \n' + moment(data.approved_at).format('DD MMM YYYY') + '\n\n\n( '+ data.approved.nama_lengkap +' )',
                        fontSize: 10,
                        italics: true
                    },
                    {
                        width: 'auto',
                        text: 'Penerima, ' +'\n\n\n\n( ---------------------- )', 
                        alignment: 'center',
                        fontSize: 10,
                        italics: true
                    }
                ]
            }
        ]
        
    }

    return dd
}

function GENPDF_ORDER(data, logo){
    console.log(data);
    let body = []

    body.push([
        {text: 'No', bold: true, fillColor: '#ddd'},
        {text: 'Kode', bold: true, fillColor: '#ddd'},
        {text: 'Descriptions', bold: true, fillColor: '#ddd'},
        {text: 'Satuan', bold: true, fillColor: '#ddd', alignment: 'center'},
        {text: 'Jumlah', bold: true, fillColor: '#ddd', alignment: 'right'},
    ])

    for (const [i, obj] of (data.items).entries()) {
        body.push([
            {text: i+1},
            {text: obj.barang.num_part + '\n' + obj.barang.kode, fontSize: 9},
            {text: obj.barang.nama, fontSize: 10},
            {text: obj.barang.satuan, alignment: 'center'},
            {text: obj.qty, alignment: 'right'},
        ])
    }

    var dd = {
        pageSize: 'A4',
        pageMargins: [ 20, 30, 20, 45 ],
        watermark: { 
            angle: 0,
            fontSize: 50,
            text: 'Purchasing Order',
            color: 'red',
            angle: -25,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Purchasing Order Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Purchasing Order MJM',
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
                                        image: `${logo}`,
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
                            widths: [80, '*'],
                            body: [
                                [
                                    {text: 'Tanggal', bold: true, fontSize: 10},
                                    {text: ':  ' + moment(data.date).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'Purchasing Request', bold: true, fontSize: 10},
                                    {text: ':  ' + data.kode, fontSize: 10}
                                ],
                                [
                                    {text: 'Pemasok', bold: true, fontSize: 10},
                                    {text: ':  ' + data.items[0].pemasok.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Kode', bold: true, fontSize: 10},
                                    {text: ':  ' + data.items[0].pemasok.kode, fontSize: 10}
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
                    widths: [30, 100, '*', 50, 70],
                    body: body
                }
            },
            {text: '\n'},
            {text: 'Priority '+data.priority, italics: true, fontSize: 8},
            {text: '\n\n'},
            {
                alignment: 'center',
                columns: [
                    {
                        width: 350,
                        text: 'DIsetujui Oleh, \n' + moment(data.approved_at).format('DD MMM YYYY') + '\n\n\n( '+ data.approved.nama_lengkap +' )',
                        fontSize: 10,
                        italics: true
                    },
                    {
                        width: 'auto',
                        text: 'Penerima, ' +'\n\n\n\n( ---------------------- )', 
                        alignment: 'center',
                        fontSize: 10,
                        italics: true
                    }
                ]
            }
        ]
        
    }

    return dd
}