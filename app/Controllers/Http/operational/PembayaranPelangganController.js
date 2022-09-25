'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const _ = require('underscore')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Barang = use("App/Models/master/Barang")
const Bank = use("App/Models/akunting/Bank")
const Kas = use("App/Models/akunting/Kas")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const Image64Helpers = use("App/Helpers/_encodingImages")
const SysConfig = use("App/Models/SysConfig")
const logoPath = Helpers.publicPath('logo.png')

class PembayaranPelangganController {
    async index ( { auth, view } ) {
        let user
        await initFunc.UPDATE_JURNAL_DELAY()
        await initFunc.SUM_PEMBAYARAN_PELANGGAN()
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

        const data = await BayarPelangganHelpers.LIST_ORDER(req, user)
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

        // console.log('...');
        const data = await BayarPelangganHelpers.LIST(params)
        return view.render('operational.pembayaran-pelanggan.list-bayar', {list: data})
    }

    async pendingPayment ( { auth, params, view } ){
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BayarPelangganHelpers.PENDING_PAYMENT(params)
        // console.log(data);
        return view.render('operational.pembayaran-pelanggan.list-invoices', {list: data})
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

        return view.render('operational.pembayaran-pelanggan.invoicing', { data: data, ppn: initTax.pajak })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BayarPelangganHelpers.SHOW(params)
        console.log(data);
        return view.render('operational.pembayaran-pelanggan.update', {data : data, form: 'form-update'})
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        if(!req.paid_trx){
            return {
                success: false,
                message: 'Jumlah pembayaran tidak valid...'
            }
        }

        req.isDelay = moment(req.delay_date).format('YYYY-MM-DD') != moment(req.date).format('YYYY-MM-DD')
        if(req.metode_paid === 'tunai'){
            const kass = (await Kas.query().where('id', req.kas_id).last())?.toJSON()
            req.bank_id = null
            req.kas = kass
            req.coa_id = kass.coa_id
        }else{
            const bank = (await Bank.query().where('id', req.bank_id).last())?.toJSON()
            req.kas_id = null
            req.bank = bank
            req.coa_id = bank.coa_id
        }
        const data = await BayarPelangganHelpers.UPDATE(params, req, user)
        return data
    }

    async printInvoice ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        let data = await OrderPelangganHelpers.SHOW(params)
        let arrItem = []
        let arrContent = []
        arrItem.push([
            {text: 'No.', bold: true, fillColor: '#ddd'},
            {text: 'Kode', bold: true, fillColor: '#ddd'},
            {text: 'Description', bold: true, fillColor: '#ddd'},
            {text: 'Qualitas', bold: true, alignment: 'center', fillColor: '#ddd'},
            {text: 'Qty', bold: true, alignment: 'center', fillColor: '#ddd'},
            {text: 'Harga', bold: true, alignment: 'right', fillColor: '#ddd'},
            {text: 'Jumlah', bold: true, alignment: 'right', fillColor: '#ddd'},
        ])

        
        for (const obj of data.items) {
            arrContent.push([
                {text: obj.barang.num_part, fontSize: 9},
                {text: obj.barang.nama, fontSize: 10},
                {text: obj.barang.qualitas?.nama || '', fontSize: 10, alignment: 'center'},
                {text: obj.qty + ' ' + obj.barang.satuan, fontSize: 10, alignment: 'right'},
                {text: (obj.harga).toLocaleString('ID'), fontSize: 10, alignment: 'right'},
                {text: (obj.total).toLocaleString('ID'), fontSize: 10, alignment: 'right'}
            ])
        }

