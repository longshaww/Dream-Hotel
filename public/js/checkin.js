window.onload = () => {
	var orderedCusBtn = document.querySelector("#orderedCustomer");
	var remainRoomBtn = document.querySelector("#remainRoom");

	var closeCustomer = document.querySelector("#close-customer");
	var closeRoom = document.querySelector("#close-room");

	var customers = document.querySelector("#customers");
	var rooms = document.querySelector("#rooms");

	//Open Customer
	orderedCusBtn.addEventListener("click", function () {
		customers.classList.add("col-md");
		customers.style.display = "block";
	});
	//Open Room
	remainRoomBtn.addEventListener("click", function () {
		rooms.classList.add("col-md");
		rooms.style.display = "block";
	});
	//Close Customer
	closeCustomer.addEventListener("click", function () {
		customers.classList.remove("col-md");
		customers.style.display = "none";
	});
	closeRoom.addEventListener("click", function () {
		rooms.classList.remove("col-md");
		rooms.style.display = "none";
	});

	//toast
	var toastLiveExample = document.getElementById("liveToast");
	var toast = new bootstrap.Toast(toastLiveExample);
	window.onload = toast.show();

	var toastTrigger = document.getElementById("liveToastBtn");
	if (toastTrigger) {
		toastTrigger.addEventListener("click", function () {
			toast.show();
		});
	}
};
