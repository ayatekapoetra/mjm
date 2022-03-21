'use strict'

const _ = require('underscore')
const VUser = use("App/Models/VUser")
const UsrMenu = use("App/Models/UsrMenu")
const SysMenu = use("App/Models/SysMenu")
const UsrWorkspace = use("App/Models/UsrWorkspace")

class userSideBar {
    async SIDEBAR (user_id) {
        // const user = await VUser.query().where('id', user_id).last()
        const bisnisunit = await UsrWorkspace.query().where('user_id', user_id).last()
        
        
        let menuAkses = []
        const usrMenu = (
            await UsrMenu.query()
            .with('user')
            .with('menu')
            .with('submenu')
            .where( w => {
                w.where('user_id', user_id)
                w.where('aktif', 'Y')
            })
            .fetch()
        ).toJSON()

        // console.log(usrMenu);
        
        let groupingMenu = _.groupBy(usrMenu, 'menu_id')
        groupingMenu = Object.keys(groupingMenu).map( key => {
          return {
            menu_id: key,
            submenu: groupingMenu[key].map( obj => {
              return {
                bisnis_id: bisnisunit?.id || 1,
                submenu_id: obj.submenu.id,
                name: obj.submenu.name,
                icon: obj.submenu.icon,
                uri: obj.submenu.uri,
                urut: obj.submenu.urut,
                kode: obj.submenu.kode
              }
            })
          }
        })

        // console.log(JSON.stringify(groupingMenu, null, 2));

        for (const val of groupingMenu) {
          const menu = await SysMenu.query().where('id', val.menu_id).last()
  
          menuAkses.push({
            ...val,
            name: menu.name,
            icon: menu.icon,
            uri: menu.uri,
            urut: menu.urut,
            kode: menu.kode
          })
        }

        return menuAkses
    }
}

module.exports = new userSideBar()