'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
moment.locale("ID")
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const BarangHelpers = use("App/Helpers/Barang")
const DefCoa = use("App/Models/DefCoa")
const Opname = use("App/Models/logistik/LogistikStokOpname")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const LogStokOpnameHelpers = use("App/Helpers/LogStokOpname")

class StokOpnameController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('logistik.stok-opname.index', {
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
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.LIST(req, user)
        return view.render('logistik.stok-opname.list', {list: data})
    }

    async create ( { auth, view } ) {
        return view.render('logistik.stok-opname.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }
        const data = await LogStokOpnameHelpers.SHOW(params)
        return view.render('logistik.stok-opname.show', {data: data})
    }

    async showSummary ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }
        let data = await LogStokOpnameHelpers.SUMMARY(params)
        data = data.map( v => {
            return {
                ...v,
                date_opname: moment(v.date_opname).format('dddd, DD-MM-YYYY')
            }
        })
        console.log(data);
        return view.render('logistik.stok-opname.item-summary', {
            data: data,
            params: params.id
        })
    }

    async autoJurnal ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const sdhJurnal = await Opname.query().where('id', params.id).last()
        if(sdhJurnal.auto_jurnal === 'Y'){
            return {
                success: false,
                message: 'Data sudah ini sudah melakukan auto jurnal pada hari ' + 
                moment(sdhJurnal.jurnal_date).format("dddd, DD MMMM YYYY") +
                '\nPukul ' +
                moment(sdhJurnal.jurnal_date).format("HH:mm A")
            }
        }

        let data = await LogStokOpnameHelpers.SUMMARY(params)

        data = data.filter( v => v.variences != '0.00')

        const trx = await DB.beginTransaction()
        for (const val of data) {
            const hargaBeli = await HargaBeli.query().where( w => {
                w.where('barang_id', val.barang_id)
                w.where('gudang_id', val.gudang_id)
            }).getAvg('harga_beli') || 0

            
            if(hargaBeli <= 0){
                return {
                    success: false,
                    message: 'Harga beli ' + val.barang?.nama + ' \npada ' + val.gudang?.nama + ' \ntidak ditemukan...'
                }
            }

            /**
             * JIKA ITEM CHEATING
             * Maka Jurnal Debit pada Beban Lain2 & Jurnal Kredit pada Persediaan
             * **/ 
            if(val.variences < 0){
                const initOpnameMinus = (await DefCoa.query().where('group', 'auto-jurnal-opname-minus').fetch()).toJSON()
                for (const obj of initOpnameMinus) {
                    const MinJurnal = new TrxJurnal()
                    MinJurnal.fill({
                        createdby: user.id,
                        cabang_id: val.cabang_id,
                        coa_id: obj.coa_id,
                        reff: val.kode,
                        narasi: '[ ' + val.kode + ' ] ' + obj.description,
                        trx_date: new Date(),
                        nilai: hargaBeli * (val.variences * -1),
                        dk: obj.tipe,
                        is_delay: 'N',
                        barang_id: val.barang_id
                    })

                    try {
                        await MinJurnal.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: "Error jurnal " + val.barang?.nama
                        }
                    }
                }

            }

            /**
             * JIKA ITEM OVER
             * Maka Jurnal Debit pada Persediaan & Jurnal Kredit pada Pendapatan Lain2
             * **/ 
            if(val.variences > 0){
                const initOpnamePlus = (await DefCoa.query().where('group', 'auto-jurnal-opname-plus').fetch()).toJSON()
                for (const obj of initOpnamePlus) {
                    const PlusJurnal = new TrxJurnal()
                    PlusJurnal.fill({
                        createdby: user.id,
                        cabang_id: val.cabang_id,
                        coa_id: obj.coa_id,
                        reff: val.kode,
                        narasi: '[ ' + val.kode + ' ] ' + obj.description,
                        trx_date: new Date(),
                        nilai: hargaBeli * val.variences,
                        dk: obj.tipe,
                        is_delay: 'N',
                        barang_id: val.barang_id
                    })

                    try {
                        await PlusJurnal.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: "Error jurnal " + val.barang?.nama
                        }
                    }
                }
            }
        }

        /**
         * UPDATE DATA STOK OPNAME
         * **/ 
        const updStokOpname = await Opname.query().where('id', params.id).last()
        updStokOpname.merge({
            auto_jurnal: 'Y',
            jurnalby: user.id,
            jurnal_date: new Date()
        })

        try {
            await updStokOpname.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: "Error update data opname setelah melakukan jurnal"
            }
        }

        await trx.commit()
        return {
            success: true,
            message: "Auto Jurnal Berhasil dilakukan..."
        }
    }
    
    async addItem ( { view } ) {
        const req = {}
        req.limit = 10000
        const { data } = await BarangHelpers.LIST(req)
        return view.render('logistik.stok-opname.item-details', {barang: data})
    }

    async store ( { auth, request, view } ) {
        let req = request.all()
        req = JSON.parse(req.dataForm)
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.POST(req, user)
        return data
    }

    async update ( { auth, params, request, view } ) {
        let req = request.all()
        req = JSON.parse(req.dataForm)
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.DELETE(params)
        return data
    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        const result = await GENPDF_SUMMARY_STOKOPNAME(data, logoAsBase64)
        return result
    }

}

