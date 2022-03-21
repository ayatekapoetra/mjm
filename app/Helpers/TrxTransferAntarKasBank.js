'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxBank = use("App/Models/transaksi/TrxBank")
const LampiranFile = use("App/Models/LampiranFile")
const TrxKases = use("App/Models/transaksi/TrxKase")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxTransferKasBank = use("App/Models/transaksi/TrxTransferKasBank")

class transferKasBank {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await TrxTransferKasBank
                .query()
                .with('bisnis')
                .with('cabang')
                .with('bankSrc')
                .with('kasSrc')
                .with('bankTarget')
                .with('kasTarget')
                .with('coaScr')
                .with('coaTarget')
                .with('createdby')
                .with('files')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.date_begin && req.date_end){
                        w.where('trx_date', '>=', req.date_begin)
                        w.where('trx_date', '<=', req.date_end)
                    }
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await TrxTransferKasBank
                .query()
                .with('bisnis')
                .with('cabang')
                .with('bankSrc')
                .with('kasSrc')
                .with('bankTarget')
                .with('kasTarget')
                .with('coaScr')
                .with('coaTarget')
                .with('createdby')
                .with('files')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        async function GET_KODE_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        const coaKredit = await GET_KODE_COA(req.coa_kredit)
        const coaDebit = await GET_KODE_COA(req.coa_debit)

        /** INSERT TRX ANTAR KAS & BANK **/
        const trxTransferKasBank = new TrxTransferKasBank()
        try {
            trxTransferKasBank.fill({
                author: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                reff: req.reff,
                trx_date: req.trx_date,
                bank_src: req.bank_src || null,
                kas_src: req.kas_src || null,
                coa_src_id: req.coa_kredit,
                coa_src_kode: coaKredit.kode,
                out_date: req.out_date || null,
                bank_target: req.bank_target || null,
                kas_target: req.kas_target || null,
                coa_target_id: req.coa_debit,
                coa_target_kode: coaDebit.kode,
                in_date: req.in_date || null,
                narasi: req.narasi,
                total: req.total
            })
            await trxTransferKasBank.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TRF-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LampiranFile()
            lampiranFile.fill({
                trf_id: trxTransferKasBank.id,
                datatype: filex.extname,
                url: uriLampiran
            })

            await lampiranFile.save(trx)
        }


        /** INSERT JURNAL KREDIT **/
        try {
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                trf_id: trxTransferKasBank.id,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                bank_id: req.bank_src || null,
                kas_id: req.kas_src || null,
                coa_id: req.coa_kredit,
                kode: coaKredit.kode,
                reff: req.reff,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: req.total,
                dk: 'k',
                is_delay: req.is_delay_out
            })
            await trxJurnalKredit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                trf_id: trxTransferKasBank.id,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                bank_id: req.bank_target || null,
                kas_id: req.kas_target || null,
                coa_id: req.coa_debit,
                kode: coaDebit.kode,
                reff: req.reff,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: req.total,
                dk: 'd',
                is_delay: req.is_delay_in
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
            }
        }
        
        if(req.bank_src){
            /** INSERT DATA TRX BANK SUMBER **/
            const dataTrxBankKredit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                bank_id: req.bank_src,
                desc: req.narasi
            }
            if(req.is_delay_out != 'Y'){
                dataTrxBankKredit.saldo_net = parseFloat(req.total)
            }else{
                dataTrxBankKredit.tarik_tunda = parseFloat(req.total)
            }

            const trxBankOut = new TrxBank()
            trxBankOut.fill(dataTrxBankKredit)
            try {
                await trxBankOut.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank kredit '+ JSON.stringify(error)
                }
            }
        }

        if(req.bank_target){
            /** INSERT DATA TRX BANK TARGET **/
            const dataTrxBankDebit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                bank_id: req.bank_target,
                desc: req.narasi
            }
            if(req.is_delay_in != 'Y'){
                dataTrxBankDebit.saldo_net = parseFloat(req.total)
            }else{
                dataTrxBankDebit.setor_tunda = parseFloat(req.total)
            }

            const trxBankIn = new TrxBank()
            trxBankIn.fill(dataTrxBankDebit)
            try {
                await trxBankIn.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank debit '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_src){
            /** INSERT DATA TRX KAS SUMBER **/
            const dataTrxKasKredit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                kas_id: req.kas_src,
                desc: req.narasi,
                saldo_rill: parseFloat(req.total) * (-1)
            }

            const trxKasesOut = new TrxKases()
            trxKasesOut.fill(dataTrxKasKredit)
            try {
                await trxKasesOut.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kas Kredit '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_target){
            /** INSERT DATA TRX KAS TARGET **/
            const dataTrxKasDebit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                kas_id: req.kas_target,
                desc: req.narasi,
                saldo_rill: parseFloat(req.total)
            }

            const trxKasesIn = new TrxKases()
            trxKasesIn.fill(dataTrxKasDebit)
            try {
                await trxKasesIn.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kas Debit '+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await TrxTransferKasBank
            .query()
            .with('bisnis')
            .with('cabang')
            .with('bankSrc')
            .with('kasSrc')
            .with('bankTarget')
            .with('kasTarget')
            .with('coaScr')
            .with('coaTarget')
            .with('createdby')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        // console.log(req);

        async function GET_KODE_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        const coaKredit = await GET_KODE_COA(req.coa_kredit)
        const coaDebit = await GET_KODE_COA(req.coa_debit)

        const trxTransferKasBank = await TrxTransferKasBank.query().where('id', params.id).last()
        trxTransferKasBank.merge({
            author: user.id,
            bisnis_id: ws.bisnis_id,
            cabang_id: req.cabang_id || null,
            reff: req.reff,
            trx_date: req.trx_date,
            bank_src: req.bank_src || null,
            kas_src: req.kas_src || null,
            coa_src_id: req.coa_kredit,
            coa_src_kode: coaKredit.kode,
            out_date: req.out_date || null,
            bank_target: req.bank_target || null,
            kas_target: req.kas_target || null,
            coa_target_id: req.coa_debit,
            coa_target_kode: coaDebit.kode,
            in_date: req.in_date || null,
            narasi: req.narasi,
            total: req.total
        })

        try {
            await trxTransferKasBank.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trxTransferKasBank '+ JSON.stringify(error)
            }
        }

        /** UPDATE LAMPIRAN FILE **/
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TRF-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            let lampiranFile
            lampiranFile = await LampiranFile.query().where('trf_id', params.id).last()
            if(lampiranFile){
                lampiranFile.merge({
                    datatype: filex.extname,
                    url: uriLampiran
                })
            }else{
                lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    trf_id: params.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })
            }
            await lampiranFile.save(trx)
        }

        /** DELETE TRX JURNAL **/
        await TrxJurnal.query().where('trf_id', params.id).delete()

        /** DELETE TRX BANK **/
        await TrxBank.query().where('trf_id', params.id).delete()

        /** DELETE TRX KAS **/
        await TrxKases.query().where('trf_id', params.id).delete()

        /** INSERT JURNAL KREDIT **/
        try {
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                trf_id: params.id,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                bank_id: req.bank_src || null,
                kas_id: req.kas_src || null,
                coa_id: req.coa_kredit,
                kode: coaKredit.kode,
                reff: req.reff,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: req.total,
                dk: 'k',
                is_delay: req.is_delay_out
            })
            await trxJurnalKredit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                trf_id: params.id,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                bank_id: req.bank_target || null,
                kas_id: req.kas_target || null,
                coa_id: req.coa_debit,
                kode: coaDebit.kode,
                reff: req.reff,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: req.total,
                dk: 'd',
                is_delay: req.is_delay_in
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
            }
        }
        
        if(req.bank_src){
            /** INSERT DATA TRX BANK SUMBER **/
            const dataTrxBankKredit = {
                trx_date: req.trx_date,
                trf_id: params.id,
                bank_id: req.bank_src,
                desc: req.narasi
            }
            if(req.is_delay_out != 'Y'){
                dataTrxBankKredit.saldo_net = parseFloat(req.total)
            }else{
                dataTrxBankKredit.tarik_tunda = parseFloat(req.total)
            }

            const trxBankOut = new TrxBank()
            trxBankOut.fill(dataTrxBankKredit)
            try {
                await trxBankOut.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank kredit '+ JSON.stringify(error)
                }
            }
        }

        if(req.bank_target){
            /** INSERT DATA TRX BANK TARGET **/
            const dataTrxBankDebit = {
                trx_date: req.trx_date,
                trf_id: params.id,
                bank_id: req.bank_target,
                desc: req.narasi
            }
            if(req.is_delay_in != 'Y'){
                dataTrxBankDebit.saldo_net = parseFloat(req.total)
            }else{
                dataTrxBankDebit.setor_tunda = parseFloat(req.total)
            }

            const trxBankIn = new TrxBank()
            trxBankIn.fill(dataTrxBankDebit)
            try {
                await trxBankIn.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank debit '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_src){
            /** INSERT DATA TRX KAS SUMBER **/
            const dataTrxKasKredit = {
                trx_date: req.trx_date,
                trf_id: params.id,
                kas_id: req.kas_src,
                desc: req.narasi,
                saldo_rill: parseFloat(req.total) * (-1)
            }

            const trxKasesOut = new TrxKases()
            trxKasesOut.fill(dataTrxKasKredit)
            try {
                await trxKasesOut.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kas Kredit '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_target){
            /** INSERT DATA TRX KAS TARGET **/
            const dataTrxKasDebit = {
                trx_date: req.trx_date,
                trf_id: params.id,
                kas_id: req.kas_target,
                desc: req.narasi,
                saldo_rill: parseFloat(req.total)
            }

            const trxKasesIn = new TrxKases()
            trxKasesIn.fill(dataTrxKasDebit)
            try {
                await trxKasesIn.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kas Debit '+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        try {
            await TrxTransferKasBank.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new transferKasBank()