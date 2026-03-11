# HerosAPIWithoutDB

Un proyecto de API RESTful construido puramente con Node.js nativo (sin frameworks como Express) que simula una base de datos utilizando el sistema de archivos (ficheros JSON). 

Esta API está diseñada para gestionar personajes de cómics (héroes y villanos de Marvel y DC), permitiendo realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) y visualizar resúmenes automáticos de la cantidad de personajes existentes según su tipo y editorial.

## Características Principales

- **Sin dependencias externas**: Construido utilizando únicamente módulos nativos de Node.js como `http` y `fs`.
- **Base de datos en JSON**: Utiliza archivos JSON locales para almacenar y persistir los datos (`CharactersData.json` y `SummaryData.json`).
- **Endpoints disponibles**:
  - `/characters`: Permite gestionar a los personajes mediante los métodos `GET`, `POST`, `PUT`, `PATCH` y `DELETE`. Soporta filtrado por `id`, `type` (hero/villain) y `publisher` (Marvel/DC).
  - `/summary`: Muestra un resumen automático que suma y agrupa cuántos héroes y villanos hay de cada editorial.
- **Sincronización automática**: Cuando se realizan cambios en los personajes, se actualiza dinámicamente el resumen de datos (`SummaryData`).
