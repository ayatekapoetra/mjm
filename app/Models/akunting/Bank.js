'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bank extends Model {
    static get table(){
        return 'keu_banks'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
}


module.exports = Bank
