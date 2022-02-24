const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
//Base Config
const app = express();
app.use(express.json());
//Fake Tables
const customers = [];
//Middleware
function verifyIfExistsAccountCpf(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return response.status(404).send({ error: "Customer not found" });
  }
  request.customer = customer;
  return next();
}
// Create account
app.post("/accounts", (request, response) => {
  const { name, cpf } = request.body;
  const customer = customers.some((customer) => customer.cpf === cpf);
  if (customer) {
    return response.status(404).send({ error: "Customer already exists" });
  }
  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statment: [],
  });
  return response.status(201).send(customers);
});
//Add Middleware in routes
app.use(verifyIfExistsAccountCpf);
// Get statment
app.get("/statments", function (request, response) {
  return response.json(request.customer.statment);
});
//Finish Users
app.listen(3333);
