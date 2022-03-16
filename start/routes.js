'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')
Route.get('/', 'HomeController.index')
Route.post('/workspace', 'HomeController.workspace').as('auth.workspace')
Route.get('/login', 'AuthentifikasiController.index')
Route.post('/login', 'AuthentifikasiController.login')
Route.get('/logout', 'AuthentifikasiController.loggingOut').as('auth.logout')
