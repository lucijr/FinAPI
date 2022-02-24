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
    statement: [],
  });
  return response.status(201).send(customers);
});
//Add Middleware in routes
app.use(verifyIfExistsAccountCpf);
//Get statement
app.get("/statements", verifyIfExistsAccountCpf, function (request, response) {
  return response.json(request.customer.statement);
});
//Post Deposit
app.post("/deposits", verifyIfExistsAccountCpf, function (request, response) {
  const { description, amount } = request.body;
  const { customer } = request;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);
  return response.status(201).json({ status: "success" });
});
//Finish Users
app.listen(3333);
