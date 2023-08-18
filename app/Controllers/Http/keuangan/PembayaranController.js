'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const _ = require('underscore')
const Kas = use("App/Models/akunting/Kas")
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Bank = use("App/Models/akunting/Bank")
const SysConfig = use("App/Models/SysConfig")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const logoPath = Helpers.publicPath('logo.png')
const Pemasok = use("App/Models/master/Pemasok")
const AccCoa = use("App/Models/akunting/AccCoa")
const Pelanggan = use("App/Models/master/Pelanggan")
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuPembayaranHelpers = use("App/Helpers/KeuPembayaran")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")
const BayarPelangganHelpers = use("App/Helpers/BayarPelanggan")
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")


// var 

class PembayaranController {
    async index ( { auth, view } ) {
        let user
        await initFunc.SUM_PEMBAYARAN_PELANGGAN()
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.pembayaran.index', {
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

        const data = await KeuPembayaranHelpers.LIST(req)
        return view.render('keuangan.pembayaran.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('keuangan.pembayaran.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuPembayaranHelpers.SHOW(params)
        console.log(data);

        return view.render('keuangan.pembayaran.show', {data: data})
    }

    async showItems ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let coaAkun = (await AccCoa.query().orderBy('id', 'asc').fetch()).toJSON()
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'bank' )
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'kas' )

        let data = _.groupBy(coaAkun, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })

        const result = await KeuPembayaranHelpers.SHOWITEMS(params)

        const barang = (await Barang.query().with('kategori').where('aktif', 'Y').fetch()).toJSON()
        const pelanggan = (await Pelanggan.query().where('aktif', 'Y').fetch()).toJSON()
        const pemasok = (await Pemasok.query().where('aktif', 'Y').fetch()).toJSON()
        const gudang = (await Gudang.query().where('aktif', 'Y').fetch()).toJSON()
        
        let keuFakturPembelian = (await KeuFakturPembelian.query().where( w => {
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        let opsPelangganOrder = (await OpsPelangganOrder.query().where( w => {
            w.where('status', '<>', 'lunas')
        }).fetch()).toJSON()
        
        var html = result.items.map( (obj, i) => {
            if(obj.pemasok_id){
                keuFakturPembelian = keuFakturPembelian.filter(el => el.pemasok_id === obj.pemasok_id)
                console.log(obj.trx_beli);
                var detailFiled = 
                '<div class="col-md-6 m-b-15">'+
                '    <label for="">Pemasok <span class="text-danger">*</span></label>'+
                '    <select class="form-control item-data-details" name="pemasok_id" data-values="">'+
                '        <option value="">Pilih Pemasok</option>'+
                         pemasok.map(el => '<option value="'+el.id+'" '+`${obj.pemasok_id === el.id ? "selected":""}`+'>'+el.nama+'</option>')+
                '    </select>'+
                '</div>'+
                '<div class="col-md-6 m-b-15">'+
                '    <label for="">Faktur Pembelian <span class="text-danger">*</span></label>'+
                '    <select class="form-control item-data-details" name="trx_beli" data-values="">'+
                '        <option value="">Pilih</option>'+
                         keuFakturPembelian.map(el => '<option value="'+el.id+'" '+`${obj.trx_beli === el.id ? "selected":""}`+'>'+el.kode+' -----> Sisa Rp. '+(el.sisa).toLocaleString('ID')+'</option>')+
                '    </select>'+
                '</div>'
            }
            if(obj.pelanggan_id){
                opsPelangganOrder = opsPelangganOrder.filter(el => el.pelanggan_id === obj.pelanggan_id)
                var detailFiled = 
                '<div class="col-md-6 m-b-15">'+
                '    <label for="">Pelanggan <span class="text-danger">*</span></label>'+
                '    <select class="form-control item-data-details" name="pelanggan_id" data-values="">'+
                '        <option value="">Pilih Pelanggan</option>'+
                         pelanggan.map(el => '<option value="'+el.id+'" '+`${obj.pelanggan_id === el.id ? "selected":""}`+'>['+el.kode+'] '+el.nama+'</option>')+
                '    </select>'+
                '</div>'+
                '<div class="col-md-6 m-b-15">'+
                '    <label for="">Faktur Pembelian <span class="text-danger">*</span></label>'+
                '    <select class="form-control item-data-details" name="trx_jual" data-values="">'+
                '        <option value="">Pilih</option>'+
                         opsPelangganOrder.map(el => '<option value="'+el.id+'" '+`${obj.trx_jual === el.id ? "selected":""}`+'>'+el.kdpesanan+' -----> Sisa Rp. '+(el.sisa_trx).toLocaleString('ID')+'</option>')+
                '    </select>'+
                '</div>'
            }

            if(obj.barang_id){
                var detailFiled = 
                '<div class="col-md-6 m-b-15">'+
                '    <label for="">Gudang <span class="text-danger">*</span></label>'+
                '    <select class="form-control item-data-details" name="gudang_id" data-values="">'+
                '        <option value="">Pilih Gudang</option>'+
                         gudang.map(el => '<option value="'+el.id+'" '+`${obj.gudang_id === el.id ? "selected":""}`+'>['+el.kode+'] '+el.nama+'</option>')+
                '    </select>'+
                '</div>'
            }

            return '<tr class="item-rows" data-pemasok="'+obj.pemasok_id+'" data-pelanggan="'+obj.pelanggan_id+'" data-faktur="'+obj.trx_beli+'" data-invoice="'+obj.trx_jual+'">'+
            '<td>'+
            '    <h3 class="urut-rows">'+(i + 1)+'</h3>'+
            '    <input type="hidden" class="" name="id" value="'+obj.id+'">'+
            '</td>'+
            '<td class="b-all">'+
            '    <div class="row">'+
            '        <div class="col-md-6">'+
            '            <label for="">Barang</label>'+
            '            <div class="input-group">'+
            '                <span class="input-group-btn">'+
            '                    <button class="btn btn-danger bt-remove-item" type="button">'+
            '                        <i class="fa fa-trash"></i>'+
            '                    </button>'+
            '                </span>'+
            '                <select class="form-control item-data-details selectBarang" name="barang_id" data-values="'+obj.barang_id+'" id="">'+
            '                <option value="">Pilih Barang</option>'+
                                barang.map(item => '<option value="'+item.id+'" '+`${obj.barang_id === item.id ? "selected":""}`+'>[ '+item.num_part+ ' ] '+item.nama+'</option>') +
            '                </select>'+
            '                <span class="input-group-addon satuan"></span>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-6">'+
            '            <div class="form-group">'+
            '                <label for="">Akun</label>'+
            '                <select class="form-control selectCoaDebit item-data-details" name="coa_debit" data-values="'+obj.coa_debit+'">'+
            '                <option value="">Pilih Akun</option>'+
                                data.map( grp => '<optgroup label="'+grp.tipe+'">'+grp.items.map( val => '<option value="'+val.id+'" '+`${obj.coa_debit === val.id ? "selected":""}`+'>'+val.coa_name+'</option>')+'</optgroup>')+
            '                </select>'+
            '            </div>'+
            '        </div>'+
            '        <div class="m-b-10" name="details-akun">'+detailFiled+'</div>'+
            '        <div class="col-md-2">'+
            '            <div class="form-group">'+
            '                <label for="">Qty <span class="text-danger">*</span></label>'+
            '                <input type="number" class="form-control item-data-details item-details" name="qty" id="" value="'+obj.qty+'" required>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-4">'+
            '            <div class="form-group">'+
            '                <label for="">Harga Stn <span class="text-danger">*</span></label>'+
            '                <input type="number" class="form-control item-data-details item-details" name="harga_stn" id="" value="'+obj.harga_stn+'" required>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-4">'+
            '            <div class="form-group">'+
            '                <label for="">Harga Total</label>'+
            '                <input type="number" class="form-control text-right item-data-details item-details" name="subtotal" id="" value="'+obj.harga_total+'" readonly>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-6">'+
            '            <div class="form-group">'+
            '                <label for="">Narasi</label>'+
            '                <input type="text" class="form-control item-data-details item-details" name="description" value="'+obj.narasi+'">'+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '</td>'+
        '</tr>'
        });
        return html
    }

    async addItem ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let coaAkun = (await AccCoa.query().orderBy('id', 'asc').fetch()).toJSON()
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'bank' )
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'kas' )

        let data = _.groupBy(coaAkun, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })

        const barang = (await Barang.query().with('kategori').where('aktif', 'Y').fetch()).toJSON()
        var html = 
        '<tr class="item-rows">'+
            '<td>'+
            '    <h3 class="urut-rows"></h3>'+
            '    <input type="hidden" class="" name="id" value="">'+
            '</td>'+
            '<td class="b-all">'+
            '    <div class="row">'+
            '        <div class="col-md-6">'+
            '            <label for="">Barang</label>'+
            '            <div class="input-group">'+
            '                <span class="input-group-btn">'+
            '                    <button class="btn btn-danger bt-remove-item" type="button">'+
            '                        <i class="fa fa-trash"></i>'+
            '                    </button>'+
            '                </span>'+
            '                <select class="form-control item-data-details selectBarang" name="barang_id" data-values="" id="">'+
            '                <option value="">Pilih Barang</option>'+
                                barang.map(item => '<option value="'+item.id+'">[ '+item.num_part+ ' ] '+item.nama+'</option>') +
            '                </select>'+
            '                <span class="input-group-addon satuan"></span>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-6">'+
            '            <div class="form-group">'+
            '                <label for="">Akun</label>'+
            '                <select class="form-control selectCoaDebit item-data-details" name="coa_debit" data-values="">'+
            '                <option value="">Pilih Akun</option>'+
                                data.map( grp => '<optgroup label="'+grp.tipe+'">'+grp.items.map( val => '<option value="'+val.id+'">'+val.coa_name+'</option>')+'</optgroup>')+
            '                </select>'+
            '            </div>'+
            '        </div>'+
            '        <div name="details-akun"></div>'+
            '        <div class="col-md-2">'+
            '            <div class="form-group">'+
            '                <label for="">Qty <span class="text-danger">*</span></label>'+
            '                <input type="number" class="form-control item-data-details item-details" name="qty" id="" value="1" required>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-4">'+
            '            <div class="form-group">'+
            '                <label for="">Harga Stn <span class="text-danger">*</span></label>'+
            '                <input type="number" class="form-control item-data-details item-details" name="harga_stn" id="" value="0" required>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-4">'+
            '            <div class="form-group">'+
            '                <label for="">Harga Total</label>'+
            '                <input type="number" class="form-control text-right item-data-details item-details" name="subtotal" id="" value="0" readonly>'+
            '            </div>'+
            '        </div>'+
            '        <div class="col-md-6">'+
            '            <div class="form-group">'+
            '                <label for="">Narasi</label>'+
            '                <input type="text" class="form-control item-data-details item-details" name="description" value="">'+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '</td>'+
        '</tr>';
        return html
    }

    async store ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        req.items = JSON.parse(req.items)?.items || null

        

        if (!req.trx_date) {
            return {
                success: false,
                message: 'Tanggal transaksi blum di tentukan...'
            }
        }

        if (!req.coa_kredit) {
            return {
                success: false,
                message: 'Akun Kredit transaksi blum di tentukan...'
            }
        }

        if (!req.cabang_id) {
            return {
                success: false,
                message: 'Cabang blum di tentukan...'
            }
        }

        if(req.due_date && moment(req.trx_date).isAfter(moment(req.due_date))){
            return {
                success: false,
                message: 'Tanggal jatuh tempo harus lebih besar dari tanggal transaksi...'
            }
        }
        
        for (const val of req.items) {
            if (val.pemasok_id && !req.trx_beli) {
                return {
                    success: false,
                    message: 'Faktur pembelian transaksi blum di tentukan...'
                }
            }

            if (val.pelanggan_id && !req.trx_jual) {
                return {
                    success: false,
                    message: 'Faktur penjualan transaksi blum di tentukan...'
                }
            }

            if (val.barang_id && !req.gudang_id) {
                return {
                    success: false,
                    message: 'Gudang transaksi blum di tentukan...'
                }
            }

            if (!val.coa_debit) {
                return {
                    success: false,
                    message: 'Akun Debit transaksi blum di tentukan...'
                }
            }

            if (!val.qty) {
                return {
                    success: false,
                    message: 'Qty transaksi blum di tentukan...'
                }
            }

            if (!val.harga_stn) {
                return {
                    success: false,
                    message: 'Harga Satuan transaksi blum di tentukan...'
                }
            }

            
        }

        req.reff = req.reff || await initFunc.GENKODE_KEU_PEMBAYARAN(req)

        // req.is_delay = moment(req.trx_date).isSame(moment(req.due_date)) ? 'N':'Y'

        req.subtotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)

        const bank = await Bank.query().where('id', req.coa_kredit).last()
        const kas = await Kas.query().where('id', req.coa_kredit).last()


        if(req.is_delay === 'Y' && !req.due_date){
            return {
                success: false,
                message: 'Tanggal tunda blum di tentukan...'
            }
        }

        if(bank){
            req.bank_id = req.coa_kredit
            req.kas_id = null
        }

        if(kas){
            req.kas_id = req.coa_kredit
            req.bank_id = null
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        const attach = request.file('lampiran', validateFile)

        const data = await KeuPembayaranHelpers.POST(req, user, attach)

        return data
    }

    async update ( { auth, params, request } ) {
        const req = request.all()

        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        req.items = JSON.parse(req.items)?.items || null

        /**
         * Validation Request Input
         * **/


        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal transaksi tdk valid...'
            }
        }

        if(!req.reff){
            return {
                success: false,
                message: 'Referensi transaksi tdk valid...'
            }
        }

        if(!req.coa_kredit){
            return {
                success: false,
                message: 'Akun Kredit transaksi tdk valid...'
            }
        }

        for (const obj of req.items) {
            if(!obj.coa_debit){
                return {
                    success: false,
                    message: 'Akun Debit blum di tentukan...'
                }
            }
            if(!obj.harga_stn){
                return {
                    success: false,
                    message: 'Harga satuan tidak valid...'
                }
            }
            if(!obj.qty || obj.qty < 1){
                return {
                    success: false,
                    message: 'Quantity tidak valid...'
                }
            }
            if(obj.barang_id && !obj.gudang_id){
                return {
                    success: false,
                    message: 'Barang ditemukan namun gudang blum di tentukan...'
                }
            }
            if(obj.pemasok_id && !obj.trx_beli){
                return {
                    success: false,
                    message: 'Pemasok ditemukan namun faktur pembelian blum di tentukan...'
                }
            }
            if(obj.pelanggan_id && !obj.trx_jual){
                return {
                    success: false,
                    message: 'Pelanggan ditemukan namun invoices penjualn blum di tentukan...'
                }
            }
        }

        // req.is_delay = moment(req.trx_date).isSame(moment(req.due_date)) ? 'N':'Y'

        req.subtotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)

        const bank = await Bank.query().where('id', req.coa_kredit).last()
        const kas = await Kas.query().where('id', req.coa_kredit).last()

        req.is_delay = req.is_delay ? 'N' : 'Y'

        if(req.is_delay === 'Y' && !req.due_date){
            return {
                success: false,
                message: 'Tanggal tunda blum di tentukan...'
            }
        }

        if(bank){
            req.bank_id = req.coa_kredit
            req.kas_id = null
        }

        if(kas){
            req.kas_id = req.coa_kredit
            req.bank_id = null
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        const attach = request.file('lampiran', validateFile)
        const data = await KeuPembayaranHelpers.UPDATE(params, req, user, attach)

        return data
    }

    async destroy ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        await initFunc.SUM_PEMBAYARAN_PELANGGAN()
        const data = await KeuPembayaranHelpers.DELETE(params)
        return data
    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuPembayaranHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        const result = await GEN_PEMBAYARAN_PDF(data, logoAsBase64)
        console.log(data);
        console.log(data.items);
        return result
    }
}

