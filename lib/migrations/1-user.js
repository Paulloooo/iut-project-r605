'use strict';

module.exports = {

    async up(knex) {

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
