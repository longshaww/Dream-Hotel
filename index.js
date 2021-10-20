require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/express-js");

const userRoute = require("./routes/user.route");
const roomRoute = require("./routes/rooms.route");
const authRoute = require("./routes/auth.route");
const authMiddleware = require("./middlewares/auth.middleware");
const port = 4000;
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.render("index", {
		name: "Long",
	});
});

app.use("/rooms", authMiddleware.requireAuth, roomRoute);
app.use("/users", authMiddleware.requireAuth, userRoute);
app.use("/auth", authRoute);
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
