const { Customer, Service } = require("../models/room.model");

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
module.exports.editCustomer = async (req, res) => {
	var customer = await Customer.findOne({ _id: req.params.id });
	res.render("customers/edit", { customer: customer });
};
module.exports.editCustomerHandling = async (req, res) => {
	await Customer.findByIdAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	});
	res.redirect("/customers");
};

let getCustomerId;
module.exports.getService = async (req, res) => {
	// var customers = await Customer.findOne({ _id: req.params.id });
	getCustomerId = req.params.id;
	var services = await Service.find();
	res.render("customers/services", { services: services });
};

module.exports.postService = async (req, res) => {
	var serviceId = req.params.id;
	await Customer.updateOne(
		{ _id: getCustomerId },
		{
			$push: {
				services: serviceId,
			},
		},
		{ multi: true }
	);
	res.redirect("/customers/services/" + getCustomerId);
};
