'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuFakturPembelianAttach extends Model {
    static get table(){
        return 'keu_faktur_pembelian_attach'
    }

    fakturBeli () {
        return this.belongsTo("App/Models/transaksi/KeuFakturPembelian", "fakturbeli_id", "id")
    }
}

module.exports = KeuFakturPembelianAttach
