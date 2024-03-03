'use strict';

const { Service } = require('@hapipal/schmervice');
const RabbitMQ = require('../rabbitmq');
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

    getById(filmId) {
        const { Movie } = this.server.models();
        return Movie.query().findById(filmId);
    }

    async sendExportCSVRequest(adminId) {
        await RabbitMQ.connect();
        await RabbitMQ.sendToQueue('export-csv-request', { adminId });
    }

};
