'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const BisnisUnit = use("App/Models/BisnisUnit")
const LampiranFile = use("App/Models/LampiranFile")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxOrderBeliItem = use("App/Models/transaksi/TrxOrderBeliItem")

class PurchaseReqItem {
    async SHOW (params) {
        const trxOrderBeliItem = await TrxOrderBeliItem
            .query()
            .with('barang')
            .with('pemasok')
            .with('equipment')
            .with('userApprove', b => b.with('profile'))
            .with('userValidate', b => b.with('profile'))
            .where('id', params.id)
            .last()
        return trxOrderBeliItem
    }

    async DELETE (params) {
        try {
            const trxOrderBeliItem = await TrxOrderBeliItem.query().where('id', params.id).last()
            await trxOrderBeliItem.delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new PurchaseReqItem()