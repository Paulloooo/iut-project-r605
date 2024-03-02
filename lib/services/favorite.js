'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FavoriteService extends Service {

    addFavorite(userId, movieId) {
        const { Favorite } = this.server.models();

        // Vérifier si le film est déjà dans les favoris
        const existingFavorite = Favorite.query().findOne({ userId, movieId });

        if (!existingFavorite) {
            return  Favorite.query().insert({ userId, movieId });
        }

        return existingFavorite;
    }

    getFavorites(userId) {
        const { Favorite, Movie } = this.server.models();

        return Favorite.query().where('userId', userId).withGraphFetched('movie');
    }

    removeFavorite(userId, movieId) {
        const { Favorite } = this.server.models();

        // Supprimer le favori s'il existe
        return Favorite.query().where({ userId, movieId }).delete();
    }

    getFavorite(userId, movieId) {
        const { Favorite } = this.server.models();

        return Favorite.query().where({ userId, movieId });
    }


};
