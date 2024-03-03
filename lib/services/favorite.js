'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FavoriteService extends Service {

    addFavorite(userId, movieId) {
        const { Favorite } = this.server.models();

        return Favorite.query().insert({ userId, movieId });
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

    async getFavoriteByMovieId(movieId) {
        const { Favorite, User } = this.server.models();

        const favorites = await Favorite.query()
            .where('movieId', movieId);

        if (!favorites || favorites.length === 0) {
            return [];
        }

        const userIds = favorites.map(favorite => favorite.userId);
        const users = await User.query().findByIds(userIds);

        return users;
    }



};
