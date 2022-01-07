require("dotenv").config();

const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const { Voucher } = require("./models/room.model");
const userRoute = require("./routes/user.route");
const roomRoute = require("./routes/rooms.route");
const bookingRoute = require("./routes/booking.route");
const customerRoute = require("./routes/customer.route");
const authRoute = require("./routes/auth.route");
const logOutRoute = require("./routes/logout.route");

const apiRoomRoute = require("./api/routes/room.route");
const { requireAuth } = require("./middlewares/auth.middleware");

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.set("view engine", "pug");
app.set("views", "./views");
app.all("/", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", async (req, res) => {
	const vouchers = await Voucher.find().limit(3);
	res.render("booking/bookinghome", { vouchers });
});

app.use("/rooms", requireAuth, roomRoute);
app.use("/users", requireAuth, userRoute);
app.use("/booking", bookingRoute);
app.use("/customers", requireAuth, customerRoute);
app.use("/auth", authRoute);
app.use("/logout", logOutRoute);
app.use("/api/rooms", apiRoomRoute);
app.listen(port, () => {
	console.log(`Dream Hotel website listening at http://localhost:${port}`);
});
