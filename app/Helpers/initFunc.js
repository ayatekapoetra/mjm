'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const User = use("App/Models/User")
const DefCoa = use("App/Models/DefCoa")
const UsrMenu = use("App/Models/UsrMenu")
const UsrCabang = use("App/Models/UsrCabang")
const SysConfig = use("App/Models/SysConfig")
const Barang = use("App/Models/master/Barang")
const Pemasok = use("App/Models/master/Pemasok")
const Pelanggan = use("App/Models/master/Pelanggan")
const BarangBrand = use("App/Models/master/BarangBrand")
const BarangCategories = use("App/Models/master/BarangCategories")
const BarangConfig = use("App/Models/master/BarangConfig")
const BarangQualities = use("App/Models/master/BarangQualities")
const BisnisUnit = use("App/Models/BisnisUnit")
const AccCoa = use("App/Models/akunting/AccCoa")
const Bank = use("App/Models/akunting/Bank")
const Karyawan = use("App/Models/master/Karyawan")
const AccCoaTipe = use("App/Models/akunting/AccCoaTipe")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")
const AccCoaSubGroup = use("App/Models/akunting/AccCoaSubGroup")
const UsrPrivilage = use("App/Models/UsrPrivilage")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
// const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")
const TrxTerimaBarang = use("App/Models/transaksi/TrxTerimaBarang")
// const TrxOrderBeliItem = use("App/Models/transaksi/TrxOrderBeliItem")
const TrxFakturJualBayar = use("App/Models/transaksi/TrxFakturJualBayar")
const TrxFakturBeliBayar = use("App/Models/transaksi/TrxFakturBeliBayar")
const OpsPurchasingOrder = use("App/Models/operational/OpsPurchasingOrder")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const OpsPelangganBayar = use("App/Models/operational/OpsPelangganBayar")

const { performance } = require('perf_hooks')
// const RECONSILIASI_KAS_BANK = use("App/Helpers/_setKasBankValues")

/** Data JSON Collection  **/
const jsonAccess = use("App/Helpers/JSON/user_akses")
const jsonMenu = use("App/Helpers/JSON/user_menus")

class initFunc {

    async durasi (begin) { 
        var t1 = performance.now()
        console.log("V.2.0 Durasi API " + (t1 - begin) + " milliseconds.")
        return parseFloat((((t1 - begin) % 60000) / 1000).toFixed(2)) + ' second'
    }

    async POST_RESOURCES_ACCESS (iduser) {
        let result = []
        let accessData = (
            await UsrPrivilage.query().where('user_id', iduser).fetch()
        ).toJSON()

        if(accessData.length === 0){
            for (let obj of jsonAccess.RECORDS) {
                obj.created_at = new Date()
                obj.updated_at = new Date()
                const newAccess = new UsrPrivilage()
                newAccess.fill(obj)
                try {
                    await newAccess.save()
                    result.push(1)
                } catch (error) {
                    console.log(error);
                    result.push(0)
                }
            }
        }
    }

    async RUPIAH_TAX (values) {
        const tax_ = await SysConfig.query().last()
        const tax_persen = tax_.pajak / 100
        return parseFloat(values) * tax_persen
    }

