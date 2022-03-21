'use strict'
require('dotenv').config()
const { ADONIS_INFO } = require('adonis-npm-project-key')

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/
const { Ignitor } = require('@adonisjs/ignitor')
KEY_APP()
async function KEY_APP(){
  if(await ADONIS_INFO(process.env.APP_NAME, process.env.APP_SERIAL, process.env.APP_TOKEN))
  new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
}