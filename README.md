# HerosAPIWithoutDB

A RESTful API project built purely with native Node.js (without frameworks like Express) that simulates a database using the file system (JSON files).

This API is designed to manage comic book characters (Marvel and DC heroes and villains), allowing CRUD operations (Create, Read, Update, Delete) and displaying automatic summaries of the number of existing characters based on their type and publisher.

## Main Features

- **No external dependencies**: Built using only native Node.js modules such as `http` and `fs`.
- **JSON Database**: Uses local JSON files to store and persist data (`CharactersData.json` and `SummaryData.json`).
- **Available endpoints**:
  - `/characters`: Allows managing characters using `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods. Supports filtering by `id`, `type` (hero/villain), and `publisher` (Marvel/DC).
  - `/summary`: Displays an automatic summary that counts and groups how many heroes and villains exist for each publisher.
  - `/examples`: Displays a page that describes the API structure of the project and let test routes and methods like Swagger, but with basic functions.
- **Automatic synchronization**: When changes are made to the characters, the data summary (`SummaryData.json`) is dynamically updated.
