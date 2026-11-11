// Datos de prueba equivalentes al seed SQL, para usar sin PostgreSQL.
// Los IDs son ficticios y NO tienen por qué coincidir con los IDENTITY reales.
// Contraseña de las cuentas de demostración: Demo1234!

const passwordHash = '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy';

const categories = [
  { id_category: 1, name_category: 'Italiana' },
  { id_category: 2, name_category: 'Japonesa' },
  { id_category: 3, name_category: 'Mexicana' },
  { id_category: 4, name_category: 'Hamburguesas' },
  { id_category: 5, name_category: 'Tradicional' },
  { id_category: 6, name_category: 'Vegetariana' },
  { id_category: 7, name_category: 'India' },
  { id_category: 8, name_category: 'Mediterránea' },
];

const users = [
  { id_user: 1, username: 'admin', email: 'admin@demo.test', password_hash: passwordHash, rol: 'admin' },
  { id_user: 2, username: 'ana', email: 'ana@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 3, username: 'carlos', email: 'carlos@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 4, username: 'lucia', email: 'lucia@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 5, username: 'marcos', email: 'marcos@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 6, username: 'sara', email: 'sara@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 7, username: 'diego', email: 'diego@demo.test', password_hash: passwordHash, rol: 'user' },
  { id_user: 8, username: 'nerea', email: 'nerea@demo.test', password_hash: passwordHash, rol: 'user' },
];

const restaurants = [
  { id_restaurant: 1, name_restaurant: 'La Trattoria', address: 'Calle Mayor 12, Bilbao', id_category: 1 },
  { id_restaurant: 2, name_restaurant: 'Pasta Bella', address: 'Calle Arenal 8, Bilbao', id_category: 1 },
  { id_restaurant: 3, name_restaurant: 'Sakura Sushi', address: 'Gran Via 24, Bilbao', id_category: 2 },
  { id_restaurant: 4, name_restaurant: 'Nori House', address: 'Calle Ercilla 16, Bilbao', id_category: 2 },
  { id_restaurant: 5, name_restaurant: 'Taco Loco', address: 'Calle Ledesma 5, Bilbao', id_category: 3 },
  { id_restaurant: 6, name_restaurant: 'El Mariachi', address: 'Calle Colon 18, Bilbao', id_category: 3 },
  { id_restaurant: 7, name_restaurant: 'Burger Station', address: 'Calle Autonomia 30, Bilbao', id_category: 4 },
  { id_restaurant: 8, name_restaurant: 'La Parrilla', address: 'Calle San Mames 14, Bilbao', id_category: 5 },
  { id_restaurant: 9, name_restaurant: 'Huerta Viva', address: 'Calle Diputacion 9, Bilbao', id_category: 6 },
  { id_restaurant: 10, name_restaurant: 'Curry Corner', address: 'Calle Hurtado 21, Bilbao', id_category: 7 },
  { id_restaurant: 11, name_restaurant: 'Mar y Oliva', address: 'Paseo Campo Volantin 7', id_category: 8 },
  { id_restaurant: 12, name_restaurant: 'Bistro del Casco', address: 'Calle Somera 11, Bilbao', id_category: 5 },
];

const reviews = [
  { id_reviews: 1, id_user: 2, id_restaurant: 1, title: 'Pasta excelente', rating: 5, comment: 'Pasta excelente y trato muy amable.' },
  { id_reviews: 2, id_user: 3, id_restaurant: 1, title: 'Buena pizza', rating: 4, comment: 'Buena pizza y servicio rápido.' },
  { id_reviews: 3, id_user: 4, id_restaurant: 2, title: 'Lasaña deliciosa', rating: 5, comment: 'La lasaña estaba deliciosa.' },
  { id_reviews: 4, id_user: 5, id_restaurant: 2, title: 'Servicio mejorable', rating: 3, comment: 'Rico, pero tardaron bastante.' },
  { id_reviews: 5, id_user: 6, id_restaurant: 3, title: 'Sushi espectacular', rating: 5, comment: 'Sushi fresco y bien presentado.' },
  { id_reviews: 6, id_user: 7, id_restaurant: 3, title: 'Gran variedad', rating: 4, comment: 'Gran variedad de nigiris.' },
  { id_reviews: 7, id_user: 8, id_restaurant: 4, title: 'Ramen muy bueno', rating: 4, comment: 'El ramen estaba muy bueno.' },
  { id_reviews: 8, id_user: 2, id_restaurant: 4, title: 'Local pequeño', rating: 3, comment: 'Buena comida, local pequeño.' },
  { id_reviews: 9, id_user: 3, id_restaurant: 5, title: 'Tacos increíbles', rating: 5, comment: 'Los tacos tienen mucho sabor.' },
  { id_reviews: 10, id_user: 4, id_restaurant: 5, title: 'Buen ambiente', rating: 4, comment: 'Salsas caseras y buen ambiente.' },
  { id_reviews: 11, id_user: 5, id_restaurant: 6, title: 'Nachos completos', rating: 4, comment: 'Nachos muy completos.' },
  { id_reviews: 12, id_user: 6, id_restaurant: 6, title: 'Un poco caro', rating: 3, comment: 'Correcto, aunque algo caro.' },
  { id_reviews: 13, id_user: 7, id_restaurant: 7, title: 'Hamburguesa excelente', rating: 5, comment: 'Hamburguesa jugosa y patatas crujientes.' },
  { id_reviews: 14, id_user: 8, id_restaurant: 7, title: 'Buenas opciones', rating: 4, comment: 'Opciones variadas y buen pan.' },
  { id_reviews: 15, id_user: 2, id_restaurant: 8, title: 'Carne perfecta', rating: 5, comment: 'Carne en su punto.' },
  { id_reviews: 16, id_user: 3, id_restaurant: 9, title: 'Vegetariano original', rating: 4, comment: 'Platos vegetarianos originales.' },
  { id_reviews: 17, id_user: 4, id_restaurant: 10, title: 'Curry espectacular', rating: 5, comment: 'El curry estaba espectacular.' },
  { id_reviews: 18, id_user: 5, id_restaurant: 11, title: 'Arroz muy sabroso', rating: 4, comment: 'Arroz sabroso y buenas raciones.' },
  { id_reviews: 19, id_user: 6, id_restaurant: 12, title: 'Ambiente acogedor', rating: 4, comment: 'Comida casera y ambiente acogedor.' },
  { id_reviews: 20, id_user: 7, id_restaurant: 11, title: 'Servicio lento', rating: 3, comment: 'Buena calidad, pero servicio lento.' },
];

const favorites = [
  { id_favorites: 1, id_user: 2, id_restaurant: 3, want_to_visit: true },
  { id_favorites: 2, id_user: 2, id_restaurant: 1, want_to_visit: false },
  { id_favorites: 3, id_user: 3, id_restaurant: 7, want_to_visit: false },
  { id_favorites: 4, id_user: 3, id_restaurant: 5, want_to_visit: true },
  { id_favorites: 5, id_user: 4, id_restaurant: 10, want_to_visit: false },
  { id_favorites: 6, id_user: 4, id_restaurant: 11, want_to_visit: true },
  { id_favorites: 7, id_user: 5, id_restaurant: 2, want_to_visit: false },
  { id_favorites: 8, id_user: 5, id_restaurant: 8, want_to_visit: true },
  { id_favorites: 9, id_user: 6, id_restaurant: 4, want_to_visit: true },
  { id_favorites: 10, id_user: 6, id_restaurant: 3, want_to_visit: false },
  { id_favorites: 11, id_user: 7, id_restaurant: 7, want_to_visit: false },
  { id_favorites: 12, id_user: 7, id_restaurant: 12, want_to_visit: true },
  { id_favorites: 13, id_user: 8, id_restaurant: 9, want_to_visit: true },
  { id_favorites: 14, id_user: 8, id_restaurant: 6, want_to_visit: true },
  { id_favorites: 15, id_user: 8, id_restaurant: 11, want_to_visit: false },
];

// Exportamos los arrays para poder utilizarlos en otros archivos
export { categories, 
          users, 
          restaurants, 
          reviews, 
          favorites 
};
