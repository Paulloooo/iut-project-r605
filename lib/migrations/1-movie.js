'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('movie', (table) => {

            table.increments('id').primary();
            table.string('title').notNull();
            table.text('description');
            table.date('releaseDate');
            table.string('director');
            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        // Exemple d'insertion de films
        //await knex('movie').insert([
        //    { title: 'Inception', description: 'Mind-bending thriller', year: 2010, genre: 'Sci-Fi', director: 'Christopher Nolan' },
        //    { title: 'The Shawshank Redemption', description: 'Drama about a man in prison', year: 1994, genre: 'Drama', director: 'Frank Darabont' },
        //    { title: 'The Dark Knight', description: 'Superhero action film', year: 2008, genre: 'Action', director: 'Christopher Nolan' }
        //]);
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('movie');
    }
};
