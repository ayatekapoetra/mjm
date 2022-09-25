'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogistikStokOpnameSummary extends Model {
    static get table(){
        return 'log_opname_summary'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }
}

module.exports = LogistikStokOpnameSummary