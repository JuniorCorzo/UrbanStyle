# Base de datos Urban Style

## Colección para Usuarios

```json
{
  "_id": "object_id",
  "name": "Nombre del usuario",
  "email": "correo@dominio.com",
  "password": "hash",
  "role": "cliente | administrador",
  "address": {
    "street": "Calle 123",
    "city": "Ciudad",
    "state": "Estado",
    "country": "Colombia",
    "postal_code": "000000"
  },
  "phone": "Número de contacto",
  "created_at": "ISODate()",
  "updated_at": "ISODate()"
}
```

## Colección para Direcciones

```json
{
  "_id": "object_id",
  "user_id": "object_id",
  "street": "Calle 123",
  "city": "Ciudad",
  "state": "Estado",
  "country": "Colombia",
  "postal_code": "000000",
  "created_at": "ISODate()",
  "updated_at": "ISODate()"
}
```

## Colección para Productos

```json
{
  "_id": "object_id",
  "name": "Nombre del producto",
  "description": "Descripción detallada del producto",
  "price": 100.0,
  "discount": 10,
  "images": ["url_imagen1", "url_imagen2"],
  "categories": ["Electrónica", "Accesorios"],
  "attributes": {
    "color": "rojo",
    "size": "M"
  },
  "stock": 50,
  "created_at": "ISODate()",
  "updated_at": "ISODate()"
}
```

## Colección para Categorías

```json
{
  "_id": "object_id",
  "name": "Nombre de la categoría",
  "description": "Descripción detallada de la categoría",
  "created_at": "ISODate()",
  "updated_at": "ISODate()"
}
```

## Colección para el Carrito de compras

```json
{
  "_id": "object_id",
  "user_id": "object_id",
  "items": [
    {
      "product_id": "object_id",
      "quantity": 1
    }
  ],
  "created_at": "ISODate()",
  "updated_at": "ISODate()"
}
```

## Colección para Pedidos

```json
{
  "_id": "object_id",
  "user_id": "object_id",
  "items": [
    {
      "product_id": "object_id",
      "quantity": 1,
      "price": 100.0,
      "discount": 10
    }
  ],
  "total": 90.0,
  "status": "processing | sent | delivered | canceled",
  "address": {
    "street": "Calle 123",
    "city": "Ciudad",
    "state": "Estado",
    "country": "Colombia",
    "postal_code": "000000"
  },
  "payment_method": "card | PSE",
  "order_date": "ISODate()",
  "history": [
    { "status": "processing", "date": "ISODate()" },
    { "status": "sent", "date": "ISODate()" }
  ]
}
```
