'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GajiHistory extends Model {
    static get table(){
        return 'hr_gaji_history'
    }
}

module.exports = GajiHistory
