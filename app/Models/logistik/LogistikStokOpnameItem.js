'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogistikStokOpnameItem extends Model {
    static get table(){
        return 'log_opname_items'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = LogistikStokOpnameItem
