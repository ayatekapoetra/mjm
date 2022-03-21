'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cash extends Model {
    static get table(){
        return 'mas_kass'
    }
}

module.exports = Cash
