'use strict';

const Joi = require('joi');
const { encryptPasswordSha1, comparePasswordSha1 } = require('@paulloooo/iut-encrypt');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            username: Joi.string().alphanum().min(3).required().description('Username of the user'),
            email: Joi.string().email().required().description('Email of the user'),
            password: Joi.string().min(8).required().description('Password of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        this.password = encryptPasswordSha1(this.password);
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();

        const oldUser = this.constructor.query().findById(this.id);

        if (oldUser && !comparePasswordSha1(this.password, oldUser.password)) {
            this.password = encryptPasswordSha1(this.password);
        }
    }

};
