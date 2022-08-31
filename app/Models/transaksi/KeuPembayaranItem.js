'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPembayaranItem extends Model {
    static get table(){
        return 'keu_pembayaran_items'
    }

    coaDebit () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_debit", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    trxPembelian () {
        return this.belongsTo("App/Models/transaksi/KeuFakturPembelian", "trx_beli", "id")
    }

    trxPenjualan () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "trx_jual", "id")
    }
}

module.exports = KeuPembayaranItem
