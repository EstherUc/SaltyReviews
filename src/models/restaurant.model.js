import { DataTypes } from "sequelize";
import connection from "../config/db.js"; 

const Restaurant = connection.define("Restaurant", {
id_restaurant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
name_restaurant: {
    type: DataTypes.STRING(100),
},
address: {
    type: DataTypes.STRING(150),
},
id_category: {
    type: DataTypes.INTEGER,

}
},{
    tableName: "Restaurants",
    timestamps: false


});

export default Restaurant;

