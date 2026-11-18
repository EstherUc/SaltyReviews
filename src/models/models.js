/**
 * @file Centraliza los modelos de Sequelize y define
 * las relaciones entre las tablas de la base de datos.
 */


import User from './user.model.js';
import Restaurant from './restaurant.model.js';
import Category from './category.model.js';
import Review from './review.model.js';
import Favorite from './favorite.model.js';


// ------------ CATEGORIES Y RESTAURANTS ----------

/**
 * Relación uno a muchos entre Category y Restaurant.
 *
 * Una categoría puede tener varios restaurantes.
 * La clave foránea id_category se encuentra en Restaurant.
 */
Category.hasMany(Restaurant,{foreignKey: 'id_category', as: 'restaurants'});

/**
 * Relación muchos a uno entre Restaurant y Category.
 *
 * Cada restaurante pertenece a una categoría.
 */
Restaurant.belongsTo(Category, {foreignKey: 'id_category', as: 'category'});


// ---------- USERS Y REVIEWS ----------

/**
 * Relación uno a muchos entre User y Review.
 *
 * Un usuario puede escribir varias reseñas.
 * La clave foránea id_user se encuentra en Review.
 */
User.hasMany(Review, { foreignKey: 'id_user', as: 'reviews' });

/**
 * Relación muchos a uno entre Review y User.
 *
 * Cada reseña pertenece a un usuario.
 */
Review.belongsTo(User, { foreignKey: 'id_user', as: 'user' });


// ---------- RESTAURANTS Y REVIEWS ----------

/**
 * Relación uno a muchos entre Restaurant y Review.
 *
 * Un restaurante puede tener varias reseñas.
 * La clave foránea id_restaurant se encuentra en Review.
 */
Restaurant.hasMany(Review, { foreignKey: 'id_restaurant', as: 'reviews' });


/**
 * Relación muchos a uno entre Review y Restaurant.
 *
 * Cada reseña pertenece a un restaurante.
 */
Review.belongsTo(Restaurant, { foreignKey: 'id_restaurant', as: 'restaurant' });


// ---------- USERS Y FAVORITES ----------

/**
 * Relación uno a muchos entre User y Favorite.
 *
 * Un usuario puede tener varios restaurantes favoritos.
 * La clave foránea id_user se encuentra en Favorite.
 */
User.hasMany(Favorite, {foreignKey: 'id_user', as: 'favorites'});


/**
 * Relación muchos a uno entre Favorite y User.
 *
 * Cada registro de favoritos pertenece a un usuario.
 */
Favorite.belongsTo(User, {foreignKey: 'id_user', as: 'user'});


// ---------- RESTAURANTS Y FAVORITES ----------

/**
 * Relación uno a muchos entre Restaurant y Favorite.
 *
 * Un restaurante puede aparecer en los favoritos
 * de varios usuarios.
 * La clave foránea id_restaurant se encuentra en Favorite.
 */
Restaurant.hasMany(Favorite, {foreignKey: 'id_restaurant', as: 'favorites'});


/**
 * Relación muchos a uno entre Favorite y Restaurant.
 *
 * Cada registro de favoritos está asociado a un restaurante.
 */
Favorite.belongsTo(Restaurant, {foreignKey: 'id_restaurant', as: 'restaurant'});


export {
  User,
  Restaurant,
  Category,
  Review,
  Favorite
}