'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuFakturPenjualan extends Model {
    static get table(){
        return 'keu_faktur_penjualans'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    invoices () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "reff_inv", "id")
    }

    author () {
        return this.belongsTo("App/Models/User", "createdby", "id")
    }

    // items () {
    //     return this.hasMany("App/Models/transaksi/KeuFakturPembelianItem", "id", "fakturbeli_id")
    // }

    files () {
        return this.hasMany("App/Models/transaksi/KeuFakturPembelianAttach", "id", "fakturbeli_id")
    }
}

module.exports = KeuFakturPenjualan
