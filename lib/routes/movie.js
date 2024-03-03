'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');


module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(3).example('Inception').description('Title of the film'),
                    director: Joi.string().required().min(3).example('Christopher Nolan').description('Director of the film'),
                    description: Joi.string().example('Sci-Fi').description('Genre of the film'),
                    releaseDate: Joi.date().description('Release date of the film')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            const newMovie = await movieService.create(request.payload);
            const { userService, mailService } = request.services();
            const users = await userService.getAllUsersScope();
            users.forEach(user => {
                mailService.sendMailNewMovie(newMovie, user);
            });

            return newMovie;
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            return await movieService.getAll();
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required()
                }),
                payload: Joi.object({
                    title: Joi.string().min(3),
                    director: Joi.string().min(3),
                    description: Joi.string(),
                    releaseDate: Joi.date()
                })
            },
            handler: async (request, h) => {
                const { movieService, mailService, favoriteService } = request.services();

                await movieService.updateById(request.params.id, request.payload);

                const users = await favoriteService.getFavoriteByMovieId(request.params.id);
                const newMovie = await movieService.getById(request.params.id);
                users.forEach(user => {
                    mailService.sendMailMovieModification(newMovie, user);
                });
                return newMovie;
            }
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required()
                })
            },
            handler: async (request, h) => {
                const { movieService } = request.services();
                await movieService.deleteById(request.params.id);
                return '';
            }
        }
    },
    {
        method: 'post',
        path: '/send-export-csv-request',
        options : {
            auth: {
                scope: ['admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            await movieService.sendExportCSVRequest(request.auth.credentials.id);
            return 'Export CSV demandé avec succès !';
        }
    }
];
