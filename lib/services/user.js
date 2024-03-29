'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(user){

        const { User } = this.server.models();
        return User.query().insertAndFetch(user);
    }

    getAll(){

        const { User } = this.server.models();

        return User.query();
    }

    deleteById(userId){

        const { User } = this.server.models();
        return User.query().deleteById(userId);
    }

    updateById(userId, user){

        const { User } = this.server.models();
        return User.query().patchAndFetchById(userId, user);
    }

    getByEmail(email){

        const { User } = this.server.models();
        return User.query().where('email', email).first();
    }

    getAllUsersScope(){
        const { User } = this.server.models();
        return User.query().where('role', 'user');
    }

    getById(userId){
        const { User } = this.server.models();
        return User.query().findById(userId);
    }
};
