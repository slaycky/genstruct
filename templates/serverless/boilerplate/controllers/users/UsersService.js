const sequelize = require('../../config/database');
const Sequelize = require('sequelize');
const User = require("../../models/user.js")(sequelize, Sequelize);

// TODO: resole promise / async function
// possible race condition
User.sync();


const getAll = function (event, ct, callback) {

    User.findAll().then(projects => {

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                data: projects,
                status: true,
            }),
        };

        console.log(response);
        callback(null, response);
    })

};

const deleteById = (event, ctx, cb) => {
    const body = event.body ? event.body : {};
    const { id } = body;
    const response = {
        statusCode: 200,
        body: {},
    };
    User.destroy({ where: id }).then(deleted => {
        response.body = {
            data: deleted,
            status: true,
        };
    }).catch(error => {
        if (error) {
            console.log(error);
        }
    })
    .finally(() => {
        cb(null, JSON.stringify(response));
    })
}

const create = (event, ctx, cb) => {
    const body = event.body ? event.body : {};
    const data = JSON.parse(body);

    const response = {
        statusCode: 200,
        body: {},
    };
    const {
        fullName,
        shortName,
        homeGround,
        logo,
        staff,
        description
    } = body;
    console.log(body);
    User.create({
        full_name: fullName,
        short_name: shortName,
        home_ground: homeGround,
        logo: logo,
        staff: staff,
        description: description,
    })
        .then(UserRecord => {
            response.body = {
                    data: UserRecord,
                    status: true,
                };
        })
        .catch(error => {
            if (error) {
                console.log(error);
            }
        })
        .finally(() => {
            cb(null, JSON.stringify(response));
        })
}

const update = (event, ctx, cb) => {
    const body = event.body ? event.body : {};
    const response = {
        statusCode: 200,
        body: {},
    };
    const {
        fullName,
        shortName,
        homeGround,
        logo,
        staff,
        description
    } = body;
    console.log(body);
    User.update({
        full_name: fullName,
        short_name: shortName,
        home_ground: homeGround,
        logo: logo,
        staff: staff,
        description: description,
    },{ where: id })
    .then(updated => {
        response.body = {
            data: updated,
            status: true,
        };
    }).catch(error => {
        if (error) {
            console.log(error);
        }
    })
    .finally(() => {
        cb(null, JSON.stringify(response));
    })
}

module.exports = {
    create,
    getAll,
    update,
    deleteById
}