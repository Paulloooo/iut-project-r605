'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('user', (table) => {

            table.increments('id').primary();
            table.string('firstName').notNull();
            table.string('lastName').notNull();
            table.string('username').notNull();
            table.string('email').notNull().unique();
            table.string('password').notNull()
            table.string('role').notNull().defaultTo('user');

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        await knex('user').insert([
            { firstName: 'admin', lastName: 'admin', username: 'admin', email: 'admin@example.com', password: encryptPasswordSha1('admin') },
        ]);

    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
