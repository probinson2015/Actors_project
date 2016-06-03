
$.getJSON( "https://nuvi-challenge.herokuapp.com/activities", function( data ) {
	// console.log(data);

	var output = "<ul class='results'>";
	for (var i = 0; i < 20; i++){ //change this to data.length to get all results
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

		var activity_date = new Date(data[i].activity_date).toDateString();
		output += "<p> Date Posted: " + activity_date + "</p>";
		output += "<p class='tab'> Likes: " + data[i].activity_likes + "</p>";

		increaseLikes(data[i].provider, data[i].activity_likes);

		output += "<p id='shares'>Shares: " + data[i].activity_shares + "</p>";

		increaseShares(data[i].provider, data[i].activity_shares);

		output += "</span>"
		output += "</li>";
	}
	output += "</ul>";
	//draw chart derived from total shares and likes
	drawGraphs(facebook_likes, facebook_shares, twitter_likes, twitter_shares, tumblr_likes, tumblr_shares, instagram_likes, instagram_shares);

	$("#results").html(output);

});

var tumblr_likes = 0;
var tumblr_shares = 0;
var facebook_likes = 0;
var facebook_shares = 0;
var twitter_likes = 0;
var twitter_shares = 0;
var instagram_likes = 0;
var instagram_shares = 0;

function increaseLikes(provider, count){
	if (provider === 'instagram'){
		instagram_likes += count;
	}
	if (provider === 'tumblr'){
		tumblr_likes += count;
	}
	if (provider === 'facebook'){
		facebook_likes += count;
	}
	if (provider === 'twitter'){
		twitter_likes += count;
	}
};

function increaseShares(provider, count){
	if (provider === 'instagram'){
		instagram_shares += count;
	}
	if (provider === 'tumblr'){
		tumblr_shares += count;
	}
	if (provider === 'facebook'){
		facebook_shares += count;
	}
	if (provider === 'twitter'){
		twitter_shares += count;
	}
};

function drawGraphs(facebook_likes, facebook_shares, twitter_likes, twitter_shares, tumblr_likes, tumblr_shares, instagram_likes, instagram_shares){

	google.charts.load('current', {packages: ['corechart', 'bar']});
	google.charts.setOnLoadCallback(drawGraph);

	function drawGraph() {

		// likes_chart
		var likes_data = google.visualization.arrayToDataTable([
			['Provider', 'Likes',],
			['Facebook', facebook_likes],
			['Twitter', twitter_likes],
			['Tumblr', tumblr_likes],
			['Instagram', instagram_likes],
		]);

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

		//shares chart
		var shares_data = google.visualization.arrayToDataTable([
			['Provider', 'Shares',],
			['Facebook', facebook_shares],
			['Twitter', twitter_shares],
			['Tumblr', tumblr_shares],
			['Instagram', instagram_shares],
		]);

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
// facebook_likes, facebook_shares, twitter_likes, twitter_shares, tumblr_likes, tumblr_shares, instagram_likes, instagram_shares