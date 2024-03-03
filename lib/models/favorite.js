'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorite extends Model {

    static get tableName() {
        return 'favorite';
    }

    static get joiSchema() {
        return Joi.object({
            userId: Joi.number().integer().greater(0).description('User ID'),
            movieId: Joi.number().integer().greater(0).description('Movie ID'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

    static get relationMappings() {
        const Movie = require('./movie');
        const User = require('./user'); // Assurez-vous d'importer le modèle User

        return {
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: {
                    from: 'favorite.movieId',
                    to: 'movie.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorite.userId',
                    to: 'user.id'
                }
            }
        };
    }

};
