'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const Bank = use("App/Models/master/Bank")
const Kas = use("App/Models/master/Kas")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

class setbankValues {
    async UPDATE_VALUES (bisnis_id) {

        /**
         * Menghitung Akumulasi total saldo Bank periode tahun berjalan
         * **/

        const bank = (await Bank.query().where(
            w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', bisnis_id)
            }
        ).fetch()).toJSON()

        let listBank = []
        for (const item of bank) {
            const tmp = (await TrxJurnal.query().where(
                w => {
                    w.where('coa_id', item.coa_id)
                    w.where('bisnis_id', bisnis_id)
                    w.where('trx_date', '>=', moment().startOf('year').format('YYYY-MM-DD'))
                    w.where('trx_date', '<=', moment().endOf('year').format('YYYY-MM-DD'))
                }
            ).fetch()).toJSON()
            listBank.push(tmp)
        }

        var arrBank = []
        for (const val of listBank) {
            let grpBank = _.groupBy(val, 'coa_id')
            grpBank = Object.keys(grpBank).map(key => {
                return {
                    coa_id: key,
                    items: grpBank[key]
                }
            })
            for (const obj of grpBank) {
                arrBank.push(obj)
            }
        }

        let sumBank = []
        for (let obj of arrBank) {
            const bank = await Bank.query().where('coa_id', obj.coa_id).last()
            obj = {...obj, name: bank.name}
            
            let tundaTrx = obj.items.filter(el => el.is_delay === 'Y')
            let sesuaiTrx = obj.items.filter(el => el.is_delay === 'N')

            let tundaKredit = tundaTrx.filter(a => a.dk === 'k').reduce((b, c) => { return b + c.nilai }, 0)
            let tundaDebit = tundaTrx.filter(a => a.dk === 'd').reduce((b, c) => { return b + c.nilai }, 0)

            let sesuaiKredit = sesuaiTrx.filter(a => a.dk === 'k').reduce((b, c) => { return b + c.nilai }, 0)
            let sesuaiDebit = sesuaiTrx.filter(a => a.dk === 'd').reduce((b, c) => { return b + c.nilai }, 0)

            sumBank.push({
                name: bank.name, 
                coa_id: obj.coa_id, 
                tunda_kredit: tundaKredit,
                tunda_debit: tundaDebit,
                sesuai_kredit: sesuaiKredit,
                sesuai_debit: sesuaiDebit,
                saldo_net: sesuaiDebit,
                setor_tunda: tundaDebit,
                tarik_tunda: tundaKredit,
                saldo_rill: sesuaiDebit + (tundaDebit - tundaKredit)
            })
        }

        for (const elm of sumBank) {
            let bank = await Bank.query().where('coa_id', elm.coa_id).last()
            bank.merge({
                saldo_net: elm.saldo_net,
                setor_tunda: elm.setor_tunda,
                tarik_tunda: elm.tarik_tunda,
                saldo_rill: elm.saldo_rill
            })
            try {
                await bank.save()
            } catch (error) {
                console.log(error);
            }
            
        }
        

        /**
         * Menghitung Akumulasi total saldo Kas periode tahun berjalan
         * **/

         const kass = (await Kas.query().where(
            w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', bisnis_id)
            }
        ).fetch()).toJSON()
        
        let listKass = []
        for (const item of kass) {
            const tmp = (await TrxJurnal.query().where(
                w => {
                    w.where('coa_id', item.coa_id)
                    w.where('bisnis_id', bisnis_id)
                    w.where('trx_date', '>=', moment().startOf('year').format('YYYY-MM-DD'))
                    w.where('trx_date', '<=', moment().endOf('year').format('YYYY-MM-DD'))
                }
            ).fetch()).toJSON()
            listKass.push(tmp)
        }

        var arrKass = []
        for (const val of listKass) {
            let grpKas = _.groupBy(val, 'coa_id')
            grpKas = Object.keys(grpKas).map(key => {
                return {
                    coa_id: key,
                    items: grpKas[key]
                }
            })
            for (const obj of grpKas) {
                arrKass.push(obj)
            }
        }

        
        let sumKas = []
        for (let obj of arrKass) {
            const kass = await Kas.query().where('coa_id', obj.coa_id).last()
            obj = {...obj, name: kass.name}
            
            let kasKredit = obj.items.filter(el => el.dk === 'k').reduce((a, b) => { return a + parseFloat(b.nilai) }, 0)
            let kasDebit = obj.items.filter(el => el.dk === 'd').reduce((a, b) => { return a + parseFloat(b.nilai) }, 0)
            
            
            sumKas.push({
                name: kass.name, 
                coa_id: obj.coa_id,
                saldo_rill: kasDebit - kasKredit
            })
        }


        for (const elm of sumKas) {
            let kas = await Kas.query().where('coa_id', elm.coa_id).last()
            kas.merge({
                saldo_rill: elm.saldo_rill
            })
            try {
                await kas.save()
            } catch (error) {
                console.log(error);
            }
            
        }

    }
}

module.exports = new setbankValues()