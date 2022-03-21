'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SysSubmenu extends Model {
    menu(){
        return this.belongsTo('App/Models/SysMenu', 'menu_id', 'id')
    }
}

module.exports = SysSubmenu
