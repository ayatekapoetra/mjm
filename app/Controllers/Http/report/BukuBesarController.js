'use strict'

const Helpers = use('Helpers')
const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
moment.locale('ID')
const initMenu = use("App/Helpers/_sidebar")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")

const jsonrawtoxlsx = require('jsonrawtoxlsx');
const fs = require('fs');


class BukuBesarController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)

            const coa = (await AccCoa.query().fetch()).toJSON()
            let data = _.groupBy(coa, 'coa_tipe_nm')
            data = Object.keys(data).map(key => {
                return {
                    tipe: key,
                    items: data[key]
                }
            })
            return view.render('report.buku-besar.index', {
                menu: sideMenu,
                akun: data
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

        // console.log(req);
        // const cummulative = (await TrxJurnal.query().where( w => {
        //     w.where('aktif', 'Y')
        //     w.where('coa_id', req.coa_id)
        // }).orderBy('urut', 'asc').fetch()).toJSON()

        // for (const obj of cummulative) {
        //     console.log(obj.id);
        // }

        // var tmp = []
        // var tot = []
        // var sum = []
        // for (const [i, val] of cummulative.entries()) {
        //     tmp.push(val.id)
        //     if(val.dk === 'd'){
        //         tot.push(val.nilai)
        //     }else{
        //         tot.push((val.nilai)*-1)
        //     }
            
        //     sum.push({
        //         id: val.id,
        //         total: tot.reduce((a, b) => { return a + b }, 0)
        //     })
        // }

        // for (const val of sum) {
        //     const upd = await TrxJurnal.query().where('id', val.id).last()
        //     upd.merge({total: val.total})
        //     await upd.save()
        // }





        // let arrData = (
        //     await TrxJurnal.query().where( w => {
        //         w.where('aktif', 'Y')
        //         // w.where('coa_id', req.coa_id)
        //     }).orderBy('trx_date', 'asc').fetch()
        // ).toJSON()

        // arrData = _.groupBy(arrData, 'trx_date')
        // arrData = Object.keys(arrData).map( key => {
        //     return {
        //         urut: moment(key).format('YYMMDDHHmmssSSS'),
        //         items: arrData[key]
        //     }
        // })

        // let array = []
        // for (const obj of arrData) {
        //     if (obj.items.length > 1) {
        //         array.push(obj)
        //     }
        // }

        // console.log(array);

        // for (const obj of array) {
        //     for (const [i, val] of (obj.items).entries()) {
        //         const trxJurnalUrut = await TrxJurnal.query().where('id', val.id).last()
        //         trxJurnalUrut.merge({urut: parseInt(trxJurnalUrut.urut) + i})

        //         await trxJurnalUrut.save()
        //     }
        // }

        // // await rekonsiliasiSaldo()
        
        // for (const obj of array) {
        //     for (const [i, val] of (obj.items).entries()) {
        //         let string = '0'.repeat(9 - `${i}`.length) + i
        //         const updData = await TrxJurnal.query().where('id', val.id).last()
        //         var urut = moment(val.trx_date).format('YYMMDD['+string+']')

        //         updData.merge({urut: urut})
        //         await updData.save()
                
        //     }
        // }
        // console.log(array);



        let data = (
            await TrxJurnal.query().where( w => {
                w.where('aktif', 'Y')
                w.where('coa_id', req.coa_id)
                w.where('trx_date', '>=', req.beginDate)
                w.where('trx_date', '<=', req.finishDate)
            }).orderBy([
                {column: 'urut', order: 'asc'},
                {column: 'trx_date', order: 'asc'},
            ]).fetch()
        ).toJSON()

        // let dataArr = (
        //     await TrxJurnal.query().where( w => {
        //         w.where('aktif', 'Y')
        //         // w.where('coa_id', req.coa_id)
        //         w.where('trx_date', '>=', req.beginDate)
        //         w.where('trx_date', '<=', req.finishDate)
        //     }).orderBy('trx_date', 'asc').fetch()
        // ).toJSON()

        // for (const obj of data) {
        //     const upd = await TrxJurnal.query().where('id', obj.id).last()
        //     upd.merge({narasi: upd.narasi})
        //     await upd.save()
        // }

        data = data.map( v => {
            var nilai_rp = parseFloat((v.nilai)?.toFixed(2))
            return {
                ...v, 
                tanggal: moment(v.trx_date).format('dddd, DD MMMM YYYY'),
                nilai_rp: (v.nilai)?.toLocaleString('ID'),
                saldo_rp: (parseInt(v.saldo))?.toLocaleString('ID')
            }
        })

        return view.render('report.buku-besar.list', {
            list: data
        })
    }

    async printPDF ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        

        let data = (
            await TrxJurnal.query().where( w => {
                w.where('aktif', 'Y')
                w.where('coa_id', req.coa_id)
                w.where('trx_date', '>=', req.beginDate)
                w.where('trx_date', '<=', req.finishDate)
            }).orderBy('trx_date', 'asc').fetch()
        ).toJSON()

        data = data.map( v => ({
            ...v, 
            tanggal: moment(v.trx_date).format('dddd, DD MMMM YYYY'),
            nilai_rp: (v.nilai)?.toLocaleString('ID'),
            saldo_rp: (v.saldo)?.toLocaleString('ID')
        }))

        const logo = await Image64Helpers.GEN_BASE64(logoPath)

        console.log(data);

        let body = []
        body.push([
            {text: 'No', bold: true, fillColor: '#ddd', alignment: 'center'},
            {text: 'Kode', bold: true, fillColor: '#ddd'},
            {text: 'Tanggal', bold: true, fillColor: '#ddd'},
            {text: 'Keterangan', bold: true, fillColor: '#ddd'},
            {text: 'debit', bold: true, fillColor: '#ddd', alignment: 'right'},
            {text: 'kredit', bold: true, fillColor: '#ddd', alignment: 'right'},
            {text: 'Saldo', bold: true, fillColor: '#ddd', alignment: 'right'},
        ])

        for (const [i, obj] of data.entries()) {
            body.push([
                {text: i+1, fontSize: 9, alignment: 'right'},
                {text: obj.coa_id, fontSize: 9},
                {text: moment(obj.trx_date).format('DD-MM-YYYY'), fontSize: 9},
                {text: obj.narasi, fontSize: 9},
                {text: obj.dk === 'd' ? `Rp. ${(obj.nilai).toLocaleString('ID')},-`:0, alignment: 'right', fontSize: 9},
                {text: obj.dk === 'k' ? `${(obj.nilai).toLocaleString('ID')},-`:0, alignment: 'right', fontSize: 9},
                {text: `Rp. ${(obj.saldo).toLocaleString('ID')},-`, alignment: 'right', fontSize: 9},
            ])
        }

        var dd = {
            pageSize: 'A4',
            pageMargins: [ 20, 30, 20, 45 ],
            info: {
                title: 'Buku Besar Makassar Jaya Marine',
                author: 'ayat ekapoetra',
                subject: 'Makassar Jaya Marine Personal license',
                keywords: 'Buku Besar MJM',
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
                                        },
                                    ],
                                    [
                                        {
                                            text: 'Jln.Banda No.87\nMakassar, Sulawesi-Selatan\nIndonesia 90173\n0411 3630014\n0813 1196 799',
                                            fontSize: 8
                                        },
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
                                widths: ['*'],
                                body: [
                                    [
                                        {text: 'Laporan Buku Besar', bold: true, fontSize: 20, alignment: 'right'}
                                    ],
                                    [
                                        {text: 'Periode', bold: true, fontSize: 10, alignment: 'right'},
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
                        headerRows: 1,
                        widths: ['auto', 30, 'auto', '*', 80, 50, 70], //[no, kode, tanggal, keterangan, debit, kredit, saldo]
                        body: body
                    },
                    layout: 'lightHorizontalLines'
                }
            ]
            
        }

        return dd
    }

    async printXLS ( { auth, request } ) {
        var header = request.headers()
        console.log(header.host);
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        

        let data = (
            await TrxJurnal.query().where( w => {
                w.where('aktif', 'Y')
                w.where('coa_id', req.coa_id)
                w.where('trx_date', '>=', req.beginDate)
                w.where('trx_date', '<=', req.finishDate)
            }).orderBy('trx_date', 'asc').fetch()
        ).toJSON()

        data = data.map( (v, i) => ({
            no: i+1,
            kode: v.coa_id,
            tanggal: moment(v.trx_date).format('dddd, DD MMMM YYYY'),
            refferensi: v.reff,
            keterangan: v.narasi,
            debit: v.dk === 'd' ? v.nilai : 0,
            kredit: v.dk === 'k' ? v.nilai : 0,
            saldo: v.saldo,
            created_at: v.created_at
        }))

        var uri = moment().format('YYMMDDHHmmssSSS')
          
        const buffer = jsonrawtoxlsx(data);
        fs.writeFileSync('public/download/'+uri+'.xlsx', buffer, 'binary');
        

        return header.host + '/download/' + uri + '.xlsx'
    }
}

module.exports = BukuBesarController

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


async function rekonsiliasiSaldo(){
    const data = (
        await TrxJurnal.query()
        .where( w => {
            w.where('aktif', 'Y')
        }).orderBy([
            {column: 'urut', order: 'asc'},
            {column: 'coa_id', order: 'asc'}
        ])
        .fetch()
    ).toJSON()

    for (const obj of data) {
        console.log(obj);
        const lastSaldo = await TrxJurnal.query().where( w => {
            w.where('urut', '<', obj.urut)
        }).last()

        var saldo = lastSaldo?.saldo || 0

        const currentJurnal = await TrxJurnal.query().where('id', obj.id).last()
        currentJurnal.merge({saldo: (saldo + currentJurnal.debit) - currentJurnal.kredit})

        await currentJurnal.save()
    }
}