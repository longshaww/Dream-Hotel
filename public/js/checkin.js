window.onload = () => {
	var orderedCusBtn = document.querySelector("#orderedCustomer");
	var remainRoomBtn = document.querySelector("#remainRoom");

	var closeCustomer = document.querySelector("#close-customer");
	var closeRoom = document.querySelector("#close-room");

	var customers = document.querySelector("#customers");
	var rooms = document.querySelector("#rooms");

	//Open Customer
	orderedCusBtn.addEventListener("click", function () {
		customers.classList.add("col-md-3");
		customers.style.display = "block";
	});
	//Open Room
	remainRoomBtn.addEventListener("click", function () {
		rooms.classList.add("col-md-5");
		rooms.style.display = "block";
	});
	//Close Customer
	closeCustomer.addEventListener("click", function () {
		customers.classList.remove("col-md-3");
		customers.style.display = "none";
	});
	closeRoom.addEventListener("click", function () {
		rooms.classList.remove("col-md-5");
		rooms.style.display = "none";
	});
};
