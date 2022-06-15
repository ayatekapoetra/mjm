'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AccCoaGroup extends Model {
    static get table(){
        return 'acc_coa_group'
    }

    tipe () {
        return this.belongsTo("App/Models/akunting/AccCoaTipe", "coa_tipe", "id")
    }

    subgroup () {
        return this.hasMany("App/Models/akunting/AccCoaSubGroup", "id", "coa_group")
    }

    // akun () {
    //     return this.hasMany("App/Models/akunting/AccCoa", "id", "coa_grp")
    // }
}

module.exports = AccCoaGroup
