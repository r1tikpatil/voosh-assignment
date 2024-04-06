require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "2.0.0",
    title: "Voosh Food Technologies Assignment",
  },
  host: process.env.PORT,
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["../index.js", "../controllers/*.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("../index.js");
});
