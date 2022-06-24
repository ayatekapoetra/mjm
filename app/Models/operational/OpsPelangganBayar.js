'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPelangganBayar extends Model {
    static get table(){
        return 'pay_pelanggan'
    }

    order () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "order_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
    
    bank () {
        return this.belongsTo("App/Models/akunting/Bank", "bank_id", "id")
    }

    kas () {
        return this.belongsTo("App/Models/akunting/Kas", "kas_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }
}

module.exports = OpsPelangganBayar
