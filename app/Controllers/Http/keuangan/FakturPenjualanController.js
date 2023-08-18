'use strict'

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
moment.locale('ID')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const logoPath = Helpers.publicPath('logo.png')
const AccCoa = use("App/Models/akunting/AccCoa")
const Image64Helpers = use("App/Helpers/_encodingImages")
const OrdPelanggan = use("App/Models/operational/OpsPelangganOrder")
const PelangganBayar = use("App/Models/operational/OpsPelangganBayar")
const KeuFakturPenjualanHelpers = use("App/Helpers/KeuFakturJual")

class FakturPenjualanController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.faktur-penjualan.index', {
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

        const data = await KeuFakturPenjualanHelpers.LIST(req, user)
        return view.render('keuangan.faktur-penjualan.list', {list: data})
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = user.cabang_id
        return view.render('keuangan.faktur-penjualan.create', {usr_cabang: cabang})
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuFakturPenjualanHelpers.SHOW(params)
        return view.render('keuangan.faktur-penjualan.show', {data: data})
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

        if(!req.pelanggan_id){
            return {
                success: false,
                message: 'Pelanggan tidak terdefenisikan...'
            }
        }

        const data = await KeuFakturPenjualanHelpers.POST(req, user, attchment)
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

        const data = await KeuFakturPenjualanHelpers.UPDATE(params, req, user, attchment)
        return data

    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuFakturPenjualanHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        const result = await GEN_FAKTUR_BELI_PDF(data, logoAsBase64)
        return result
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuFakturPenjualanHelpers.DELETE(params)
        return data
    }

    async searchInvoices ( { params } ) {
        console.log(params);
        const inv = (
            await OrdPelanggan.query().where( w => {
                w.where('aktif', 'Y')
                w.where('pelanggan_id', params.pelanggan)
                w.where('sisa_trx', '>', 0)
            }).fetch()
        ).toJSON()

        let html = []
        if (inv.length > 0) {
            for (const v of inv) {
                html.push('<option value="'+v.id+'">[ '+v.kdpesanan+' ] '+v.narasi+'</option>')
            }
            html.unshift('<option value="">[ x ] Pilih Nomor Invoices</option>')
        } else {
            html.unshift('<option value="">[ x ] Nomor Invoices tidak ditemukan...</option>')
        }
        return html
    }

    async searchTotalInv ( { params } ) {
        const inv = (
            await OrdPelanggan.query().where( w => {
                w.where('id', params.reff)
                w.where('aktif', 'Y')
            }).last()
        ).toJSON()

        const riwayatBayar = (
            await PelangganBayar.query()
            .with('author')
            .where('order_id', params.reff).fetch()
        ).toJSON()

        const htmlRiwayat = []
        if (riwayatBayar.length > 0) {
            for (const [i, v] of riwayatBayar.entries()) {
                var html = 
                '<tr class="item-rows">'+
                '    <td>'+
                '        <strong>'+(i + 1)+'</strong>'+
                '    </td>'+
                '    <td class="b-all" width="10%">'+v.no_invoice+'</td>'+
                '    <td class="b-all" width="10%">'+v.no_kwitansi+'</td>'+
                '    <td class="b-all" width="15%">'+moment(v.date_paid).format('dddd, DD MMMM YYYY')+'</td>'+
                '    <td class="b-all" width="*">'+v.narasi+'</td>'+
                '    <td class="b-all text-center" width="10%"><small>'+v.author.nama_lengkap+'</small></td>'+
                '    <td class="b-all text-right text-white" width="10%">Rp. '+(v.paid_trx).toLocaleString('ID')+'</td>'+
                '</tr>';
                htmlRiwayat.push(html)
            }
        } else {
            htmlRiwayat.push('<tr class="item-rows"><td colspan="7"><strong class="text-white">Tidak ada riwayat pembayaran...</strong></td></tr>')
        }

        const data = {
            ...inv, 
            riwayat: htmlRiwayat,
            terbilang: await Image64Helpers.pembilang(inv.sisa_trx)
        }

        return data
    }
}

module.exports = FakturPenjualanController

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