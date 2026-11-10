-- Datos NUEVOS de prueba compatibles con el esquema actualizado de pgAdmin.
-- PostgreSQL. Ejecutar tras crear las cinco tablas.
-- Incluye title y comment obligatorios en Reviews.
-- Clave de las cuentas demo: Demo1234! (hash bcrypt; solo desarrollo).
-- Es repetible sin duplicar los registros de este lote, suponiendo nombres únicos.

BEGIN;

INSERT INTO public."Categories" (name_category)
SELECT v.name_category FROM (VALUES
  ('Vasca'), ('China'), ('Tailandesa'), ('Peruana'),
  ('Pizzería'), ('Cafetería')
) AS v(name_category)
WHERE NOT EXISTS (
  SELECT 1 FROM public."Categories" c WHERE c.name_category = v.name_category
);

INSERT INTO public."Users" (username, email, password_hash, rol)
SELECT v.username, v.email,
       '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy',
       v.rol
FROM (VALUES
  ('irene',  'irene@demo.test',  'user'),
  ('pablo',  'pablo@demo.test',  'user'),
  ('aitor',  'aitor@demo.test',  'user'),
  ('maite',  'maite@demo.test',  'user'),
  ('julia',  'julia@demo.test',  'user'),
  ('hugo',   'hugo@demo.test',   'user')
) AS v(username, email, rol)
WHERE NOT EXISTS (SELECT 1 FROM public."Users" u WHERE u.email = v.email);

INSERT INTO public."Restaurants" (name_restaurant, address, id_category)
SELECT v.restaurant_name, v.address, c.id_category
FROM (VALUES
  ('Asador Arriaga',    'Calle Ribera 10, Bilbao',          'Vasca'),
  ('Itsas Etxea',       'Calle Jardines 6, Bilbao',        'Vasca'),
  ('Dragón Rojo',      'Calle Iparraguirre 22, Bilbao',    'China'),
  ('Bambú Oriental',    'Calle Buenos Aires 13, Bilbao',   'China'),
  ('Bangkok Sabores',   'Calle Licenciado Poza 19, Bilbao','Tailandesa'),
  ('Lima Limón',       'Calle Henao 31, Bilbao',           'Peruana'),
  ('Ceviche Norte',     'Calle Alameda Mazarredo 4',      'Peruana'),
  ('Forno 21',         'Calle Santutxu 21, Bilbao',        'Pizzería'),
  ('Masa Madre',       'Calle Egaña 15, Bilbao',          'Pizzería'),
  ('Café Nube',        'Calle Bidebarrieta 3, Bilbao',     'Cafetería')
) AS v(restaurant_name, address, category_name)
JOIN public."Categories" c ON c.name_category = v.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Restaurants" r
  WHERE r.name_restaurant = v.restaurant_name AND r.address = v.address
);

-- El campo title es nuevo y obligatorio. Comment ya era obligatorio.
INSERT INTO public."Reviews" (id_user, id_restaurant, title, rating, comment)
SELECT u.id_user, r.id_restaurant, v.title, v.rating, v.comment
FROM (VALUES
  ('irene', 'Asador Arriaga',  'Muy recomendable', 5, 'Buen producto y atención excelente.'),
  ('pablo', 'Asador Arriaga',  'Buen menú', 4, 'Raciones generosas y buen precio.'),
  ('aitor', 'Itsas Etxea',    'Pescado fresco', 5, 'El pescado del día estaba perfecto.'),
  ('maite', 'Itsas Etxea',    'Servicio lento', 3, 'Comida rica, pero esperamos mucho.'),
  ('julia', 'Dragón Rojo',    'Sabores auténticos', 5, 'Los dumplings estaban deliciosos.'),
  ('hugo',  'Dragón Rojo',    'Buena opción', 4, 'Comida sabrosa y ambiente tranquilo.'),
  ('irene', 'Bambú Oriental',  'Menú variado', 4, 'Hay bastantes platos para elegir.'),
  ('pablo', 'Bangkok Sabores', 'Picante de verdad', 5, 'El pad thai estaba espectacular.'),
  ('aitor', 'Bangkok Sabores', 'Algo caro', 3, 'Buen sabor, precio un poco elevado.'),
  ('maite', 'Lima Limón',     'Ceviche increíble', 5, 'Muy fresco y con mucho sabor.'),
  ('julia', 'Lima Limón',     'Volvería', 4, 'El lomo saltado estuvo muy bueno.'),
  ('hugo',  'Ceviche Norte',   'Buen descubrimiento', 4, 'Platos diferentes y bien preparados.'),
  ('irene', 'Forno 21',       'Pizza crujiente', 5, 'Masa fina e ingredientes frescos.'),
  ('pablo', 'Masa Madre',     'Buena masa', 4, 'La pizza cuatro quesos me encantó.'),
  ('aitor', 'Café Nube',      'Desayuno perfecto', 5, 'Café delicioso y tostadas recientes.'),
  ('maite', 'Café Nube',      'Ambiente agradable', 4, 'Un buen sitio para merendar.')
) AS v(username, restaurant_name, title, rating, comment)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Reviews" re
  WHERE re.id_user = u.id_user AND re.id_restaurant = r.id_restaurant
    AND re.title = v.title
);

INSERT INTO public."Favorites" (id_user, id_restaurant, want_to_visit)
SELECT u.id_user, r.id_restaurant, v.want_to_visit
FROM (VALUES
  ('irene', 'Asador Arriaga', FALSE),
  ('irene', 'Bangkok Sabores', TRUE),
  ('pablo', 'Masa Madre', FALSE),
  ('pablo', 'Café Nube', TRUE),
  ('aitor', 'Itsas Etxea', FALSE),
  ('aitor', 'Lima Limón', TRUE),
  ('maite', 'Lima Limón', FALSE),
  ('maite', 'Forno 21', TRUE),
  ('julia', 'Dragón Rojo', FALSE),
  ('julia', 'Ceviche Norte', TRUE),
  ('hugo', 'Ceviche Norte', FALSE),
  ('hugo', 'Bambú Oriental', TRUE)
) AS v(username, restaurant_name, want_to_visit)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Favorites" f
  WHERE f.id_user = u.id_user AND f.id_restaurant = r.id_restaurant
);

COMMIT;

-- Totales esperados en una base vacía: 6 categorías, 6 usuarios,
-- 10 restaurantes, 16 reseñas, 12 favoritos (50 registros).
