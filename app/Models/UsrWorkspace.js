'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UsrWorkspace extends Model {
    user () {
        return this.belongsTo("App/Models/User", "user_id", "id")
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }
}

module.exports = UsrWorkspace
