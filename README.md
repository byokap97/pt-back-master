<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Detalles de la prueba técnica

### Descripción

La prueba consiste en desarrollar una API REST que permita gestionar un listado de productos. Cada producto tiene un EAN, nombre, descripción, precio y stock. Además los productos tendrán ventas asociadas. Cada venta tiene un importe, las unidades, una fecha de venta, un canal de venta (FBA|FBM), y el producto al cual están asociadas.

### Tecnologías disponibles

-   NodeJS
-   <a href="https://nestjs.com/">NestJS</a>
-   <a href="https://www.mongodb.com/docs/manual/">MongoDB</a>
-   Mongoose <a href="https://docs.nestjs.com/recipes/mongodb">NestJS adapter</a> | <a href="https://mongoosejs.com/docs/guide.html">Mongoose documentation</a>
-   <a href="https://docs.nestjs.com/openapi/introduction">Swagger</a>
-   Typescript
-   <a href="https://day.js.org/">Day.js</a>

#### Ejercicio 1: CRUD

-   Crear el schema, service y entity de ventas en libs/api.
-   Finalizar el CRUD para gestionar los productos, faltan los endpoints de update y delete.
-   Crear un CRUD para gestionar las ventas.
-   Crear la función para crear 3 meses de ventas falsas asociadas a cada producto, al menos 1 venta por día por producto y canal de venta.
-   Los apartados a realizar están marcados con un #TODO.

#### Ejercicio 2: Agregaciones

-   Crear un endpoint que devuelva el listado de productos con las ventas de los últimos 30 días.

```
ProductWithSales30DaysDTO {
    EAN: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sales30: number;
    units30: number;
}
```

-   Crear un endpoint que devuelva un listado de las ventas agrupadas por fecha y canal de venta en un rango de fechas. Si el rango de fecha es superior a 3 meses se devolverá agrupado por semanas.

```
SalesByChannelDTO {
    channel: string;
    date: Date;
    sales: number;
    units: number;
    gropuedBy: 'day' | 'week';
}
```

#### Ejercicio 3: Tests

-   Crear test unitario para la función productsWith30daysSales (libs/api/products/products.service)
-   Crear tests e2e para el endpoint de salesByChannel (src/backend/sales-back/sales-back.controller)

### Requisitos

-   La API debe estar desarrollada con NestJS y en Typescript.
-   La API debe utilizar MongoDB como base de datos y Mongoose como ODM.
-   La API debe estar documentada con Swagger.

### Criterios de evaluación

-   Correcto funcionamiento de la API.
-   Correcta estructura del código.
-   Correcta estructura de la base de datos.
-   Correcta estructura de la documentación.

### Recursos

-   <a href="http://localhost:3000/api">Swagger</a>
