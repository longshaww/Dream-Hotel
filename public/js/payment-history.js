var arr = [];

var reportTable = document.querySelector("#report-table");
var totalBtn = document.querySelector("#total-btn");
var getTotal = document.querySelector("#get-total");
var prices = document.querySelectorAll("#price");
prices.forEach(function (price) {
	arr.push(parseInt(price.innerHTML.slice(1)));
});
var total = arr.reduce(function (a, b) {
	return a + b;
}, 0);

totalBtn.addEventListener("click", function () {
	getTotal.innerHTML = total;
});
// exportBtn.addEventListner("click", ExportToExcel("xlsx", "ReportTable"));
function ExportToExcel(fileExtension, fileName) {
	var wb = XLSX.utils.table_to_book(reportTable, { sheet: "sheet1" });
	return XLSX.writeFile(
		wb,
		fileName + "." + fileExtension ||
			"MySheetName." + (fileExtension || "xlsx")
	);
}

$("#chart-btn").click(() => {
	$("#myChart").toggle();
});
let myChart = document.querySelector("#myChart").getContext("2d");
let massPopChart = new Chart(myChart, {
	type: "bar",
	data: {
		labels: [
			"Jan",
			"Feb",
			"March",
			"April",
			"May",
			"June",
			"July",
			"Aug",
			"Sept",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Báo cáo doanh thu",
				data: [114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 54],
				backgroundColor: [
					"rgba(225,99,132,0.6)",
					"rgba(54,162,235,0.6)",
					"rgba(225,206,86,0.6)",
					"rgba(75,192,192,0.6)",
					"rgba(153,102,255,0.6)",
					"rgba(225,159,64,0.6)",
					"rgba(225,99,132,0.6)",
				],
				borderWidth: 1,
				borderColor: "#777",
				hoverBorderWidth: 3,
				hoverBorderColor: "#000",
			},
		],
	},
	options: {
		title: {
			display: true,
			text: "Dream Hotel",
		},
	},
});
