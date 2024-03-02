'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const { comparePasswordSha1, encryptPasswordSha1 } = require('@paulloooo/iut-encrypt');


module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                password: Joi.string().min(8).required().description('Password of the user'),
                email: Joi.string().email().required().description('Email of the user'),
                username: Joi.string().alphanum().min(3).required().description('Username of the user')
            })
        }
    },
    handler: async (request, h) => {
        const { userService, mailService } = request.services();
        const userToMail = {
            firstName: request.payload.firstName,
            lastName: request.payload.lastName,
            email: request.payload.email
        }
        await mailService.sendMail(userToMail);
        return await userService.create(request.payload);
    }
},{
    method: 'get',
    path: '/users',
    options: {
        auth: {
            scope: ['admin', 'user']
        },
        tags: ['api']
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        return await userService.getAll();
    }
},{
    method: 'delete',
    path: '/user',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'],
        validate: {
            payload: Joi.object({
                id: Joi.number().integer().required().greater(0).example(1).description('The id of the user')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        await userService.deleteById(request.payload.id);

        return '';
    }
},{
    method: 'patch',
    path: '/user/{id}',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().min(1).required(),
            }),
            payload: Joi.object({
                firstName: Joi.string().min(3),
                lastName: Joi.string().min(3),
                username: Joi.string().alphanum().min(3).max(30),
                email: Joi.string().email(),
            }),
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.updateById(request.params.id, request.payload);
        }
    }
},
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                }),
            },
            handler: async (request, h) => {

                const { userService } = request.services();
                const user = await userService.getByEmail(request.payload.email);
                if (!user) {
                    throw Boom.unauthorized('Invalid email or password - no user');
                }

                if (!comparePasswordSha1(request.payload.password, user.password)) {
                    throw Boom.unauthorized('Invalid email or password - password mismatch');
                }

                const token = Jwt.token.generate(
                    {
                        aud: 'urn:audience:iut',
                        iss: 'urn:issuer:iut',
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        scope: user.role
                    },
                    {
                        key: 'random_string',
                        algorithm: 'HS512'
                    },
                    {
                        ttlSec: 14400 // 4 hours
                    }
                );

                return { token: token };
            },
        },
    },
    {
        method: 'post',
        path: '/favorite',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    movieId: Joi.number().integer().required().description('ID of the movie to add to favorites'),
                }),
            },
            handler: async (request, h) => {
                const { favoriteService } = request.services();
                const { movieService } = request.services();
                const currentUser = request.auth.credentials;
                const { movieId } = request.payload;


                // Vérifier si le film existe
                const existingMovie = await movieService.getById(movieId);
                if (!existingMovie) {
                    throw Boom.notFound('Movie not found');
                }

                // Vérifier si le favori existe déjà
                const existingFavorite = await favoriteService.getFavorite(currentUser.id, movieId);
                if (existingFavorite) {
                    throw Boom.conflict('Favorite already exists');
                }

                return await favoriteService.addFavorite(currentUser.id, movieId);
            }
        }
    },
    {
        method: 'get',
        path: '/favorites',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            handler: async (request, h) => {
                const { favoriteService } = request.services();
                const currentUser = request.auth.credentials;

                return await favoriteService.getFavorites(currentUser.id);
            }
        }
    },
    {
        method: 'delete',
        path: '/favorite/{movieId}',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required().description('ID of the movie to remove from favorites'),
                }),
            },
            handler: async (request, h) => {
                const { favoriteService } = request.services();
                const { movieService } = request.services();
                const currentUser = request.auth.credentials;
                const { movieId } = request.params;

                // Vérifier si le favori existe
                const existingMovie = await movieService.getById(movieId);
                if (!existingMovie) {
                    throw Boom.notFound('Movie not found');
                }


                return await favoriteService.removeFavorite(currentUser.id, movieId);
            }
        }
    }



];
