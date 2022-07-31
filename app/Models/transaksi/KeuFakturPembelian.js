'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuFakturPembelian extends Model {
    static get table(){
        return 'keu_faktur_pembelians'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    order () {
        return this.belongsTo("App/Models/transaksi/KeuPurchasingRequest", "reff_order", "id")
    }

    author () {
        return this.belongsTo("App/Models/User", "createdby", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/KeuFakturPembelianItem", "id", "fakturbeli_id")
    }

    files () {
        return this.hasMany("App/Models/transaksi/KeuFakturPembelianAttach", "id", "fakturbeli_id")
    }
}

module.exports = KeuFakturPembelian
