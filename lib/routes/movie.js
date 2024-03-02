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
            return await movieService.create(request.payload);
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
                const { movieService } = request.services();
                return await movieService.updateById(request.params.id, request.payload);
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
    }
];
