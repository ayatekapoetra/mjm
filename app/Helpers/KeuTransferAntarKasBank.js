'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const Bank = use("App/Models/akunting/Bank")
const Kas = use("App/Models/akunting/Kas")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKases = use("App/Models/transaksi/TrxKase")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuTransferKasBank = use("App/Models/transaksi/KeuTransferKasBank")
const KeuTransferKasBankAttach = use("App/Models/transaksi/KeuTransferKasBankAttach")

class transferKasBank {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        let data
        if(req.keyword){
            data = (
                await KeuTransferKasBank
                .query()
                .with('cabang')
                .with('bankSrc', w => w.with('cabang'))
                .with('kasSrc', w => w.with('cabang'))
                .with('bankTarget', w => w.with('cabang'))
                .with('kasTarget', w => w.with('cabang'))
                .with('coaScr')
                .with('coaTarget')
                .with('createdby')
                .with('files')
                .where( w => {
                    if(req.narasi){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
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
                await KeuTransferKasBank
                .query()
                .with('cabang')
                .with('bankSrc', w => w.with('cabang'))
                .with('kasSrc', w => w.with('cabang'))
                .with('bankTarget', w => w.with('cabang'))
                .with('kasTarget', w => w.with('cabang'))
                .with('coaScr')
                .with('coaTarget')
                .with('createdby')
                .with('files')
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, attach) {
        const ws = await initFunc.WORKSPACE(user)
        const trx = await DB.beginTransaction()

        async function GET_BANK_COA(id){
            const bank = await Bank.query().where('id', id).last()
            return bank
        }
        
        async function GET_KAS_COA(id){
            const kas = await Kas.query().where('id', id).last()
            return kas
        }
        
        if(req.bank_src){
            const banksrc = await GET_BANK_COA(req.bank_src)
            req.bankSumber = banksrc.toJSON()
            req.coa_src_id = banksrc.coa_id
            req.cabang_jurnal = banksrc.cabang_id

            if(banksrc.saldo_net < parseFloat(req.total)){
                return {
                    success: false,
                    message: 'Saldo bank ' + banksrc.name + ' tidak cukup...'
                }
            }
        }

        if(req.kas_src){
            const kassrc = await GET_KAS_COA(req.kas_src)
            req.kasSumber = kassrc.toJSON()
            req.coa_src_id = kassrc.coa_id
            req.cabang_jurnal = kassrc.cabang_id

            if(kassrc.saldo_rill < parseFloat(req.total)){
                return {
                    success: false,
                    message: 'Saldo kas ' + kassrc.name + ' tidak cukup...'
                }
            }
        }

        if(req.bank_target){
            const banktar = await GET_BANK_COA(req.bank_target)
            req.bankTarget = banktar.toJSON()
            req.coa_target_id = banktar.coa_id
        }

        if(req.kas_target){
            const kastar = await GET_KAS_COA(req.kas_target)
            req.kasTarget = kastar.toJSON()
            req.coa_target_id = kastar.coa_id
        }

        /** INSERT TRX ANTAR KAS & BANK **/
        const trxTransferKasBank = new KeuTransferKasBank()
        trxTransferKasBank.fill({
            author: user.id,
            cabang_id: ws.cabang_id,
            trx_date: req.trx_date,
            bank_src: req.bank_src || null,
            kas_src: req.kas_src || null,
            coa_src_id: req.coa_src_id,
            out_date: req.delay_out || null,
            bank_target: req.bank_target || null,
            kas_target: req.kas_target || null,
            coa_target_id: req.coa_target_id,
            in_date: req.delay_in || null,
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
                message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TRF-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new KeuTransferKasBankAttach()
            lampiranFile.fill({
                transfer_id: trxTransferKasBank.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
                }
            }
        }

        
        
        const kdMutasi = await initFunc.GEN_KODE_MUTASI(trxTransferKasBank.id)
        const nameSrc = req.bankSumber ? req.bankSumber?.name : req.kasSumber?.name
        const nameTo = req.bankTarget ? req.bankTarget?.name : req.kasTarget?.name
        /** INSERT JURNAL KREDIT **/
        try {
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                transfer_id: trxTransferKasBank.id,
                createdby: user.id,
                cabang_id: req.cabang_jurnal,
                bank_id: req.bank_src || null,
                kas_id: req.kas_src || null,
                coa_id: req.coa_src_id,
                reff: kdMutasi,
                narasi: req.narasi ? `[ ${kdMutasi} ] ${req.narasi}` : `[ ${kdMutasi} ] Transfer dari ${nameSrc}`,
                trx_date: req.trx_date,
                nilai: parseFloat(req.total) * -1,
                dk: 'd',
                delay_date: req.isDelayOut != 'N' ? req.delay_out : null,
                is_delay: req.isDelayOut
            })
            await trxJurnalKredit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit \n'+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                transfer_id: trxTransferKasBank.id,
                createdby: user.id,
                cabang_id: req.cabang_jurnal,
                bank_id: req.bank_src || null,
                kas_id: req.kas_src || null,
                coa_id: req.coa_src_id,
                reff: kdMutasi,
                narasi: req.narasi ? `[ ${kdMutasi} ] ${req.narasi}` : `[ ${kdMutasi} ] Transfer dari ${nameSrc}`,
                trx_date: req.trx_date,
                nilai: parseFloat(req.total),
                dk: 'd',
                delay_date: req.isDelayIn != 'N' ? req.delay_in : null,
                is_delay: req.isDelayIn
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit \n'+ JSON.stringify(error)
            }
        }
        
        if(req.bank_src){
            /** INSERT DATA TRX BANK SUMBER **/
            const dataTrxBankKredit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                bank_id: req.bank_src,
                mutasi: kdMutasi,
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`
            }
            if(req.isDelayOut != 'Y'){
                dataTrxBankKredit.saldo_net = parseFloat(req.total) * -1
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
                mutasi: kdMutasi,
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`
            }
            if(req.isDelayIn != 'Y'){
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
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`,
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
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`,
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
            await KeuTransferKasBank
            .query()
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

    async UPDATE (params, req, user, attach) {
        const ws = await initFunc.WORKSPACE(user)
        const trx = await DB.beginTransaction()
        
        async function GET_BANK_COA(id){
            const bank = await Bank.query().where('id', id).last()
            return bank
        }
        
        async function GET_KAS_COA(id){
            const kas = await Kas.query().where('id', id).last()
            return kas
        }
        
        if(req.bank_src){
            const banksrc = await GET_BANK_COA(req.bank_src)
            req.bankSumber = banksrc.toJSON()
            req.coa_src_id = banksrc.coa_id
            req.cabang_jurnal = banksrc.cabang_id

            if(banksrc.saldo_net < parseFloat(req.total)){
                return {
                    success: false,
                    message: 'Saldo bank ' + banksrc.name + ' tidak cukup...'
                }
            }
        }

        if(req.kas_src){
            const kassrc = await GET_KAS_COA(req.kas_src)
            req.kasSumber = kassrc.toJSON()
            req.coa_src_id = kassrc.coa_id
            req.cabang_jurnal = kassrc.cabang_id

            if(kassrc.saldo_rill < parseFloat(req.total)){
                return {
                    success: false,
                    message: 'Saldo kas ' + kassrc.name + ' tidak cukup...'
                }
            }
        }

        if(req.bank_target){
            const banktar = await GET_BANK_COA(req.bank_target)
            req.bankTarget = banktar.toJSON()
            req.coa_target_id = banktar.coa_id
        }

        if(req.kas_target){
            const kastar = await GET_KAS_COA(req.kas_target)
            req.kasTarget = kastar.toJSON()
            req.coa_target_id = kastar.coa_id
        }

        /** INSERT TRX ANTAR KAS & BANK **/
        const trxTransferKasBank = await KeuTransferKasBank.query().where('id', params.id).last()
        trxTransferKasBank.merge({
            author: user.id,
            cabang_id: ws.cabang_id,
            trx_date: req.trx_date,
            bank_src: req.bank_src || null,
            kas_src: req.kas_src || null,
            coa_src_id: req.coa_src_id,
            out_date: req.delay_out || null,
            bank_target: req.bank_target || null,
            kas_target: req.kas_target || null,
            coa_target_id: req.coa_target_id,
            in_date: req.delay_in || null,
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
                message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TRF-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = await KeuTransferKasBankAttach.query().where('transfer_id', params.id).last()
            lampiranFile.merge({
                transfer_id: trxTransferKasBank.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
                }
            }
        }

        
        
        const kdMutasi = await initFunc.GEN_KODE_MUTASI(trxTransferKasBank.id)
        const nameSrc = req.bankSumber ? req.bankSumber?.name : req.kasSumber?.name
        const nameTo = req.bankTarget ? req.bankTarget?.name : req.kasTarget?.name
        /** INSERT JURNAL KREDIT **/
        try {
            const trxJurnalKredit = await TrxJurnal.query().where( w => {
                w.where('transfer_id', params.id)
                w.where('nilai', '<=', 0)
                w.where('dk', 'd')
            }).last()
            trxJurnalKredit.merge({
                transfer_id: trxTransferKasBank.id,
                createdby: user.id,
                cabang_id: req.cabang_jurnal,
                bank_id: req.bank_src || null,
                kas_id: req.kas_src || null,
                coa_id: req.coa_src_id,
                reff: kdMutasi,
                narasi: req.narasi ? `[ ${kdMutasi} ] ${req.narasi}` : `[ ${kdMutasi} ] Transfer dari ${nameSrc}`,
                trx_date: req.trx_date,
                nilai: parseFloat(req.total) * -1,
                dk: 'd',
                delay_date: req.isDelayOut != 'N' ? req.delay_out : null,
                is_delay: req.isDelayOut
            })
            await trxJurnalKredit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit \n'+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDebit = await TrxJurnal.query().where( w => {
                w.where('transfer_id', params.id)
                w.where('nilai', '>=', 0)
                w.where('dk', 'd')
            }).last()
            trxJurnalDebit.merge({
                transfer_id: trxTransferKasBank.id,
                createdby: user.id,
                cabang_id: req.cabang_jurnal,
                bank_id: req.bank_target || null,
                kas_id: req.kas_target || null,
                coa_id: req.coa_target_id,
                reff: kdMutasi,
                narasi: req.narasi ? `[ ${kdMutasi} ] ${req.narasi}` : `[ ${kdMutasi} ] Transfer dari ${nameSrc}`,
                trx_date: req.trx_date,
                nilai: parseFloat(req.total),
                dk: 'd',
                delay_date: req.isDelayIn != 'N' ? req.delay_in : null,
                is_delay: req.isDelayIn
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit \n'+ JSON.stringify(error)
            }
        }
        
        const oldTranfer = await KeuTransferKasBank.query().where('id', params.id).last()
        if(req.bank_src){
            /** INSERT DATA TRX BANK SUMBER **/
            const dataTrxBankKredit = {
                trx_date: req.trx_date,
                trf_id: trxTransferKasBank.id,
                bank_id: req.bank_src,
                mutasi: kdMutasi,
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`
            }
            if(req.isDelayOut != 'Y'){
                dataTrxBankKredit.saldo_net = parseFloat(req.total) * -1
            }else{
                dataTrxBankKredit.tarik_tunda = parseFloat(req.total)
            }

            const trxBankOut = await TrxBank.query().where( w => {
                w.where('trf_id', params.id)
                w.where('bank_id', oldTranfer.bank_src)
            }).last()
            trxBankOut.merge(dataTrxBankKredit)
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
                mutasi: kdMutasi,
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`
            }
            if(req.isDelayIn != 'Y'){
                dataTrxBankDebit.saldo_net = parseFloat(req.total)
            }else{
                dataTrxBankDebit.setor_tunda = parseFloat(req.total)
            }

            const trxBankIn = await TrxBank.query().where( w => {
                w.where('trf_id', params.id)
                w.where('bank_id', oldTranfer.bank_target)
            }).last()
            trxBankIn.merge(dataTrxBankDebit)
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
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`,
                saldo_rill: parseFloat(req.total) * (-1)
            }

            const trxKasesOut = await TrxKases.query().where( w => {
                w.where('trf_id', params.id)
                w.where('kas_id', oldTranfer.kas_src)
            }).last()
            trxKasesOut.merge(dataTrxKasKredit)
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
                desc: req.narasi || `[ ${kdMutasi} ] Transfer ke ${nameTo}`,
                saldo_rill: parseFloat(req.total)
            }

            const trxKasesIn = await TrxKases.query().where( w => {
                w.where('trf_id', params.id)
                w.where('kas_id', oldTranfer.kas_target)
            }).last()

            trxKasesIn.merge(dataTrxKasDebit)
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
            await KeuTransferKasBank.query().where('id', params.id).delete()
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