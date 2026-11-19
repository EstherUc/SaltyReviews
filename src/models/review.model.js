import { DataTypes, Utils } from "sequelize";
import connection from "../config/db.js";

const Review = connection.define("Review", {
    id_reviews: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_restaurant: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT(300),
        allowNull: false,
    },
}, {
    tableName: "Reviews",
    timestamps: true, // asegurarse de que tiene created_at, updated_at
    underscored: true,
});

export default Review;