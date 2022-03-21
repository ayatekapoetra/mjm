'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const UsrPrivilage = use("App/Models/UsrPrivilage")

class UpdateResource {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, request }, next) {
    const usr = await auth.getUser()
    const uri = (request.url()).split('/')
    const name = uri[2]

    console.log('MIDDLEWERE :::', uri);
    console.log('MIDDLEWERE :::', name);

    if(usr.usertype === 'administrator' || usr.usertype === 'developer'){
      await next()
    }else{
      const akses = await UsrPrivilage.query().where( w => {
        w.where('aktif', 'Y')
        w.where('update', 'Y')
        w.where('konten', name)
        w.where('user_id', usr.id)
      }).first()

      if(akses){
        await next()
      }else{
        console.log('Failed create middlewere authorization...');
        return
      }
    }
  }
}

module.exports = UpdateResource
