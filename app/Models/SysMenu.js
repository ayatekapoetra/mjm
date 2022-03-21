'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SysMenu extends Model {

    submenu(){
        return this.hasMany("App/Models/SysSubmenu", "id", "menu_id")
    }
}

module.exports = SysMenu
