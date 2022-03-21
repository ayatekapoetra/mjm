'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AccCoaTipe extends Model {
    static get table(){
        return 'acc_coa_tipe'
    }

    group () {
        return this.hasMany("App/Models/akunting/AccCoaGroup", "id", "coa_tipe")
    }
}

module.exports = AccCoaTipe
