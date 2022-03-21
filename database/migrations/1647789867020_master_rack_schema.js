'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RackSchema extends Schema {
  up () {
    this.create('mas_racks', (table) => {
      table.increments()
      table.integer('cabang_id').unsigned().references('id').inTable('mas_cabangs').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('gudang_id').unsigned().references('id').inTable('mas_gudangs').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('kode', 10).notNullable()
      table.string('name', 100).notNullable()
      table.string('keterangan', 200).defaultTo('')
      table.enu('aktif', ['Y', 'N']).defaultTo('Y')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('mas_racks')
  }
}

module.exports = RackSchema
