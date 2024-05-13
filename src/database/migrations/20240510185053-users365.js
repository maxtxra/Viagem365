'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('users365', {
       id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
       },
       email: {
        allowNull: false,
        type: Sequelize.STRING(320) // 64 octetos max, rfc5321 4.5.3.1.1
      },
       name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING
      },
      document_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dt_birth: {
        allowNull: false,
        type: Sequelize.DATE
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      post_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
       updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users365');
  }
};
