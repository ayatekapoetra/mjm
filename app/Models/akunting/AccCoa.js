'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AccCoa extends Model {
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    tipe () {
        return this.belongsTo("App/Models/akunting/AccCoaTipe", "coa_tipe", "id")
    }

    group () {
        return this.belongsTo("App/Models/akunting/AccCoaGroup", "coa_grp", "id")
    }
}

module.exports = AccCoa
