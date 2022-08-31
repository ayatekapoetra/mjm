'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPembayaranAttach extends Model {
    static get table(){
        return 'keu_pembayaran_attach'
    }

    pembayaran () {
        return this.belongsTo("App/Models/transaksi/KeuPembayaran", "keubayar_id", "id")
    }
}

module.exports = KeuPembayaranAttach
