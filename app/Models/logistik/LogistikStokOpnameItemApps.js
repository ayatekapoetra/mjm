'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogistikStokOpnameItemApps extends Model {
    static get table(){
        return 'log_opname_items_apps'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = LogistikStokOpnameItemApps
