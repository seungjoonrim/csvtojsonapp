// HTTP GET request -------------------------------------------------------------------
var HttpClient = function() {
	this.get = function(aURL, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() {
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
				aCallback(anHttpRequest.responseText);
			}
		}

		anHttpRequest.open("GET", aURL, true);
		anHttpRequest.send(null);
	}
}

var usersJSON;
var client = new HttpClient();
client.get('http://localhost:5000/users/api/v1.0/users', function(response) {	// get JSON from localhost
	usersJSON = JSON.parse(response);	// parse resonse to object
	appendJSON(usersJSON);	// append to webpage
});

// Append JSON data -----------------------------------------------------------------
function appendJSON(file) {

	// extract headers
	var col = [];
	for (var key in file.users[0]) {
		col.push(key)
	}

	// create dynamic table
	var table = document.createElement("table");

	// create table header row w/ extracted headers
	var thead = document.createElement("thead");
	table.appendChild(thead);
	var tr = thead.insertRow(-1);

	for (var i = 0; i < col.length; i++) {
		var th = document.createElement("th");
		th.innerHTML = col[i];
		tr.appendChild(th);
	}

	// add JSON data to the table as rows
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);

	for (var i = 0; i < file.users.length; i++) {
		// **accordians for mobile site**
		// var input = document.createElement("input");
		// input.setAttribute("type", "radio");
		// input.setAttribute("name", "expand");
		tr = tbody.insertRow(-1);
		// tr.className = "entry";
		// // tr.appendChild(input);

		for (var j = 0; j < col.length; j++) {
			var tabCell = tr.insertCell(-1);
			tabCell.innerHTML = file.users[i][col[j]];
		}

		var cells = tr.getElementsByTagName("td");

		// **accordians for mobile site**
		// for (var k = 0; k < 3; k++) {
		// 	cells.item(k).className = "primary";
		// }
	}

	// add class, "odd" for striped table
	var rows = tbody.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i=i+2) {
		rows.item(i).className += " odd";
	}

	// add table to HTML
	var firstScript = document.body.getElementsByTagName("script").item(0);
	var tableContainer = document.createElement("div");
	tableContainer.appendChild(table);
	document.body.insertBefore(tableContainer, firstScript); // insert the table before the first script
}

// Google Map API --------------------------------------------------------------
// initialize map, with center point and default zoom setting
function initMap() {
	var infowindow = new google.maps.InfoWindow();
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: new google.maps.LatLng(38.907, -77.037),
		mapTypeId: 'terrain'
	});

	// HTTP request to get GeoJSON data
	var client = new HttpClient();
	client.get('http://localhost:5000/users/api/v1.0/users.geojson', function(response) {
		var usersGeoJSON = JSON.parse(response)

		map.data.addListener('click', function(event) {
			var id = event.feature.getProperty("id");		// extract id from data
			var fname = event.feature.getProperty(" fname");	// extract first name
			var lname = event.feature.getProperty(" lname");	// extract last name
			infowindow.setContent("<div>ID: " + id + "<br>Name: " + fname + " "	//add to info window
				+ lname + "</div>");
			infowindow.setPosition(event.feature.getGeometry().get());	// point of info window
			infowindow.setOptions({
				pixelOffset: new google.maps.Size(0, -30)	// offset so its above marker
			});
			infowindow.open(map);
		});
		map.data.addGeoJson(usersGeoJSON);	// user GeoJSON data too append all markers
	});
}

