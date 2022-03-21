'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VUser extends Model {
    static get table(){
        return 'v_users'
    }

    static get hidden () {
        return ['password']
    }

    profile () {
        return this.hasOne('App/Models/UsrProfile', "id", "user_id")
    }

    workspace () {
        return this.belongsTo('App/Models/UsrWorkspace', "user_id", "id")
    }

    tokens () {
        return this.hasMany('App/Models/Token', "id", "user_id")
    }
}

module.exports = VUser
