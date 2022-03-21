'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxHapusPersediaanItem extends Model {
    static get table(){
        return 'trx_hapus_persediaan_items'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    equipment () {
        return this.belongsTo("App/Models/master/Equipment", "equipment_id", "id")
    }
    
    coaDebit () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_debit", "id")
    }
}

module.exports = TrxHapusPersediaanItem
