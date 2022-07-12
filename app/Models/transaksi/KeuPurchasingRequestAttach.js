'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTransferKasBankAttach extends Model {
    static get table(){
        return 'keu_transfer_kasbanks_attach'
    }

    purchasing () {
        return this.belongsTo("App/Models/transaksi/KeuPurchasingRequest", "purchasing_id", "id")
    }
}

module.exports = TrxTransferKasBankAttach
