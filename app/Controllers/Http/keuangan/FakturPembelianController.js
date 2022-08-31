'use strict'

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const logoPath = Helpers.publicPath('logo.png')
const AccCoa = use("App/Models/akunting/AccCoa")
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuFakturPembelianHelpers = use("App/Helpers/KeuFakturBeli")

class FakturPembelianController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.faktur-pembelian.index', {
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

        const data = await KeuFakturPembelianHelpers.LIST(req, user)
        // console.log(data.data[0]);
        return view.render('keuangan.faktur-pembelian.list', {list: data})
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('keuangan.faktur-pembelian.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuFakturPembelianHelpers.SHOW(params)
        return view.render('keuangan.faktur-pembelian.show', {data: data})
    }

    async store ( { auth, request } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }
        const attchment = request.file('lampiran', validateFile)

        const req = request.all()
        req.data = JSON.parse(req.dataForm)
        // console.log(req);
        // console.log(attchment);
        

        if(!req.cabang_id){
            return {
                success: false,
                message: 'Cabang tidak terdefenisikan...'
            }
        }

        if(!req.gudang_id){
            return {
                success: false,
                message: 'Gudang tidak terdefenisikan...'
            }
        }

        if(!req.pemasok_id){
            return {
                success: false,
                message: 'Pemasok tidak terdefenisikan...'
            }
        }

        req.data.items = req.data.items.map(el => {
            if(el["type-discount"] === 'persen'){
                var typeDiscount = 'persen'
                var discount_rp = (parseFloat(el.harga_stn) * parseFloat(el.qty)) * (parseFloat(el.discount)/100)
            }else{
                var typeDiscount = 'rupiah'
                var discount_rp = parseFloat(el.discount)
            }
            return {
                ...el,
                type_discount: typeDiscount,
                subtotal: (parseFloat(el.harga_stn) * parseFloat(el.qty)) - discount_rp,
                discount_rp: discount_rp
            }
        })

        const subtotal = (req.data.items).reduce((a, b) => { return a + parseFloat(b.subtotal) }, 0)
        const ppn_rp = (subtotal * parseFloat(req.ppn))/100
        req.itemsTotal = subtotal
        req.ppn_rp = ppn_rp || 0

        const data = await KeuFakturPembelianHelpers.POST(req, user, attchment)
        return data

    }

    async update ( { auth, params, request } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }
        const attchment = request.file('lampiran', validateFile)

        const req = request.all()
        req.data = JSON.parse(req.dataForm)
        console.log(req);
        // console.log(attchment);
        

        if(!req.cabang_id){
            return {
                success: false,
                message: 'Cabang tidak terdefenisikan...'
            }
        }

        if(!req.gudang_id){
            return {
                success: false,
                message: 'Gudang tidak terdefenisikan...'
            }
        }

        if(!req.pemasok_id){
            return {
                success: false,
                message: 'Pemasok tidak terdefenisikan...'
            }
        }

        req.data.items = req.data.items.map(el => {
            if(el["type-discount"] === 'persen'){
                var typeDiscount = 'persen'
                var discount_rp = (parseFloat(el.harga_stn) * parseFloat(el.qty)) * (parseFloat(el.discount)/100)
            }else{
                var typeDiscount = 'rupiah'
                var discount_rp = parseFloat(el.discount)
            }
            return {
                ...el,
                type_discount: typeDiscount,
                subtotal: (parseFloat(el.harga_stn) * parseFloat(el.qty)) - discount_rp,
                discount_rp: discount_rp
            }
        })

        const subtotal = (req.data.items).reduce((a, b) => { return a + parseFloat(b.subtotal) }, 0)
        const ppn_rp = (subtotal * parseFloat(req.ppn))/100
        req.itemsTotal = subtotal
        req.ppn_rp = ppn_rp || 0

        const data = await KeuFakturPembelianHelpers.UPDATE(params, req, user, attchment)
        return data

    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuFakturPembelianHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        const result = await GEN_FAKTUR_BELI_PDF(data, logoAsBase64)
        return result
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuFakturPembelianHelpers.DELETE(params)
        return data
    }

    async addItem ( { view } ) {
        const coa = (await AccCoa.query().fetch()).toJSON()
        let data = _.groupBy(coa, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })
        return view.render('components.items.faktur-beli.item-details', {akun : data})
    }
}

