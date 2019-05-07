'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
     
    */
   return queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@demo.com',
    createdAt: Sequelize.fn('NOW'),
    updatedAt: Sequelize.fn('NOW')
  },
  {
    firstName: 'Robert',
    lastName: 'Doe',
    email: 'demo@demo.com',
    createdAt: Sequelize.fn('NOW'),
    updatedAt: Sequelize.fn('NOW')
  },
  {
    firstName: 'Tony',
    lastName: 'Doe',
    email: 'demo@demo.com',
    createdAt: Sequelize.fn('NOW'),
    updatedAt: Sequelize.fn('NOW')
  },{
    firstName: 'Arrin',
    lastName: 'Doe',
    email: 'demo@demo.com',
    createdAt: Sequelize.fn('NOW'),
    updatedAt: Sequelize.fn('NOW')
  }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
