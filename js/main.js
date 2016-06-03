var Provider = function(name){
	this.name = name;
	this.likes = 0;
	this.shares = 0;
};

Provider.prototype.increaseLikes = function(count){
	this.likes += count;
}

Provider.prototype.increaseShares = function(count){
	this.shares += count;
}

var providers = {};

$.getJSON( "https://nuvi-challenge.herokuapp.com/activities", function( data ) {
	// console.log(data);

	var output = "<ul class='results'>";
	for (var i = 0; i < 5; i++){ //change this to data.length to get all results
		output += "<li>";
		output += "<h2><a href='" + data[i].actor_url + "'>" + data[i].actor_name + "</a></h2>";
		output += "<p> Provider: " + '<span class="tab" id="provider">' + data[i].provider + "</span>";
		output += "<a href='" + data[i].activity_url + "'>Respond to Activity</a></p>";
		output += "<p> Username: " + data[i].actor_username + "</p>";
		output += "<img class='avatar' src='" + data[i].actor_avator +"'/>";
		output += "<span class='info'>";
		output += "<p> Actor Description: " + data[i].actor_description + "</p>";

		if (data[i].activity_attachment === null){
			output += "<p> Activity Message: " + data[i].activity_message + "</p>";
		} else {
			output += "<p><a href='" + data[i].activity_attachment +"'>View Attachment</a></p>";
		}

		//format date
		var activity_date = new Date(data[i].activity_date).toDateString();
		
		output += "<p> Date Posted: " + activity_date + "</p>";
		output += "<p class='tab'> Likes: " + data[i].activity_likes + "</p>";
		output += "<p id='shares'>Shares: " + data[i].activity_shares + "</p>";
		output += "</span>"
		output += "</li>";

		provider = {};

		if (!providers[data[i].provider]){
			//instantiate provider object and add to providers hash
			providers[data[i].provider] = new Provider(data[i].provider);
		}

		//increase likes for provider
		providers[data[i].provider].increaseLikes(data[i].activity_likes);

		//increase shares for provider
		providers[data[i].provider].increaseShares(data[i].activity_shares);

	}

	output += "</ul>";

	//pass providers hash to drawGraphs derived from total shares and likes
	drawGraphs(providers);

	//send output to render
	$("#results").html(output);

});


function drawGraphs(providers){

	google.charts.load('current', {packages: ['corechart', 'bar']});
	google.charts.setOnLoadCallback(drawGraph);

	function drawGraph() {

		// likes_chart
		var likes_array = [['Provider', 'Likes',]];
		var shares_array = [['Provider', 'Shares',]];

		//loop through provider hash to build up likes array and shares array
		for (var provider in providers){
			likes_array.push([provider, providers[provider].likes]);
			shares_array.push([provider, providers[provider].shares]);
		}

		var likes_data = google.visualization.arrayToDataTable(likes_array);

		var likes_options = {
			title: 'Total number of Likes by Provider',
			chartArea: {width: '50%'},
			hAxis: {
			  title: 'Total Likes',
			  minValue: 0
			},
			vAxis: {
				title: 'Provider'
			}
		};

		// shares chart
		var shares_data = google.visualization.arrayToDataTable(shares_array);

		var shares_options = {
			title: 'Total number of Shares by Provider',
			chartArea: {width: '50%'},
			hAxis: {
			  title: 'Total Shares',
			  minValue: 0
			},
			vAxis: {
				title: 'Provider'
			}
		};

		var likes_chart = new google.visualization.BarChart(document.getElementById('likes_chart_div'));
		var shares_chart = new google.visualization.BarChart(document.getElementById('shares_chart_div'));

		likes_chart.draw(likes_data, likes_options);
		shares_chart.draw(shares_data, shares_options)
	}
}