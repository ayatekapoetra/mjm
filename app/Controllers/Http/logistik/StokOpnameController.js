'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const BarangHelpers = use("App/Helpers/Barang")
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
        return view.render('logistik.stok-opname.item-summary', {data: data})
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