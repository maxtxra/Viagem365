"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("recomendacoes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recommendation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      destinoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "destinos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("recomendacoes");
  },
};
