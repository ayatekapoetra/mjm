'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPurchasingRequestItems extends Model {
    static get table(){
        return 'keu_request_orders_items'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    purchasing () {
        return this.belongsTo("App/Models/transaksi/KeuPurchasingRequest", "id", "purchasing_id")
    }
}

module.exports = KeuPurchasingRequestItems
