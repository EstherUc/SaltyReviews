//centralizamos aquí los modelos y definimos sus relaciones

import User from './user.model.js';
import Restaurant from './restaurant.model.js';
import Category from './category.model.js';
import Review from './review.model.js';
import Favorite from './favorite.model.js';


// ------------ CATEGORIES Y RESTAURANTS ----------

//una categoria tiene muchos restaurantes
Category.hasMany(Restaurant,{foreignKey: 'id_category', as: 'category'});

//un restaurante pertenece a una categoria
Restaurant.belongsTo(Category, {foreignKey: 'id_category', as: 'category'});


// ---------- USERS Y REVIEWS ----------

//un usuario tiene muchas reseñas
User.hasMany(Review, {foreignKey: 'id_user', as: 'reviews'});

//una reseña pertenece a un usuario
Review.belongsTo(User, {foreignKey: 'id_user', as: 'user'});


// ---------- RESTAURANTS Y REVIEWS ----------

//un restaurante tiene muchas reseñas
Restaurant.hasMany(Review, {foreignKey: 'id_restaurant', as: 'reviews'});

//una reseña pertenece a un restaurante
Review.belongsTo(Restaurant, { foreignKey: 'id_restaurant', as: 'restaurant'});


// ---------- USERS Y FAVORITES ----------

//un usuario tiene muchos favoritos
User.hasMany(Favorite, {foreignKey: 'id_user', as: 'favorites'});

//un favorito pertenece a un usuario
Favorite.belongsTo(User, {foreignKey: 'id_user', as: 'user'});


// ---------- RESTAURANTS Y FAVORITES ----------

//un restaurante aparece en muchos favoritos
Restaurant.hasMany(Favorite, {foreignKey: 'id_restaurant', as: 'favorites'});

//un favorito pertenece a un restaurante
Favorite.belongsTo(Restaurant, {foreignKey: 'id_restaurant', as: 'restaurant'});


export{
  User,
  Restaurant,
  Category,
  Review,
  Favorite
}