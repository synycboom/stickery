import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface CategoryAttributes {
  id: number;
  name: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

export default function(sequelize: Sequelize) {
  return sequelize.define<Model<CategoryAttributes, CategoryCreationAttributes>>('category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
