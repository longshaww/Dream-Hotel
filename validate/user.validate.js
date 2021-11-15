module.exports.postCreate = (req, res, next) => {
	var errors = [];
	if (!req.body.name) {
		errors.push("Name is required");
	}
	if (!req.body.phone) {
		errors.push("Phone is required");
	}
	if (!req.body.email) {
		errors.push("Email required");
	}
	if (!req.body.password) {
		errors.push("Password required");
	}
	if (errors.length) {
		res.render("users/create", {
			errors: errors,
			values: req.body,
		});
		return;
	}
	next();
};
