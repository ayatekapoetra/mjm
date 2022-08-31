'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPenerimaanAttach extends Model {
    static get table(){
        return 'keu_penerimaan_attach'
    }

    penerimaan () {
        return this.belongsTo("App/Models/transaksi/KeuPenerimaan", "keuterima_id", "id")
    }
}

module.exports = KeuPenerimaanAttach
