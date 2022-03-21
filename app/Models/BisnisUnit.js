'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BisnisUnit extends Model {
    user () {
        return this.belongsToMany("App/Models/User").pivotTable('usr_bisnis_units')
    }

    defcoa () {
        return this.hasOne("App/Models/DefCoa")
    }
}

module.exports = BisnisUnit
