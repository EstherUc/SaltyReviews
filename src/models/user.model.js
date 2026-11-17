import { DataTypes } from "sequelize";
import connection from "../config/db.js";
import bcrypt from "bcrypt";

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


//cifra al crear el usuario
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password_hash,10);
  user.password_hash = hashedPassword;
});

//cifra cuando se modifica
User.beforeUpdate(async (user) => {
    if(user.changed("password_hash")){
        const hashedPassword = await bcrypt.hash(user.password_hash,10);
        user.password_hash = hashedPassword;
    }
});


export default User;