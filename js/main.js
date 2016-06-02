
$.getJSON( "https://nuvi-challenge.herokuapp.com/activities", function( data ) {
	console.log(data);
	var output = "<ul class='results'>";
	for (var i = 0; i < 20; i++){ //change this to data.length to get all results
		output += "<li>";
		output += "<h2><a href='" + data[i].actor_url + "'>" + data[i].actor_name + "</a></h2>";
		output += "<p> Provider: " + '<span id="provider">' + data[i].provider + "</span></p>";
		output += "<p> Username: " + data[i].actor_username + "</p>";
		output += "<img src='" + data[i].actor_avator +"'/>";
		output += "<p> Description: " + data[i].actor_description + "</p>";
		output += "</li>";
	

	}
	output += "</ul>";
	$("#results").html(output);
});

//animated search
$('#search').keyup(function() {
	var searchField = $('#search').val();
	var myExp = new RegExp(searchField, "i");
	$.getJSON('data.json', function(data) {
		var output = '<ul class="searchresults">';
		$.each(data, function(key, val) {
			if ((val.name.search(myExp) != -1) ||
			(val.bio.search(myExp) != -1)) {
				output += '<li>';
				output += '<h2>'+ val.name +'</h2>';
				output += '<img src="images/'+ val.shortname +'_tn.jpg" alt="'+ val.name +'" />';
				output += '<p>'+ val.bio +'</p>';
				output += '</li>';
			}
		});
		output += '</ul>';
		$('#update').html(output);
	}); //get JSON
});