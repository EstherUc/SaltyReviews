import { DataTypes } from "sequelize";
import connection from "../config/db.js";

const Category = connection.define("Category", {
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: "Categories",
    timestamps: true, // asegurarse de que tiene created_at, updated_at
    underscored: true,
});

export default Category;