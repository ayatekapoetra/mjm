'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SysConfig extends Model {
    static get table(){
        return 'sys_config'
    }
}

module.exports = SysConfig
