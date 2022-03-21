'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTransferPersediaanItem extends Model {
    static get table(){
        return 'trx_transfer_persediaan_items'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = TrxTransferPersediaanItem
