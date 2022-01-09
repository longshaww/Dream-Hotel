var toastLiveExample = document.getElementById("liveToast");
var toast = new bootstrap.Toast(toastLiveExample);

let $roomsCard;
let rooms;

window.onload = () => {
	toast.show();
	$roomsCard = $("#rooms-card");
	$("#room_type").on("change", onTypeSelected);
	$("#available").on("keyup", onAvailable);
	getData();
};

function onTypeSelected() {
	const matchedRoom = rooms.filter((room) => {
		return (
			room.room_type
				.toLowerCase()
				.indexOf(this.value.toLowerCase()) !== -1
		);
	});
	if (!this.value) {
		renderRooms(rooms);
	} else {
		renderRooms(matchedRoom);
	}
}

function onAvailable(e) {
	const val = e.target.value;
	if (e.keyCode === 13) {
		e.preventDefault();
		if (!val) {
			return renderRooms(rooms);
		}
		const matchedRoom = rooms.filter((room) => {
			return room.available.includes(val);
		});
		renderRooms(matchedRoom);
	}
}

async function getData() {
	const response = await fetch("https://dreamhotel.herokuapp.com/api/rooms");
	const data = await response.json();
	rooms = data;
	rooms.sort((a, b) => {
		return a.room_id - b.room_id;
	});
	renderRooms(rooms);
}

function renderRooms(list) {
	const roomsList = list
		.map((room) => {
			return `
			<div class="col text-center">
				<div class="card list-unstyled shadow-lg h-auto ${
					room.customer
						? `text-white bg-dark mb-3`
						: `text-dark bg-light mb-3`
				}" style="height:21rem;">
					<img src="${room.image}" class="card-img-top">
					<div class="card-body">
						<h5 class="card-title">Phòng: ${room.room_id}</h5>
						<p class="card-text">Loại phòng: ${room.room_type}</p>
						<a href="/rooms/${room._id}" class="${
				room.customer
					? `mt-2 button btn btn-light`
					: `mt-2 button btn btn-dark`
			}"><span>View</span></a>
					</div>
					</div>
				</div>`;
		})
		.join("");
	$roomsCard.html(roomsList);
}

var toastTrigger = document.getElementById("liveToastBtn");
if (toastTrigger) {
	toastTrigger.addEventListener("click", function () {
		toast.show();
	});
}
