'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VPrivilage extends Model {
    static get table(){
        return 'v_privilages'
    }
}

module.exports = VPrivilage
