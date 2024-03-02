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

    //await knex('user').insert([
      //      { firstName: 'Thomas', lastName: 'Calvasse', username: 'thomas123', email: 'thomas@example.com', password: 'password123' },
        //    { firstName: 'Samuel', lastName: 'Pastis', username: 'samuel456', email: 'samuel@example.com', password: 'password456' },
         //   { firstName: 'Maxime', lastName: 'Harceleur', username: 'maxime789', email: 'maxime@example.com', password: 'password789' }
       // ]);
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
