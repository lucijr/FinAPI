const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
//Base Config
const app = express();
app.use(express.json());
//Users
const customers = [];
app.post("/accounts", (request, response) => {
  const { name, cpf } = request.body;
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );
  if (customerAlreadyExists) {
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
//Finish Users
app.listen(3333);