    async POST_ACCESS_MENU (iduser) {
        let userMenu = (
            await UsrMenu.query().where('user_id', iduser).fetch()
        ).toJSON()

        if(userMenu.length === 0){
            for (let obj of jsonMenu.RECORDS) {
                obj.created_at = new Date()
                obj.updated_at = new Date()
                const newUsermenu = new UsrMenu()
                newUsermenu.fill({...obj, user_id: iduser})
                try {
                    await newUsermenu.save()
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    async WORKSPACE (user) {
        try {
            const data = (
                await UsrCabang.query().with('cabang').where( w => {
                    w.where('aktif', 'Y')
                    w.where('user_id', user.id)
                }).last()
            ).toJSON()
            
            return data
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async UPDATE_JURNAL_DELAY(){
        console.log('trying to update jurnal delay...');
        const trx = await DB.beginTransaction()
        let jurnal = await TrxJurnal.query().where( w => {
            w.where('is_delay', 'Y')
            w.where('delay_date', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
        }).fetch()

        jurnal = jurnal.toJSON()
        for (const obj of jurnal) {
            const updJurnal = await TrxJurnal.query().where('id', obj.id).last()
            updJurnal.merge({
                is_delay: 'N'
            })
            try {
                await updJurnal.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Gagal update jurnal DELAY transaction....'
                }
            }
            

            /* UPDATE SALDO BANK */
            if(obj.bank_id){
                const bank = await Bank.query().where('id', obj.bank_id).last()
                if(obj.dk === 'd'){
                    bank.merge({
                        saldo_net: bank.saldo_net + obj.nilai,
                        setor_tunda: bank.setor_tunda - obj.nilai
                    })
                }
                if(obj.dk === 'k'){
                    bank.merge({
                        saldo_net: bank.saldo_net - obj.nilai,
                        tarik_tunda: bank.tarik_tunda - obj.nilai
                    })
                }
                try {
                    await bank.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Gagal update jurnal DELAY transaction....'
                    }
                }
                
            }
        }

        await trx.commit()
    }

    async GET_COA_ID (bisnis, kode) {
        const data = (
            await AccCoa.query().where( w => {
                w.where('kode', kode)
                w.where('bisnis_id', bisnis)
                w.where('aktif', 'Y')
            }).last()
        ).toJSON()

        return data
    }

    async DEF_COA (id) {
        const bisnis = await this.GET_WORKSPACE(id)
        try {
            const data = (
                await DefCoa.query()
                    .where('id', bisnis.bisnis_id)
                    .last()
            ).toJSON()
            return data
        } catch (error) {
            return null
        }
    }

    // async GEN_KODE_COA (req) {
    //     let root
    //     let last_number
    //     let getLevel = null
    //     if(req.group){
    //         root = await AccCoa.query().where('id', req.group).last()
    //         getLevel = await AccCoa.query().where( w => {
    //             w.where('reff', root.id)
    //         }).last() 
    //     }else{
    //         root = await AccCoa.query().where('id', req.id).last()
    //         getLevel = await AccCoa.query().where( w => {
    //             w.where('reff', root.id)
    //         }).last() 
    //     }
        
        
        
    //     if(getLevel){
    //         last_number = parseInt(_.last(getLevel.kode.split('.'))) + 1
    //         return `${ root.kode }.${ last_number }`
    //     }else{
    //         return `${ root.kode }.1`
    //     }
    // }

    async GEN_NIK_KARYAWAN (req) {
        let str
        let urut
        let kode
        let data = await Karyawan.query().where('aktif', 'Y').orderBy('tgl_gabung', 'asc').last()
        if(data){
            str = (data.nik).split('.')
            urut = parseInt(str[1]) + 1
            kode = '0'.repeat(4 - `${urut}`.length) + parseInt(urut)
            return 'NIK' + moment(req.tgl_gabung).format('YYYYMM') + '.' + kode
        }else{
            return 'NIK' + moment(req.tgl_gabung).format('YYYYMM') + '.000' + 1
        }
    }

    async GEN_FAKTUR_JUAL (user) {
        // Invoice CVMT/No urut/bulan (angka romawi)/tahun
        const ws = await this.WORKSPACE(user)
        const trxFakturJual = await TrxFakturJual.query().where( w => {
            w.where('cabang_id', ws.bisnis_id)
            w.where('date_trx',  '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date_trx',  '<=', moment().endOf('year').format('YYYY-MM-DD'))
        }).last()

        const bulan = moment().format('MM')
        const tahun = moment().format('YYYY')

        const bisnis = await BisnisUnit.find(ws.bisnis_id)

        const urutFaktur = parseInt((trxFakturJual?.no_faktur || 'XXX/00000/I/YYYY').split('/')[1])
        const strUrut = '0'.repeat(5 - `${urutFaktur}`.length) 
        const incUrut = strUrut + (urutFaktur + 1)

        console.log((trxFakturJual?.no_faktur || 'XXX/00000/I/YYYY').split('/'));

        let romanString
        switch (bulan) {
            case '01':
                romanString = 'I'
                break;
            case '02':
                romanString = 'II'
                break;
            case '03':
                romanString = 'III'
                break;
            case '04':
                romanString = 'IV'
                break;
            case '05':
                romanString = 'V'
                break;
            case '06':
                romanString = 'VI'
                break;
            case '07':
                romanString = 'VII'
                break;
            case '08':
                romanString = 'VIII'
                break;
            case '09':
                romanString = 'IX'
                break;
            case '10':
                romanString = 'X'
                break;
            case '11':
                romanString = 'XI'
                break;
            case '12':
                romanString = 'XII'
                break;
        }

        const patten = bisnis.initial + '/' + incUrut + '/' + romanString + '/' + tahun

        return patten
    }

    async GEN_KODE_TERIMA (id) {
        // Invoice CVMT/No urut/bulan (angka romawi)/tahun
        const ws = await this.GET_WORKSPACE(id)
        const trxFakturJualBayar = await TrxFakturJualBayar.query().where( w => {
            w.where('bisnis_id', ws.bisnis_id)
            w.where('date_paid',  '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date_paid',  '<=', moment().endOf('year').format('YYYY-MM-DD'))
        }).last()
        
        const bulan = moment().format('MM')
        const tahun = moment().format('YYYY')

        const bisnis = await BisnisUnit.find(ws.bisnis_id)

        const urutPaid = parseInt((trxFakturJualBayar?.no_paid || 'TT/'+ws.bisnis_id+'/00000/I/YYYY').split('/')[2])
        const strUrut = '0'.repeat(5 - `${urutPaid}`.length) 
        const incUrut = strUrut + (urutPaid + 1)


        let romanString
        switch (bulan) {
            case '01':
                romanString = 'I'
                break;
            case '02':
                romanString = 'II'
                break;
            case '03':
                romanString = 'III'
                break;
            case '04':
                romanString = 'IV'
                break;
            case '05':
                romanString = 'V'
                break;
            case '06':
                romanString = 'VI'
                break;
            case '07':
                romanString = 'VII'
                break;
            case '08':
                romanString = 'VIII'
                break;
            case '09':
                romanString = 'IX'
                break;
            case '10':
                romanString = 'X'
                break;
            case '11':
                romanString = 'XI'
                break;
            case '12':
                romanString = 'XII'
                break;
        }

        const patten = 'TT/' + bisnis.id + '/' + incUrut + '/' + romanString + '/' + tahun

        return patten
    }

    async GEN_KODE_PAID_OUT (id) {
        // Invoice CVMT/No urut/bulan (angka romawi)/tahun
        const ws = await this.GET_WORKSPACE(id)
        const trxFakturBeliBayar = await TrxFakturBeliBayar.query().where( w => {
            w.where('bisnis_id', ws.bisnis_id)
            w.where('date_paid',  '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date_paid',  '<=', moment().endOf('year').format('YYYY-MM-DD'))
        }).last()
        
        const bulan = moment().format('MM')
        const tahun = moment().format('YYYY')

        const bisnis = await BisnisUnit.find(ws.bisnis_id)

        // console.log(trxFakturBeliBayar);

        const urutPaid = parseInt((trxFakturBeliBayar?.no_paid || 'PAY/'+ws.bisnis_id+'/00000/I/YYYY').split('/')[2])
        const strUrut = '0'.repeat(5 - `${urutPaid}`.length) 
        const incUrut = strUrut + (urutPaid + 1)


        let romanString
        switch (bulan) {
            case '01':
                romanString = 'I'
                break;
            case '02':
                romanString = 'II'
                break;
            case '03':
                romanString = 'III'
                break;
            case '04':
                romanString = 'IV'
                break;
            case '05':
                romanString = 'V'
                break;
            case '06':
                romanString = 'VI'
                break;
            case '07':
                romanString = 'VII'
                break;
            case '08':
                romanString = 'VIII'
                break;
            case '09':
                romanString = 'IX'
                break;
            case '10':
                romanString = 'X'
                break;
            case '11':
                romanString = 'XI'
                break;
            case '12':
                romanString = 'XII'
                break;
        }

        const patten = 'PAY/' + bisnis.id + '/' + incUrut + '/' + romanString + '/' + tahun

        return patten
    }

    async URUT_COA (kode, level) {
        let data = await AccCoa.query().where( w => {
            w.where('kode', 'like', `${kode}%`)
            w.where('level_grp', level)
        }).getCount()

        return data + 1
    }

    async GEN_KODE_PEMASOK (method) {
        const pemasok = await Pemasok.query().last()
        let lastNumber
        
        if(pemasok){
            lastNumber = (pemasok.kode).split('.')
            lastNumber = parseInt(lastNumber[1])
        }else{
            lastNumber = 0
        }

        
        let strPrefix = '0'.repeat(3 - `${lastNumber + 1}`.length)
        
        let patten = `SUP${moment().format('YYMMDD')}.${strPrefix}${method != 'update' ? lastNumber + 1 : lastNumber}`

        return patten
    }

    async GEN_KODE_PELANGGAN (method) {
        const pelanggan = await Pelanggan.query().last()
        let lastNumber
        
        if(pelanggan){
            lastNumber = (pelanggan.kode).split('.')
            lastNumber = parseInt(lastNumber[1])
        }else{
            lastNumber = 0
        }

        
        let strPrefix = '0'.repeat(6 - `${lastNumber + 1}`.length)
        
        let patten = `CUST${moment().format('YYMMDD')}.${strPrefix}${method != 'update' ? lastNumber + 1 : lastNumber}`

        return patten
    }

    async GEN_KODE_BARANG (req, method) {
        const sett = (await BarangConfig.query().last()).toJSON()
        const kategori = await BarangCategories.query().where('id', req.kategori_id).last()
        const brand = await BarangBrand.query().where('id', req.brand_id).last()
        const qualitas = await BarangQualities.query().where('id', req.qualitas_id).last()
        let nomor = await Barang.query().last() || null
        
        
        let lastNumber
        
        if(nomor){
            lastNumber = (nomor.kode).split(sett.separator)
            console.log(lastNumber);
            lastNumber = parseInt(lastNumber[1])
        }else{
            lastNumber = 0
        }

        
        let strPrefix = '0'.repeat(sett.len_prefix - `${lastNumber + 1}`.length)
        
        let patten = `${sett.alfa_prefix}${kategori.kode}${brand.kode}${qualitas.kode}${sett.separator}${strPrefix}${method != 'update' ? lastNumber + 1 : lastNumber}`

        return patten
    }

    async GEN_KODE_PR () {
        let nomor = await OpsPurchasingOrder.query().where( w => {
            w.where('date', '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date', '<=', moment().endOf('year').format('YYYY-MM-DD'))
        }).last()

        
        let lastNumber
        
        if(nomor){
            lastNumber = (nomor.kode).split('.')
            lastNumber = parseInt(lastNumber[1]) + 1 // PRYYMMDD.00001
        }else{
            lastNumber = 1
        }
        
        let strDate = moment().format('YYMMDD')
        
        
        let strPrefix = '0'.repeat(5 - `${lastNumber}`.length) + lastNumber

        return 'PR' + strDate + '.' + strPrefix
    }

    async GEN_KODE_INVOICES (user) {
        let ws = await this.WORKSPACE(user)
        let nomor = await OpsPelangganOrder.query().where( w => {
            w.where('date', '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date', '<=', moment().endOf('year').format('YYYY-MM-DD'))
            w.where('status', '!=', 'batal')
        }).last()

        let cabKode = ws.cabang?.kode || "XX"
        let prefix1 = 'INV' + moment().format('YYMMDD')
        let prefix2 = '0'.repeat(2 - `${user.id}`.length) + user.id
        let lastNumber = nomor ? (parseInt((nomor.kdpesanan).split('.')[1]) + 1) : 1
        lastNumber = '0'.repeat(3 - `${lastNumber}`.length) + lastNumber
        
        return prefix1 + cabKode + prefix2 + '.' + lastNumber
    }

    async GEN_KODE_KWITANSI (user) {
        let ws = await this.WORKSPACE(user)
        let nomor = await OpsPelangganBayar.query().where( w => {
            w.where('date_paid', '>=', moment().startOf('year').format('YYYY-MM-DD'))
            w.where('date_paid', '<=', moment().endOf('year').format('YYYY-MM-DD'))
        }).last()

        let cabKode = ws.cabang?.kode || "XX"
        let prefix1 = 'PAID' + moment().format('YYMMDD')
        let prefix2 = '0'.repeat(2 - `${user.id}`.length) + user.id
        let lastNumber = nomor ? (parseInt((nomor.no_kwitansi).split('.')[1]) + 1) : 1
        lastNumber = '0'.repeat(3 - `${lastNumber}`.length) + lastNumber
        
        return prefix1 + cabKode + prefix2 + '.' + lastNumber
    }

    async GEN_KODE_TERIMA_BRG (bisnis_id) {
        const conf = (await SysConfig.find(1)).toJSON()
        let strBisnis = '0'.repeat(2 - `${bisnis_id}`.length) + bisnis_id
        let nomor = await TrxTerimaBarang.query().where( w => {
            w.where('bisnis_id', bisnis_id)
        }).last()

        let strDate = moment().format('YYMMDD')
        
        let patten = `${conf.prefix_init_receipt_brg}${strBisnis}.${strDate}.${nomor?.id + 1 || 1}`

        console.log('GEN_KODE_TERIMA_BRG ::', patten);
        return patten
    }

    async POST_INIT_BARANG(data) {
        for (const obj of data) {
            const genKode = await this.GEN_KODE_BARANG(obj.bisnis_id)

            const barang = new Barang()
            barang.fill({
                bisnis_id: obj.bisnis_id,
                kode: genKode,
                serial: obj.no_seri,
                nama: obj.nm_barang,
                satuan: obj.stn
            })
            await barang.save()
        }
    }

    async GET_SALDO_AWAL (req) {
        const coa_bank = await AccCoa.query().where( w => {
            w.where('id', req.coa_id)
            w.where('bisnis_id', req.bisnis_id)
        }).last()
        const saldoAkun = await TrxJurnalSaldo.query().where( w => {
            w.where('bisnis_id', req.bisnis_id)
            w.where('coa_id', req.coa_id)
            w.where('kode_coa', coa_bank.kode)
            w.where('date_trx', '>=', moment().startOf('day').format('YYYY-MM-DD'))
            w.where('date_trx', '<=', moment().endOf('day').format('YYYY-MM-DD'))
        }).last()
        
        // console.log('initFunc.GET_SALDO_AWAL ::', saldoAkun);
        return saldoAkun
    }

    async RINGKASAN (user) {
        // let akunArr = (
        //     await AccCoa
        //     .query()
        //     .where( w => {
        //         w.where('is_akun', 'A')
        //     })
        //     .orderBy('urut', 'asc', 'first')
        //     .fetch()
        // ).toJSON()

        // let akun = (
        //     await AccCoaTipe.query()
        //     .with('group', g => {
        //         g.with('akun')
        //     })
        //     .orderBy('urut', 'asc')
        //     .fetch()
        // ).toJSON()

        // // console.log(akun);

        // /* AKUN NERACA */ 
        // akun = akun.map(obj => {
        //     if(obj.group.length > 0){
        //         return {
        //             ...obj,
        //             akun: akunArr.filter(elm => elm.coa_tipe === obj.id && !elm.coa_grp)
        //         }
        //     }else{
        //         return {
        //             ...obj,
        //             akun: akunArr.filter(elm => elm.coa_tipe === obj.id)
        //         }
        //     }
        // })

        // console.log(JSON.stringify(akun, null, 2));

        // return {
        //     neraca : akun.filter(el => el.id <= 3),
        //     labarugi : akun.filter(el => el.id > 3),
        // }

        let akun = []

        const kategori = (
            await AccCoaTipe.query()
            .with('group', w => w.with('subgroup', x => x.with('akun'))).orderBy('urut', 'asc').fetch()
        ).toJSON()

        for (let obj of kategori) {
            const akunTipe = (await AccCoa.query().where( w => {
                w.where('coa_tipe', obj.id)
                w.whereNull('coa_subgrp')
                w.whereNull('coa_grp')
            }).orderBy('urut', 'asc').fetch()).toJSON()
            
            if(akunTipe.length > 0){
                obj = {...obj, akun: akunTipe}
            }
            
            let arrAkunGrp = []
            for (let elm of obj.group) {
                const akunGrp = (await AccCoa.query().where( w => {
                    w.where('coa_tipe', obj.id)
                    w.where('coa_grp', elm.id)
                    w.whereNull('coa_subgrp')
                }).orderBy('urut', 'asc').fetch()).toJSON()

                elm = {...elm, akun: akunGrp}
                arrAkunGrp.push(elm)
            }
            obj.group = arrAkunGrp
            akun.push(obj)
        }
        return {
            neraca : akun.filter(el => el.id <= 3),
            labarugi : akun.filter(el => el.id > 3),
        }
    }

    async GET_TOTAL_VALUE_AKUN (cabang_id, kode, rangeAwal, rangeAkhir) {
        const dk = await AccCoa.query().where( w => {
            w.where('kode', 'like', `${kode}%`)
        }).first()
        console.log('DK :::', dk.id, dk.coa_name);

        if(dk){
            const data = (
                await TrxJurnal.query().where( w => {
                    if(cabang_id){
                        w.where('cabang_id', cabang_id)
                    }
                    w.where('coa_id', `${kode}%`)
                    w.where('is_delay', 'N')
                    w.where('trx_date', '>=', rangeAwal)
                    w.where('trx_date', '<=', rangeAkhir)
                }).fetch()
            )?.toJSON()
    
            let arrDebit = []
            let arrKredit = []
    
            if(data.length > 0){
                arrDebit = data.filter(el => el.dk === 'd')
                arrKredit = data.filter(el => el.dk === 'k')
                let sumDebit = arrDebit.reduce((a, b) => {
                    return  a + b.nilai
                }, 0)
                let sumKredit = arrKredit.reduce((a, b) => {
                    return  a + b.nilai
                }, 0)
                let sum 
                if(dk.dk === 'd'){
                    sum = parseFloat(sumDebit) - parseFloat(sumKredit)
                }else{
                    sum = parseFloat(sumKredit) - parseFloat(sumDebit)
                }
                
        
                return {
                    dk: dk.dk,
                    name: dk.coa_name,
                    kredit: sumKredit,
                    debit: sumDebit,
                    total: sum
                }
            }else{
                return {
                    dk: dk.dk,
                    name: dk.coa_name,
                    kredit: 0,
                    debit: 0,
                    total: 0
                }
            }

        }else{
            return {
                dk: '',
                name: '',
                kredit: 0,
                debit: 0,
                total: 0
            }
        }
    }

    async GET_PNL(cabang_id, rangeAwal, rangeAkhir){
        const dataProfit = 
            await TrxJurnal.query().where( w => {
                if(cabang_id){
                    w.where('cabang_id', cabang_id)
                }
                w.where('coa_id', 'like', `4%`)
                w.where('trx_date', '>=', rangeAwal)
                w.where('trx_date', '<=', rangeAkhir)
            }).getSum('nilai') || 0

        const dataLoss = 
            await TrxJurnal.query().where( w => {
                if(cabang_id){
                    w.where('cabang_id', cabang_id)
                }
                w.where('coa_id', 'like', `5%`)
                w.where('trx_date', '>=', rangeAwal)
                w.where('trx_date', '<=', rangeAkhir)
            }).getSum('nilai') || 0

        let total = parseFloat(dataProfit) - parseFloat(dataLoss)

        return {
            profit: total > 0 ? true : false,
            total: total
        }
    }

    async INSERT_LABATAHAN (user) {
        const ws = await this.GET_WORKSPACE(user.id)
        const alias = await this.DEF_COA(user.id) || {kode_labatahan: '300.2', bisnis_id: ws.bisnis_id}
        const arrLaba = (await TrxJurnal.query().where(
            w => {
                w.where('kode', 'like', '400.%')
            }
        ).fetch()).toJSON()

        for (const obj of arrLaba) {
            const checkLabaTahan = await TrxJurnal.query().where(
                w => {
                    w.where('kode', 'like', '300.%')
                    if(obj.kode_faktur){
                        w.where('kode_faktur', obj.kode_faktur)
                    }
                    if(obj.tt_id){
                        w.where('tt_id', obj.tt_id)
                    }
                    w.where('bisnis_id', obj.bisnis_id)
                    w.where('trx_date', obj.trx_date)
                    w.where('nilai', obj.nilai)
                }
            ).first()
            if(!checkLabaTahan){
                console.log('laba ditahan insert plus ....');
                const coaL = await AccCoa.query().where(
                    w => {
                        w.where('bisnis_id', alias.bisnis_id)
                        w.where('kode', alias.kode_labatahan)
                    }
                ).first()

                const addLabaTahan = new TrxJurnal()
                addLabaTahan.fill({
                    ...obj,
                    id: null,
                    coa_id: coaL.id,
                    kode: coaL.kode,
                    dk: 'k'
                })
                await addLabaTahan.save()
            }
        }

        const arrBiaya = (await TrxJurnal.query().where(
            w => {
                w.where('kode', 'like', '500.%')
            }
        ).fetch()).toJSON()
        
        for (const obj of arrBiaya) {
            const checkRugiTahan = await TrxJurnal.query().where(
                w => {
                    w.where('kode', 'like', '300.%')
                    w.where('kode_faktur', obj.kode_faktur)
                    w.where('trx_date', obj.trx_date)
                    w.where('nilai', parseFloat(obj.nilai) * (-1))
                }
            ).first()

            
            if(!checkRugiTahan){
                console.log('laba ditahan insert minus....');
                const coaR = await AccCoa.query().where(
                    w => {
                        w.where('bisnis_id', alias.bisnis_id)
                        w.where('kode', alias.kode_labatahan)
                    }
                ).first()
                
                const addRugiTahan = new TrxJurnal()
                addRugiTahan.fill({
                    ...obj,
                    id: null,
                    coa_id: coaR.id,
                    kode: coaR.kode,
                    nilai: parseFloat(obj.nilai) * (-1),
                    dk: 'k'
                })
                console.log(addRugiTahan);
                await addRugiTahan.save()
            }
        }
    }

    async KALIBRASI_SISA_FAKTUR_JUAL(){
        const trxFakturJual = (await TrxFakturJual.query().where('status', 'bersisa').fetch()).toJSON()
        for (const obj of trxFakturJual) {
            const totBayarJual = await TrxFakturJualBayar.query().where('trx_jual', obj.id).getSum('nilai_paid') || 0
            console.log('totBayarJual :::', totBayarJual);
            const fakturJual = await TrxFakturJual.query().where('id', obj.id).last()
            const status_trx = totBayarJual >= fakturJual.grandtotal ? 'lunas':'bersisa'
            fakturJual.merge({
                bayar: totBayarJual, 
                sisa: fakturJual.grandtotal - totBayarJual,
                status: status_trx
            })
            await fakturJual.save()
        }
    }

    async KALIBRASI_SISA_FAKTUR_BELI(){
        const trxFakturBeli = (await TrxFakturBeli.query().where('sts_paid', 'bersisa').fetch()).toJSON()
        for (const obj of trxFakturBeli) {
            const totBayarBeli = await TrxFakturBeliBayar.query().where('trx_beli', obj.id).getSum('nilai_paid') || 0
            // console.log('totBayarBeli :::', totBayarBeli);

            const fakturBeli = await TrxFakturBeli.query().where('id', obj.id).last()
            const status_trx = totBayarBeli >= fakturBeli.total ? 'lunas':'bersisa'
            fakturBeli.merge({
                sisa: fakturBeli.total - totBayarBeli,
                sts_paid: status_trx
            })
            await fakturBeli.save()
        }
    }

}

module.exports = new initFunc()