module.exports = PembayaranController

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

async function GEN_PEMBAYARAN_PDF(data, logo){
    let body = []
    body.push([
        {text: 'No', fillColor: '#C4C4C4', bold: true},
        {text: 'Keterangan Items', fillColor: '#C4C4C4', bold: true},
        {text: 'Qty', alignment: 'right', fillColor: '#C4C4C4', bold: true},
        {text: 'Harga', alignment: 'right', fillColor: '#C4C4C4', bold: true},
        {text: 'Total', alignment: 'right', fillColor: '#C4C4C4', bold: true}
    ])

    for (const [i, val] of data.items.entries()) {
        if(val.barang_id){
            body.push(
                [
                    {text: `${i + 1}`},
                    {text: [
                        {text: `${val.coaDebit.coa_name}\n`},
                        {text: `${val.barang?.nama}`, fontSize: 9},
                    ]},
                    {text: `${val.qty}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_stn)?.toLocaleString('ID')}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_total)?.toLocaleString('ID')}`, alignment: 'right'},
                ]
            )
        } else
        if(val.trx_beli){
            body.push(
                [
                    {text: `${i + 1}`},
                    {text: [
                        {text: `${val.coaDebit.coa_name}\n`},
                        {text:  `${val.trxPembelian?.kode} - ${val.narasi || 'tanpa keterangan'}`, fontSize: 9}
                    ]},
                    {text: `${val.qty}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_stn)?.toLocaleString('ID')}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_total)?.toLocaleString('ID')}`, alignment: 'right'},
                ]
            )
        } else
        if(val.trx_jual){
            body.push(
                [
                    {text: `${i + 1}`},
                    {text: [
                        {text: `${val.coaDebit.coa_name}\n`},
                        {text: `${val.trxPenjualan?.kdpesanan} - ${val.narasi || 'tanpa keterangan'}`, fontSize: 9},
                    ]},
                    {text: `${val.qty}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_stn)?.toLocaleString('ID')}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_total)?.toLocaleString('ID')}`, alignment: 'right'},
                ]
            )
        } else {
            body.push(
                [
                    {text: `${i + 1}`},
                    {text: `${val.coaDebit.coa_name} - ${val.narasi || 'tanpa keterangan'}`},
                    {text: `${val.qty}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_stn)?.toLocaleString('ID')}`, alignment: 'right'},
                    {text: `Rp. ${(val.harga_total)?.toLocaleString('ID')}`, alignment: 'right'},
                ]
            )
        }
    }

    body.push(
        [
            {text: `Total`, bold: true, colSpan: 4, fillColor: '#ddd', alignment: 'right'},
            {},
            {},
            {},
            {text: `Rp. ${(data.total)?.toLocaleString('ID')}`, alignment: 'right', fillColor: '#ddd'},
        ]
    )

    var dd = {
        pageSize: 'A4',
        pageMargins: [ 20, 30, 20, 45 ],
        watermark: { 
            angle: 0,
            fontSize: 50,
            text: 'PAID',
            color: 'red',
            // angle: -25,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Pembayaran Keuangan Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Pembayaran Keuangan MJM',
        },
        content: [
            {
                alignment: 'justify',
                columns: [
                    {
                        width: 150,
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
                            widths: [120, '*'],
                            body: [
                                [
                                    {text: 'Kode Pembayaran', bold: true, fontSize: 10},
                                    {text: ':  ' + data.reff, fontSize: 10}
                                ],
                                [
                                    {text: 'Tanggal Faktur', bold: true, fontSize: 10},
                                    {text: ':  ' + moment(data.trx_date).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'Jatuh Tempo', bold: true, fontSize: 10},
                                    {text: ':  ' + `${data.delay_trx ? moment(data.delay_trx).format('DD MMMM YYYY') : '-'}`, fontSize: 10}
                                ],
                                [
                                    {text: 'Cabang', bold: true, fontSize: 10},
                                    {text: ':  ' + data.cabang.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Pembayaran dari', bold: true, fontSize: 10},
                                    {text: ':  ' + data.coaKredit.coa_name, fontSize: 10}
                                ],
                                [
                                    {text: 'Keterangan', bold: true, fontSize: 10},
                                    {text: ':  ' + data.narasi}
                                ],
                                [
                                    {text: ''},
                                    {text: ''}
                                ],
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    
                ]
            },
            {text: '\n'},
            {
                style: 'tableExample',
                table: {
                    widths: [20, '*', 30, 'auto', 'auto'],
                    body: body
                },
                // layout: 'noBorders'
                layout: 'lightHorizontalLines'
            }
        ]
        
    }

    return dd
}