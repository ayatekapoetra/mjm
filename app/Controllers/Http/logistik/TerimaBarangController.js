'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const LogTerimaBarangHelpers = use("App/Helpers/LogTerimaBarang")

class TerimaBarangController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('logistik.terima-barang.index', {
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

        const data = await LogTerimaBarangHelpers.LIST(req, user)
        console.log(data);
        return view.render('logistik.terima-barang.list', {list: data})
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const kode = await initFunc.GEN_KODE_TERIMA_BRG(user.cabang_id)
        // console.log("KODE :::", kode);
        return view.render('logistik.terima-barang.create', {kode: kode})
    }

    async store ( { auth, request } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf']
        }
        const attchment = request.file('photo', validateFile)

        let req = request.all()
        req = JSON.parse(req.dataForm)
        console.log(req);

        if(req.isPemasok === 'Y' && req.reff_rcp === ''){
            return {
                success: false,
                message: 'Barang masuk dari pemasok\nHarus memiliki nomor faktur...'
            }
        }

        const data = await LogTerimaBarangHelpers.POST(req, user, attchment)
        return data
    }

    async print ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await LogTerimaBarangHelpers.PRINT(params)
        const logoAsBase64 = await Image64Helpers.GEN_BASE64(logoPath)
        const result = await GENPDF_TANDATERIMA(data, logoAsBase64)
        // console.log(result);
        return result
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await LogTerimaBarangHelpers.DELETE(params)
        return data
    }

    async addItem ( { view } ) {
        return view.render('components.items.terima-barang.item-details')
    }
}

module.exports = TerimaBarangController

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

function GENPDF_TANDATERIMA(data, logo){
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
            text: 'Penerimaan Barang',
            color: 'blue',
            angle: 0,
            opacity: 0.3, 
            bold: true, 
            italics: false,
        },
        info: {
            title: 'Penerimaan Barang Makassar Jaya Marine',
            author: 'ayat ekapoetra',
            subject: 'Makassar Jaya Marine Personal license',
            keywords: 'Penerimaan Barang MJM',
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
                                    {text: 'Tanggal', bold: true, fontSize: 10},
                                    {text: ':  ' + moment(data.received_at).format('DD MMMM YYYY'), fontSize: 10}
                                ],
                                [
                                    {text: 'No.Faktur', bold: true, fontSize: 10},
                                    {text: ':  ' + data.reff_rcp, fontSize: 10}
                                ],
                                [
                                    {text: 'No.Request', bold: true, fontSize: 10},
                                    {text: ':  ' + data.purchasing.kode, fontSize: 10}
                                ],
                                [
                                    {text: 'Pemasok', bold: true, fontSize: 10},
                                    {text: ':  ' + data.pemasok.nama, fontSize: 10}
                                ],
                                [
                                    {text: 'Kode', bold: true, fontSize: 10},
                                    {text: ':  ' + data.pemasok.kode, fontSize: 10}
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
            {text: '\n\n'},
            {
                alignment: 'right',
                columns: [
                    {
                        width: '*',
                        text: 'Print at, \n' + moment().format('DD MMM YYYY') + '\n\n\n( '+ data.penerima.nama_lengkap +' )',
                        fontSize: 10,
                        italics: true
                    }
                ]
            }
        ]
        
    }

    return dd
}