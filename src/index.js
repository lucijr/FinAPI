const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
//Base Config
const app = express();
app.use(express.json());
//Fake Tables
const customers = [];
//Functions
function customerAlreadyExists(cpf) {
  const customer = customers.some((customer) => customer.cpf === cpf);
  return customer;
}
function getCustomerByCPF(cpf) {
  const customer = customers.find((customer) => customer.cpf === cpf);
  return customer;
}
// Create account
app.post("/accounts", (request, response) => {
  const { name, cpf } = request.body;
  const customer = customerAlreadyExists(cpf);
  if (customer) {
    return response.status(400).send({ error: "Customer already exists!" });
  }
  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statment: [],
  });
  return response.status(201).send(customers);
});
// Get statment
app.get("/statments", function (request, response) {
  const { cpf } = request.headers;
  const customer = getCustomerByCPF(cpf);
  if (!customer) {
    return response.status(404).send({ error: "Customer not found!" });
  }
  return response.json(customer.statment);
});
//Finish Users
app.listen(3333);
