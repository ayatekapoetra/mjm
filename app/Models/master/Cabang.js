'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cabang extends Model {
    static get table(){
        return 'mas_cabangs'
    }

    gudang () {
        return this.hasMany("App/Models/master/Gudang", "id", "cabang_id")
    }
}

module.exports = Cabang
