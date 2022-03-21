'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UsrMenu extends Model {
    user () {
        return this.belongsTo("App/Models/User", "user_id", "id")
    }

    menu () {
        return this.belongsTo("App/Models/SysMenu", "menu_id", "id")
    }

    submenu () {
        return this.belongsTo("App/Models/SysSubmenu", "submenu_id", "id")
    }
}

module.exports = UsrMenu
