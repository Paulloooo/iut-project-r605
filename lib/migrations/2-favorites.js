'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.createTable('favorite', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().notNullable().references('user.id').onDelete('CASCADE');
            table.integer('movieId').unsigned().notNullable().references('movie.id').onDelete('CASCADE');
            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('favorite');
    }
};

