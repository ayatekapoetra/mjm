'use strict'

const _ = require('underscore')

const UsrMenu = use("App/Models/UsrMenu")
const SysMenu = use("App/Models/SysMenu")

class AksesMenu {
  
  async handle ({ params, response, auth, view }, next) {
    let user

    try {
      user = await auth.getUser()
      // console.log('Middleware Akses Menu ::::', user);
    } catch (error) {
      console.log('error handle :::', error);
      return response.route('/login')
    }
    
    try {
      let menuAkses = []
      const usrMenu = (
        await UsrMenu.query()
        .with('user')
        .with('menu')
        .with('submenu')
        .where( w => {
          w.where('user_id', 1)
          w.where('aktif', 'Y')
        })
        .fetch()
        ).toJSON()
        
      let groupingMenu = _.groupBy(usrMenu, 'menu_id')
        
      console.log('====================================');
      console.log(groupingMenu);
      console.log('====================================');
      
      groupingMenu = Object.keys(groupingMenu).map( key => {
        return {
          menu_id: key,
          submenu: groupingMenu[key].map( obj => {
            return {
              bisnis_id: params.unitbisnis,
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

      // console.log(JSON.stringify(menuAkses, null, 2));

      view.share({
        data: menuAkses,
        user: user.toJSON()
      })
    } catch (error) {
      return response.route('auth.login')
    }
    await next()
  }
}

module.exports = AksesMenu
