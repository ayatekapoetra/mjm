'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pemasok extends Model {
    static get table(){
        return 'mas_pemasoks'
    }

    cabang(){
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
}

module.exports = Pemasok
