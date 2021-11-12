const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer.controller");

router.get("/", controller.customerHome);

router.get("/search", controller.searchCustomer);

router.get("/services/:id", controller.getService);

router.post("/services/add/:id", controller.postService);

router.get("/:id", controller.editCustomer);

router.put("/:id", controller.editCustomerHandling);

module.exports = router;
