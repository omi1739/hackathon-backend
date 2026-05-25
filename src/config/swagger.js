const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Creators Hub API",
      version: "1.0.0",
      description: "API documentation for Creators Hub backend",
    },
    servers: [{ url: "/api", description: "API base path" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/index.js"],
};

module.exports = swaggerJsdoc(options);
