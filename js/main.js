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

	var output = "<ul class='results'>";
	for (var i = 0; i < data.length; i++){ 
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

		//update likes and shares for each provider
		populateProviders(data[i].provider, data[i].activity_likes, data[i].activity_shares);
	}

	output += "</ul>";

	//pass providers hash to drawGraphs derived from total shares and likes
	drawGraphs(providers);

	//send output to render
	$("#results").html(output);

});

function populateProviders(provider, likes_count, shares_count){

	if (!providers[provider]){
		//instantiate provider object and add to providers hash
		providers[provider] = new Provider(provider);
	}

	//increase likes for provider
	providers[provider].increaseLikes(likes_count);

	//increase shares for provider
	providers[provider].increaseShares(shares_count);

}

function drawGraphs(providers){

	google.charts.load('current', {packages: ['corechart', 'bar']});
	google.charts.setOnLoadCallback(drawGraph);

	function drawGraph() {

		var likes_array = [['Provider', 'Likes', {role: "style"}]];
		var shares_array = [['Provider', 'Shares', {role: "style"}]];

		//loop through provider hash to build up likes array and shares array
		for (var provider in providers){
			likes_array.push([provider, providers[provider].likes, "#CDF4FE"]);
			shares_array.push([provider, providers[provider].shares, "#CDF4FE"]);
		}

		//likes chart
		var likes_data = google.visualization.arrayToDataTable(likes_array);
		var likes_options = {
			title: 'Total number of Likes by Provider',
			chartArea: {width: '40%'},
			colors: ["#CDF4FE"],
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
			chartArea: {width: '40%'},
			colors: ["#CDF4FE"],
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