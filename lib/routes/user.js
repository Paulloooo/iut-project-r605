'use strict';

const Joi = require('joi');
const { encryptPasswordSha1 } = require('@paulloooo/iut-encrypt');


module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
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
        const { userService } = request.services();
        return await userService.create(request.payload);
    }
},{
    method: 'get',
    path: '/users',
    options: {
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
}
];
