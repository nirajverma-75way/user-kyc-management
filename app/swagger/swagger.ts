const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "KYC Verification",
    description: "API documentation of KYC Verification apllication",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../api/admin/admin.route.ts", "../api/admin/admin.route.ts"];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated!");
});