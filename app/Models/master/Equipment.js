'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Equipment extends Model {
    static get table(){
        return 'mas_equipment'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
}

module.exports = Equipment
