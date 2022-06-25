'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Gudang extends Model {
    static get table(){
        return 'mas_gudangs'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    rack () {
        return this.hasMany("App/Models/master/rack", "id", "gudang_id")
    }
}

module.exports = Gudang
