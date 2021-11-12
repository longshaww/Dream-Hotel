module.exports.logOut = async (req, res) => {
	res.clearCookie("userId");
	res.redirect("/auth/login");
};
