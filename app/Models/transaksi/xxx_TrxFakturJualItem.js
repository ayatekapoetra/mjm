'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxFakturJualItem extends Model {
    static get table(){
        return 'trx_faktur_jual_items'
    }

    equipment () {
        return this.belongsTo("App/Models/master/Equipment", "equipment_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_id", "id")
    }
}

module.exports = TrxFakturJualItem