module.exports = StokOpnameController

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

async function GENPDF_SUMMARY_STOKOPNAME(data, logo){
    let body = []

    body.push([
        {text: 'No', bold: true, fillColor: '#ddd'},
        {text: 'Kode', bold: true, fillColor: '#ddd'},
        {text: 'Barang', bold: true, fillColor: '#ddd'},
        {text: 'Stn', bold: true, fillColor: '#ddd'},
        {text: 'opname', bold: true, fillColor: '#ddd', alignment: 'right'},
        {text: 'hand', bold: true, fillColor: '#ddd', alignment: 'right'},
        {text: 'Diff', bold: true, fillColor: '#ddd', alignment: 'right'},
    ])

    for (const [i, obj] of data.entries()) {
        body.push([
            {text: i+1},
            {text: obj.barang.kode+'\n'+obj.barang.num_part, fontSize: 9},
            {text: obj.barang.nama},
            {text: obj.barang.satuan},
            {text: obj.qty_opname, alignment: 'right'},
            {text: obj.qty_onhand, alignment: 'right'},
            {text: obj.variences, alignment: 'right', fillColor: obj.variences != 0 ? '#faebd7':'#fff'},
        ])
    }
    

    var dd = {
        pageSize: 'A4',
        pageMargins: [ 20, 30, 20, 45 ],
        watermark: { 
            angle: 0,
            fontSize: 50,
            text: 'Stok Opname',
            color: 'blue',
            angle: 0,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Stok Opname Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Stok Opname MJM',
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
                            widths: [100, '*'],
                            body: [
                                [
                                    {text: 'Kode', bold: true, fontSize: 10},
                                    {text: ':  '+ data[0].kode, fontSize: 10}
                                ],
                                [
                                    {text: 'Cabang', bold: true, fontSize: 10},
                                    {text: ':  '+ data[0].cabang.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Gudang', bold: true, fontSize: 10},
                                    {text: ':  '+ data[0].gudang.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Tanggal Opname', bold: true, fontSize: 10},
                                    {text: ':  '+ moment(data[0].date_opname).format('dddd, DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'CreatedBy', bold: true, fontSize: 10},
                                    {text: ':  '+ data[0].createdby.nama_lengkap, fontSize: 10}
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
                    widths: [30, 'auto', '*', 'auto', 'auto', 'auto', 30],
                    body: body
                },
                layout: 'lightHorizontalLines'
            },
            {text: '\n\n'},
            {
                alignment: 'right',
                columns: [
                    {
                        width: '*',
                        text: 'Print at, ' + moment().format('dddd, DD MMMM YYYY [Pukul :] HH:mm:ss A'),
                        fontSize: 10,
                        italics: true
                    }
                ]
            }
        ]
        
    }

    return dd
}