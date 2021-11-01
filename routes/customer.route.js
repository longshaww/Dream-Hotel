const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer.controller");

router.get("/", controller.customerHome);

router.get("/search", controller.searchCustomer);

router.get("/:id", controller.editCustomer);

router.put("/:id", controller.editCustomerHandling);

module.exports = router;