        for (const obj of data.jasa) {
            arrContent.push([
                {text: obj.jasa.kode, fontSize: 9},
                {text: obj.jasa.nama, fontSize: 10},
                {text: '-', fontSize: 10, alignment: 'right'},
                {text: obj.qty, fontSize: 10, alignment: 'right'},
                {text: (obj.harga).toLocaleString('ID'), fontSize: 10, alignment: 'right'},
                {text: (obj.total).toLocaleString('ID'), fontSize: 10, alignment: 'right'}
            ])
        }
        arrContent = arrContent.map((el, i) => {
            return [{text: i+1, fontSize: 10}, ...el]
        })
        arrItem = [...arrItem, ...arrContent]
        arrItem.push([
            {text: 'Terbilang : ' + await Image64Helpers.pembilang(data.grandtot_trx) + ' Rupiah', fontSize: 10, colSpan: 4, rowSpan: 4},
            {},
            {},
            {},
            {text: 'Total'},
            {text: 'Rp. ' + (data.total_trx).toLocaleString('ID'), colSpan: 2, alignment: 'right'},
            {}
        ])
        arrItem.push([
            {},
            {},
            {},
            {},
            {text: 'Discount'},
            {text: 'Rp. ' + ((data.jasadisc_rp) + (data.barangdisc_rp)).toLocaleString('ID'), colSpan: 2, alignment: 'right'},
            {}
        ])
        arrItem.push([
            {},
            {},
            {},
            {},
            {text: 'Pajak'},
            {text: 'Rp. ' + (data.pajak_trx).toLocaleString('ID'), colSpan: 2, alignment: 'right'},
            {}
        ])
        arrItem.push([
            {},
            {},
            {},
            {},
            {text: 'GrandTotal'},
            {text: 'Rp. ' + (data.grandtot_trx).toLocaleString('ID'), colSpan: 2, alignment: 'right'},
            {}
        ])
        var dd = {
            pageSize: 'A4',
            pageMargins: [ 20, 30, 20, 45 ],
            watermark: { 
                angle: 0,
                fontSize: 50,
                text: 'INVOICE',
                color: 'red',
                angle: -25,
                opacity: 0.3, 
                bold: true, 
                italics: false,
            },
            info: {
                title: 'Invoice Makassar Jaya Marine',
                author: 'ayat ekapoetra',
                subject: 'Makassar Jaya Marine Personal license',
                keywords: 'invoice MJM',
            },
            // footer: { text: 'Right part', alignment: 'left', margin: [10, 20, 15, 10], fontSize: 20, color: 'red' },
            footer: function (currentPage, pageCount) {
                return { text: 'Page  of ', fontSize: 20, color: 'red', alignment: 'center', margin: [10, 20, 15, 10] }
            },
            // footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            // header: function(currentPage, pageCount, pageSize) {
            //     console.log('HEADER :::', currentPage, pageSize);
            //     return [
            //     { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
            //     { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            //     ]
            // },
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
                                widths: [80, '*'],
                                body: [
                                    [
                                        {text: 'Tanggal', bold: true, fontSize: 10},
                                        {text: ':  ' + moment(data.date).format('DD MMMM YYYY'), fontSize: 10}
                                    ],
                                    [
                                        {text: 'Invoice', bold: true, fontSize: 10},
                                        {text: ':  ' + data.kdpesanan, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Pelanggan', bold: true, fontSize: 10},
                                        {text: ':  ' + data.pelanggan.nama, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Kode', bold: true, fontSize: 10},
                                        {text: ':  ' + data.pelanggan.kode, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Alamat Tagih', bold: true, fontSize: 10},
                                        {text: ':  ' + data.pelanggan.alamat_tagih, fontSize: 10}
                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                {text: '\n'},
                {
                    style: 'tableExample',
                    table: {
                        widths: [20, 70, '*', 'auto', 'auto', 'auto', 'auto'],
                        body: arrItem,
                    },
                    layout: 'lightHorizontalLines'
                },
                {text: 'Keterangan :', bold: true},
                {text: 'Barang yang sudah dibeli tidak dapat dikembalikan\nPembayaran secara transfer, check/giro ke bank BCA 3650099949\nAtas Nama: Yunior Thenring/Agung Thenring, ke bank DANAMON 8800070826\nAtas Nama Agung Thenring', italics: true, fontSize: 10},
                {text: '\n\n'},
                {
                    alignment: 'center',
                    columns: [
                        {
                            width: 350,
                            text: 'Dibuat Oleh, ' +'\n\n\n( '+ data.author.nama_lengkap +' )',
                            fontSize: 10,
                            italics: true
                        },
                        {
                            width: 'auto',
                            text: 'Penerima, ' +'\n\n\n( ---------------------- )', 
                            alignment: 'center',
                            fontSize: 10,
                            italics: true
                        }
                    ]
                },
            ]
            
        }
        return dd
    }

    async printKwitansi ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        let data = await BayarPelangganHelpers.KWITANSI(params)
        console.log(data);
        var dd = {
            pageSize: 'A5',
            pageMargins: [ 20, 20 ],
            pageOrientation: 'landscape',
            watermark: { 
                angle: 0,
                fontSize: 40,
                text: ``, 
                color: 'blue', 
                opacity: 0.3, 
                bold: true, 
                italics: false 
            },
            content: [
                {
                    alignment: 'justify',
                    columns: [
                        {
                            width: '*',
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
                                            text: 'Jln.Banda No.87\nMakassar, Sulawesi-Selatan\nIndonesia 90173',
                                            fontSize: 8
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            width: 'auto',
                            margin: [5, 15, 5, 5],
                            style: 'tableExample',
                            table: {
                                widths: [80, '*'],
                                body: [
                                    [
                                        {text: 'Tanggal', bold: true, fontSize: 10},
                                        {text: ': ' + moment(data.date_paid).format('DD MMMM YYYY HH:mm'), fontSize: 10}
                                    ],
                                    [
                                        {text: 'Invoice', bold: true, fontSize: 10},
                                        {text: ': ' + data.no_invoice, fontSize: 10}
                                    ],
                                    [
                                        {text: 'Kwitansi', bold: true, fontSize: 10},
                                        {text: ': ' + data.no_kwitansi, fontSize: 10}
                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 } ]},
                {text: '\n'},
                {text: 'Kwitansi', alignment: 'center', bold: true, fontSize: 25},
                {text: '\n'},
                {
                    style: 'tableExample',
                    table: {
                        widths: ['auto', 20, '*'],
                        body: [
                            [
                                {text: 'Terima dari', bold: true},
                                {text: ':'},
                                {text: data.order.pelanggan.nama, italics: true},
                            ],
                            [
                                {text: 'Sebesar', bold: true},
                                {text: ':'},
                                {text: (data.paid_trx).toLocaleString('ID'), italics: true, bold: true},
                            ],
                            [
                                {text: 'Terbilang', bold: true},
                                {text: ':'},
                                {text: await Image64Helpers.pembilang(data.paid_trx) + ' Rupiah', italics: true},
                            ],
                            [
                                {text: 'Untuk Pembayaran', bold: true},
                                {text: ':'},
                                {text: 'Invoice dengan nomor: ' + data.no_invoice, italics: true},
                            ],
                            [
                                {text: 'Metode Pembayaran', bold: true},
                                {text: ':'},
                                {text: data.metode_paid, italics: true},
                            ],
                        ]
                    },
                    layout: 'noBorders'
                },
                {text: '\n'},
                {
                    alignment: 'justify',
                    columns: [
                        {
                            width: 'auto',
                            text: '\n\nPembayaran dengan cek/giro dianggap sah bila telah dapat dicairkan / dikliringkan.',
                            fontSize: 10,
                            italics: true
                        },
                        {
                            width: 200,
                            text: 'Makassar, ' + moment().format('DD MMMM YYYY') +'\n\n\n\n( '+ data.author.nama_lengkap +' )', alignment: 'center'
                        }
                    ]
                },
            ]
            
        }
        return dd
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

        const data = await BayarPelangganHelpers.INVOICING(params, req, user)
        return data
    }

    async invoicingRollback ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await BayarPelangganHelpers.INVOICING_ROLLBACK(params, user)
        console.log(data);
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
            // req.date = req.delay_date
        }

        const data = await BayarPelangganHelpers.POST(req, user)
        return data
    }

    async multiPayment ( { auth, request } ) {
        const req = request.all()
        console.log(_.isArray(req.paid_trx));
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'not authorized...'
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
        }

        var result = {success: false, message: 'xxx...'}

        if(_.isArray(req.paid_trx)){
            let arrPaid = []
            for (let i = 0; i < req.order_id.length; i++) {
                arrPaid.push({
                    inv_id: req.order_id[i], 
                    paid_trx: req.paid_trx[i],
                    pelanggan_id: req.pelanggan_id,
                    date: req.date,
                    metode_paid: req.metode_paid,
                    delay_date: req.delay_date,
                    kas_id: req.kas_id,
                    bank_id: req.bank_id,
                    narasi: req.narasi,
                    isDelay: req.isDelay || false,
                    bank: req.bank || null,
                    kas: req.kas || null,
                    coa_id: req.coa_id,
                    uniqKey: moment().format('DDMMYYHHmmss')
                })
                
            }
    
            
            let data
            if(req.akun){
                data = [...arrPaid, {...arrPaid[0], akun: req.akun, akun_nilai: req.akun_nilai || null}]
                data = _.sortBy(_.rest(data), 'inv_id');
            }else{
                data = arrPaid
            }
    
            
            for (const obj of data) {
                result = await BayarPelangganHelpers.POST(obj, user)
            }
        }else{
            result = {
                success: false,
                message: 'Form ini hanya untuk melakukan pembayaran dengan multi invoice...'
            }
        }
        

        return result
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

