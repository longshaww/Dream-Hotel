const express = require("express");
const controller = require("../controllers/room.controller");
const router = express.Router();
const validate = require("../validate/room.validate");
const upload = require("../utils/multer");
const { managerRequire } = require("../middlewares/auth.middleware");

router.get("/", controller.roomHome);

router.get("/search", controller.searchRoom);

router.get("/create", controller.createRoomPug);
router.post(
	"/create",
	upload.single("image"),
	validate.createRoomValidation,
	controller.createRoomValidation
);
router.get("/checkin", controller.checkInForm);

router.get("/checkin/searchCus", controller.searchCustomer);

router.get("/checkin/searchRo", controller.searchRo);

router.post("/checkin", controller.postCheckIn);

router.get("/rents", controller.rentHistory);

router.get("/rents/search", controller.rentSearch);

router.get("/rents/:id", controller.confirmRent);

router.get("/checkout", controller.checkOutForm);

router.post("/checkout", controller.postCheckOut);

router.get("/checkout/online", controller.onlinePayment);

router.get("/payment-history", managerRequire, controller.paymentHistory);

router.get("/payment-history/search", controller.paymentSearch);

router.get("/services", controller.services);

router.get("/services/new", controller.newService);

router.post("/services/new", controller.postService);

router.get("/vouchers", controller.vouchers);

router.get("/vouchers/new", controller.newVoucher);

router.post("/voucher/new", controller.postVoucher);

router.get("/vouchers/:id", controller.editVoucher);

router.put("/vouchers/:id", controller.editVoucherHandling);

router.delete("/vouchers/:id", controller.deleteVoucher);

router.delete("/services/:id", controller.deleteService);

router.get("/services/:id", controller.editService);

router.put("/services/:id", controller.editServiceHandling);

router.get("/checkout/:id", controller.cashPayment);

router.post("/checkout/:id", controller.postCash);

router.post("/checkout/:id/voucher", controller.checkVoucher);

router.get("/:id", controller.viewRoom);

router.delete("/:id", controller.deleteRoom);

router.get("/:id/edit", controller.editRoomPug);

router.put("/:id/edit", upload.single("image"), controller.editRoomHandling);

router.post("/rents/:id", controller.postRent);

module.exports = router;
