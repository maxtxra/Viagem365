'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios365', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(320) // Capacidade adequada conforme RFC 5321
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING
      },
      document_number: { // Corrigido: adicionado dois-pontos
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
      statecountry: {
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
    await queryInterface.dropTable('usuarios365'); // Corrigido para corresponder à tabela criada
  }
};
