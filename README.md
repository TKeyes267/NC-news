# NC News API

## Setup Instructions

You will need to create two .env files:

- `.env.test`
- `.env.development`

Inside these file you will need to add **PGDATABASE=<database_name_here>** to each.

- The `.env.test` database name is **nc_news_test**
- The `.env.development` database name is **nc_news**

## **Testing**

- `Jest` is the testing framework used.

- To run tests:

```
$ npm test
```

### **Application dependencies:**

<i>

- npm 8.x
- express 4.x
- pg 8.x
- pg-format 1.x
- dotenv 14.x
- nodemon 2.x
  </i>

### **Developer only dependencies:**

<i>

- jest 27.x
- jest-sorted 1.x
- supertest 6.x
  </i>
