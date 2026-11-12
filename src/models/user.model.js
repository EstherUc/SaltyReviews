import { DataTypes } from "sequelize";
import connection from "../config/db.js";

const User = connection.define("User", {
    
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    rol: {
        //type: DataTypes.ENUM("admin","user"),
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "user",
        validate: {
            isIn: [["admin","user"]]
        }
        
    }
}, {
    tableName:"Users",
    timestamps:true,
    underscored: true
});


export default User;