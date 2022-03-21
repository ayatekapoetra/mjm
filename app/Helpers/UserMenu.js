'use strict'

const DB = use('Database')
const _ = require('underscore')
const initFunc = use("App/Helpers/initFunc")
const User = use("App/Models/User")
const UsrMenu = use("App/Models/UsrMenu")
const SysMenu = use("App/Models/SysMenu")
const SysSubmenu = use("App/Models/SysSubmenu")

class settingUsermenu {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        console.log(req);
        let data
        if(req.keyword){
            data = (await UsrMenu.query().where(
                w => {
                    if(req.user_id){
                        w.where('user_id', req.user_id)
                    }
                    if(req.menu_id){
                        w.where('menu_id', req.menu_id)
                    }
                    if(req.submenu_id){
                        w.where('submenu_id', req.submenu_id)
                    }
                }
            ).orderBy('user_id', 'desc')
            .paginate(halaman, limit)).toJSON()
        }else{
            data = (await UsrMenu.query().orderBy('user_id', 'desc').paginate(halaman, limit)).toJSON()
        }

        let result = []
        for (const obj of data.data) {
            const usr = await User.query().where('id', obj.user_id).last()
            const menu = await SysMenu.query().where('id', obj.menu_id).last()
            const submenu = await SysSubmenu.query().where('id', obj.submenu_id).last()
            result.push({
                ...obj,
                username: usr.username,
                usertype: usr.usertype,
                nm_menu: menu.name,
                nm_submenu: submenu.name,
                uri: submenu.uri
            })
        }
        return { ...data, data: result }
    }

    async POST (req) {
        let menuakses = await UsrMenu.query().where(req).last()
        if(menuakses){
            menuakses.merge({aktif: 'Y'})
        }else{
            menuakses = new UsrMenu()
            menuakses.fill(req)
        }

        try {
            await menuakses.save()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async SHOW (params) {
        const menuakses = await UsrMenu.query().where('id', params.id).last()
        return menuakses
    }

    async UPDATE (params, req) {
        const isDuplicate = await UsrMenu.query().where(req).last()
        let menuakses = await UsrMenu.query().where('id', params.id).last()
        if(isDuplicate){
            return {
                success: false,
                message: 'Duplicated save data...'
            }
        }
        try {
            menuakses.merge(req)
            await menuakses.save()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async DELETE (params) {
        let menuakses = await UsrMenu.query().where('id', params.id).last()
        try {
            menuakses.merge({aktif: menuakses.aktif === 'Y' ? 'N' : 'Y'})
            await menuakses.save()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

}

module.exports = new settingUsermenu()