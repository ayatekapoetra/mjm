'use strict'

const User = use("App/Models/User")
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const UsrWorkspace = use("App/Models/UsrWorkspace")

class HomeController {
    async index ( { auth, response, view } ) {
        try {
            const usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)

            console.log('----', usr);
             /** ADD USER MENU **/
             await initFunc.POST_ACCESS_MENU(usr.id)
             
             /** ADD USER ACCESS **/
            //  await initFunc.POST_RESOURCES_ACCESS(usr.id)
             
             let user = (await User.query().with('bisnisUnit').with('workspace').where('id', usr.id).last()).toJSON() || null
             user = user.bisnisUnit.map(el => {
                 return {
                     ...el,
                     bisnis_id: user.workspace?.bisnis_id || null
                 }
             })
            return view.render('welcome', {
                bisnis : user,
                user: usr.email,
                menu: sideMenu
            })
        } catch (error) {
            console.log(error)
            return view.render('login')
        }
    }

    async workspace ({ auth, request }) {
        const usr = await auth.getUser()
        const req = request.only(['bisnis_id'])
        
        let usrWorkspace = await UsrWorkspace.query().where('user_id', usr.id).last()
        // console.log('usrWorkspace:::', usrWorkspace);

        if(!usrWorkspace){
            usrWorkspace = new UsrWorkspace()
            usrWorkspace.fill({
                user_id: usr.id,
                bisnis_id: req.bisnis_id
            })
        }else{
            usrWorkspace.merge({
                user_id: usr.id,
                bisnis_id: req.bisnis_id
            })
        }

        try {
            await usrWorkspace.save()
            return {
                success: true,
                meesage: 'success change work space...'
            }
        } catch (error) {
            console.log(eror);
        }
        
    }
}

module.exports = HomeController