module.exports = FakturPembelianController

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

async function GEN_FAKTUR_BELI_PDF(data, logo){
    let body = []
    body.push([
        {text: 'No', bold: true, fillColor: '#ddd'},
        {text: 'Account', bold: true, fillColor: '#ddd'},
        {text: 'Descriptions', bold: true, fillColor: '#ddd'},
        {text: 'Qty', bold: true, fillColor: '#ddd'},
        {text: 'Jumlah', bold: true, fillColor: '#ddd', alignment: 'right'},
        {text: 'discount', bold: true, fillColor: '#ddd', alignment: 'right'},
        {text: 'Total', bold: true, fillColor: '#ddd', alignment: 'right'},
    ])

    for (const [i, obj] of (data.items).entries()) {
        body.push([
            {text: i+1, fontSize: 9},
            {text: obj.coa.coa_name, fontSize: 9},
            {text: obj.barang.nama, fontSize: 9},
            {text: obj.qty, fontSize: 9},
            {text: `Rp. ${(obj.harga_stn).toLocaleString('ID')},-`, alignment: 'right', fontSize: 9},
            {text: `${(obj.discount).toLocaleString('ID')},-`, alignment: 'right', fontSize: 9},
            {text: `Rp. ${(obj.subtotal).toLocaleString('ID')},-`, alignment: 'right', fontSize: 9},
        ])
    }

    body.push(
        [
            {text: 'Total', italics: true, colSpan: 5, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {},
            {},
            {},
            {},
            {text: `Rp. ${(data.total).toLocaleString('ID')},-`, bold: true, colSpan: 2, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {}
        ],
        [
            {text: 'Pajak('+data.ppn+'%)', italics: true, colSpan: 5, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {},
            {},
            {},
            {},
            {text: `Rp. ${(data.ppn_rp).toLocaleString('ID')},-`, bold: true, colSpan: 2, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {}
        ],
        [
            {text: 'Grand Total', italics: true, colSpan: 5, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {},
            {},
            {},
            {},
            {text: `Rp. ${(data.grandtot).toLocaleString('ID')},-`, bold: true, colSpan: 2, fillColor: '#ddd', alignment: 'right', fontSize: 9},
            {}
        ]
    )

    var dd = {
        pageSize: 'A4',
        pageMargins: [ 20, 30, 20, 45 ],
        watermark: { 
            angle: 0,
            fontSize: 50,
            text: 'Faktur Pembelian',
            color: 'red',
            angle: -25,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Faktur Pembelian Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Faktur Pembelian MJM',
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
                                    {text: 'Tanggal Faktur', bold: true, fontSize: 10},
                                    {text: ':  ' + moment(data.date_faktur).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'Jatuh Tempo', bold: true, fontSize: 10},
                                    {text: ':  ' + moment(data.due_date).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'Faktur Pembelian', bold: true, fontSize: 10},
                                    {text: ':  ' + data.kode, fontSize: 10}
                                ],
                                [
                                    {text: 'Pemasok', bold: true, fontSize: 10},
                                    {text: ':  ' + data.pemasok.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Gudang', bold: true, fontSize: 10},
                                    {text: ':  ' + data.gudang.nama, fontSize: 10}
                                ]
                            ]
                        },
                        layout: 'noBorders'
                    },
                    
                ]
            },
            {text: '\n'},
            {text: 'Faktur Pembelian', bold: true, fontSize: 22},
            {text: '\n'},
            {
                style: 'tableExample',
                table: {
                    widths: [30, 100, '*', 30, 80, 50, 70],
                    body: body
                },
                layout: 'noBorders'
            }
        ]
        
    }

    return dd
}