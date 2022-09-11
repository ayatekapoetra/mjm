'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogistikStokOpname extends Model {
    static get table(){
        return 'log_opname'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }

    items () {
        return this.hasMany("App/Models/logistik/LogistikStokOpnameItem", "id", "opname_id")
    }
}

module.exports = LogistikStokOpname
