'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UsrCabang extends Model {
    static get table(){
        return 'usr_cabangs'
    }

    cabang(){
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    user(){
        return this.belongsTo("App/Models/VUser", "user_id", "id")
    }
}

module.exports = UsrCabang
