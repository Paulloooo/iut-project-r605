'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    create(movie) {
        const { Movie } = this.server.models();
        return Movie.query().insertAndFetch(movie);
    }

    getAll() {
        const { Movie } = this.server.models();
        return Movie.query();
    }

    deleteById(filmId) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(filmId);
    }

    updateById(filmId, updatedMovie) {
        const { Movie } = this.server.models();
        return Movie.query().patchAndFetchById(filmId, updatedMovie);
    }
};
