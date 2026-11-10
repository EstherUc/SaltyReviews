BEGIN;

-- 1. CATEGORÍAS
INSERT INTO "Categories" (name_category)
SELECT v.name_category
FROM (VALUES
  ('Italiana'), ('Japonesa'), ('Mexicana'), ('Hamburguesas'),
  ('Tradicional'), ('Vegetariana'), ('India'), ('Mediterránea')
) AS v(name_category)
WHERE NOT EXISTS (
  SELECT 1 FROM "Categories" c WHERE c.name_category = v.name_category
);

-- 2. USUARIOS
-- La aplicación debe permitir 'admin' solo mediante una operación autorizada.
INSERT INTO "Users" (username, email, password_hash, rol)
SELECT v.username, v.email,
       '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy',
       v.rol
FROM (VALUES
  ('admin',   'admin@demo.test',   'admin'),
  ('ana',     'ana@demo.test',     'user'),
  ('carlos',  'carlos@demo.test',  'user'),
  ('lucia',   'lucia@demo.test',   'user'),
  ('marcos',  'marcos@demo.test',  'user'),
  ('sara',    'sara@demo.test',    'user'),
  ('diego',   'diego@demo.test',   'user'),
  ('nerea',   'nerea@demo.test',   'user')
) AS v(username, email, rol)
WHERE NOT EXISTS (SELECT 1 FROM "Users" u WHERE u.email = v.email);

-- 3. RESTAURANTES
-- Relación: Restaurants.id_category -> Categories.id_category
INSERT INTO "Restaurants" (name_restaurant, address, id_category)
SELECT v.name_restaurant, v.address, c.id_category
FROM (VALUES
  ('La Trattoria',       'Calle Mayor 12, Bilbao',       'Italiana'),
  ('Pasta Bella',        'Calle Arenal 8, Bilbao',       'Italiana'),
  ('Sakura Sushi',       'Gran Via 24, Bilbao',          'Japonesa'),
  ('Nori House',         'Calle Ercilla 16, Bilbao',     'Japonesa'),
  ('Taco Loco',          'Calle Ledesma 5, Bilbao',      'Mexicana'),
  ('El Mariachi',        'Calle Colon 18, Bilbao',       'Mexicana'),
  ('Burger Station',     'Calle Autonomia 30, Bilbao',   'Hamburguesas'),
  ('La Parrilla',        'Calle San Mames 14, Bilbao',   'Tradicional'),
  ('Huerta Viva',        'Calle Diputacion 9, Bilbao',   'Vegetariana'),
  ('Curry Corner',       'Calle Hurtado 21, Bilbao',     'India'),
  ('Mar y Oliva',        'Paseo Campo Volantin 7',       'Mediterránea'),
  ('Bistro del Casco',   'Calle Somera 11, Bilbao',      'Tradicional')
) AS v(name_restaurant, address, category_name)
JOIN "Categories" c ON c.name_category = v.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM "Restaurants" r
  WHERE r.name_restaurant = v.name_restaurant AND r.address = v.address
);

-- 4. RESEÑAS
-- Relación: Reviews.id_user -> Users.id_user;
--           Reviews.id_restaurant -> Restaurants.id_restaurant
INSERT INTO "Reviews" (id_user, id_restaurant, rating, comment)
SELECT u.id_user, r.id_restaurant, v.rating, v.comment
FROM (VALUES
  ('ana',    'La Trattoria',     5, 'Pasta excelente y trato muy amable.'),
  ('carlos', 'La Trattoria',     4, 'Buena pizza y servicio rápido.'),
  ('lucia',  'Pasta Bella',      5, 'La lasaña estaba deliciosa.'),
  ('marcos', 'Pasta Bella',      3, 'Rico, pero tardaron bastante.'),
  ('sara',   'Sakura Sushi',     5, 'Sushi fresco y bien presentado.'),
  ('diego',  'Sakura Sushi',     4, 'Gran variedad de nigiris.'),
  ('nerea',  'Nori House',       4, 'El ramen estaba muy bueno.'),
  ('ana',    'Nori House',       3, 'Buena comida, local pequeño.'),
  ('carlos', 'Taco Loco',        5, 'Los tacos tienen mucho sabor.'),
  ('lucia',  'Taco Loco',        4, 'Salsas caseras y buen ambiente.'),
  ('marcos', 'El Mariachi',      4, 'Nachos muy completos.'),
  ('sara',   'El Mariachi',      3, 'Correcto, aunque algo caro.'),
  ('diego',  'Burger Station',   5, 'Hamburguesa jugosa y patatas crujientes.'),
  ('nerea',  'Burger Station',   4, 'Opciones variadas y buen pan.'),
  ('ana',    'La Parrilla',      5, 'Carne en su punto.'),
  ('carlos', 'Huerta Viva',      4, 'Platos vegetarianos originales.'),
  ('lucia',  'Curry Corner',     5, 'El curry estaba espectacular.'),
  ('marcos', 'Mar y Oliva',      4, 'Arroz sabroso y buenas raciones.'),
  ('sara',   'Bistro del Casco', 4, 'Comida casera y ambiente acogedor.'),
  ('diego',  'Mar y Oliva',      3, 'Buena calidad, pero servicio lento.')
) AS v(username, restaurant_name, rating, comment)
JOIN "Users" u ON u.username = v.username
JOIN "Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM "Reviews" re
  WHERE re.id_user = u.id_user AND re.id_restaurant = r.id_restaurant
    AND re.comment = v.comment
);

-- 5. FAVORITOS
-- Relación: Favorites.id_user -> Users.id_user;
--           Favorites.id_restaurant -> Restaurants.id_restaurant
INSERT INTO "Favorites" (id_user, id_restaurant, want_to_visit)
SELECT u.id_user, r.id_restaurant, v.want_to_visit
FROM (VALUES
  ('ana',    'Sakura Sushi',     TRUE),
  ('ana',    'La Trattoria',     FALSE),
  ('carlos', 'Burger Station',   FALSE),
  ('carlos', 'Taco Loco',        TRUE),
  ('lucia',  'Curry Corner',     FALSE),
  ('lucia',  'Mar y Oliva',      TRUE),
  ('marcos', 'Pasta Bella',      FALSE),
  ('marcos', 'La Parrilla',      TRUE),
  ('sara',   'Nori House',       TRUE),
  ('sara',   'Sakura Sushi',     FALSE),
  ('diego',  'Burger Station',   FALSE),
  ('diego',  'Bistro del Casco', TRUE),
  ('nerea',  'Huerta Viva',      TRUE),
  ('nerea',  'El Mariachi',      TRUE),
  ('nerea',  'Mar y Oliva',      FALSE)
) AS v(username, restaurant_name, want_to_visit)
JOIN "Users" u ON u.username = v.username
JOIN "Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM "Favorites" f
  WHERE f.id_user = u.id_user AND f.id_restaurant = r.id_restaurant
);

COMMIT;