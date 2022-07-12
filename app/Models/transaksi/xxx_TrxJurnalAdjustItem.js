'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxJurnalAdjustItem extends Model {
    adjust () {
        return this.belongsTo("App/Models/transaksi/TrxJurnalAdjust", "trx_adjust", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Gudang", "barang_id", "id")
    }

    fakturbeli () {
        return this.belongsTo("App/Models/transaksi/TrxFakturBeli", "trx_beli", "id")
    }

    fakturjual () {
        return this.belongsTo("App/Models/transaksi/TrxFakturJual", "trx_jual", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_id", "id")
    }
}

module.exports = TrxJurnalAdjustItem
