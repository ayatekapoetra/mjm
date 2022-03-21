'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HargaRental extends Model {
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    equipment () {
        return this.belongsTo("App/Models/master/Equipment", "equipment_id", "id")
    }
}

module.exports = HargaRental
