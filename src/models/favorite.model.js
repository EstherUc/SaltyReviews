import { DataTypes, Utils } from "sequelize";
import connection from "../config/db.js";


const Favorite = connection.define("Favorite", {
    id_favorites: {
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

    want_to_visit: {
        type: DataTypes.BOOLEAN,
        allowNull: true,

    }, 

     }, { 
    
        tableName: "Favorites",
        timestamps: true,
        underscored: true //Convierte automáticamente los nombres de las columnas de camelCase (en JS) a snake_case (en la base de datos), como created_at o usuario_id. 

});

export default Favorite