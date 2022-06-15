'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AccCoaSubGroup extends Model {
    static get table(){
        return 'acc_coa_subgroup'
    }

    group () {
        return this.belongsTo("App/Models/akunting/AccCoaGroup", "coa_group", "id")
    }

    akun () {
        return this.hasMany("App/Models/akunting/AccCoa", "id", "coa_subgrp")
    }
}

module.exports = AccCoaSubGroup
