const { Customer } = require("../models/room.model");

module.exports.customerHome = async (req, res) => {
	var customers = await Customer.find();
	res.render("customers/customers", { customers: customers });
};
module.exports.searchCustomer = async (req, res) => {
	var customers = await Customer.find();
	var q = req.query.q;
	var matchedCustomers = customers.filter(function (customer) {
		return customer.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	res.render("customers/customers", {
		customers: matchedCustomers,
	});
};
