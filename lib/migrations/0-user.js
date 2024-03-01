'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('user', (table) => {

            table.increments('id').primary();
            table.string('firstName').notNull();
            table.string('lastName').notNull();

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        await knex('user').insert([
            { firstName: 'Thomas', lastName: 'Calvasse' },
            { firstName: 'Samuel', lastName: 'Pastis' },
            { firstName: 'Maxime', lastName: 'Harceleur' }
        ]);
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
