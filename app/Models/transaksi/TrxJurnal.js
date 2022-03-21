'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxJurnal extends Model {
    static boot () {
        super.boot()
        // this.addHook('beforeCreate', 'SaldoAwalHook.hitungSaldo')
        this.addHook('beforeCreate', 'TrxJurnalHook.hitungLabaRugiCreated')
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }
}

module.exports = TrxJurnal
