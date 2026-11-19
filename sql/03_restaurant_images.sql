-- Imágenes de restaurantes: se puede ejecutar varias veces sin duplicar nada.
-- No borra datos ni modifica fotos personalizadas que ya tengan una URL.
BEGIN;

ALTER TABLE public."Restaurants"
    ALTER COLUMN image_url SET DEFAULT '/uploads/restaurants/Sin_foto.png';

UPDATE public."Restaurants"
SET image_url = CASE name_restaurant
    WHEN 'Asador Arriaga' THEN '/uploads/restaurants/Asador_Arriaga.png'
    WHEN 'Itsas Etxea' THEN '/uploads/restaurants/Itsas_Etxea.png'
    WHEN 'Dragón Rojo' THEN '/uploads/restaurants/Dragon_Rojo.png'
    WHEN 'Bambú Oriental' THEN '/uploads/restaurants/Bambu_Oriental.png'
    WHEN 'Bangkok Sabores' THEN '/uploads/restaurants/Bangokok_Oriental.png'
    WHEN 'Lima Limón' THEN '/uploads/restaurants/Lima_Limon.png'
    WHEN 'Ceviche Norte' THEN '/uploads/restaurants/Cevivhe_Norte.png'
    WHEN 'Forno 21' THEN '/uploads/restaurants/Forno_21.png'
    WHEN 'Masa Madre' THEN '/uploads/restaurants/Masa_Madre.png'
    WHEN 'Café Nube' THEN '/uploads/restaurants/Café_Nube.png'
    WHEN 'Txoko del Norte' THEN '/uploads/restaurants/Txoko_del_Norte.png'
    WHEN 'Jardín de Jade' THEN '/uploads/restaurants/Jardin_de_Jade.png'
    WHEN 'Siam Wok' THEN '/uploads/restaurants/Siam_Wok.png'
    WHEN 'Andes y Mar' THEN '/uploads/restaurants/Andes_y_Mar.png'
    WHEN 'La Rueda' THEN '/uploads/restaurants/La_Rueda.png'
    WHEN 'Café Lumbre' THEN '/uploads/restaurants/Cafe_Lumbre.png'
    ELSE '/uploads/restaurants/Sin_foto.png'
END
WHERE image_url IS NULL
   OR BTRIM(image_url) = ''
   OR image_url = '/uploads/restaurants/Sin_foto.png';

COMMIT;