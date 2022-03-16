'use strict'

const Token = use("App/Models/Token")

class AuthentifikasiController {
    async index ( { view } ) {
        return view.render('login')
    }

    async login ( { auth, request, response, view } ) {
        const req = request.all()
        try {
            const usr = await auth.attempt(req.username, req.password)
            // console.log('SUCCESS LOGIN...', usr);
            response.redirect('/')
        } catch (error) {
            console.log(error)
            response.redirect('/login')
        }
    }

    async loggingOut ({auth, response}) {
        const usr = await auth.getUser()
        await Token.query().where('user_id', usr.id).delete()
        await auth.logout()
        return response.redirect('/login')
    }
}

module.exports = AuthentifikasiController
