'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MjmNotification extends Model {
    static get table(){
        return 'mjm_notifications'
    }

    pengirim () {
        return this.belongsTo("App/Models/VUser", "sender", "id")
    }

    penerima () {
        return this.belongsTo("App/Models/VUser", "receiver", "id")
    }
}

module.exports = MjmNotification
