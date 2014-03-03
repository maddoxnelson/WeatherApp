var api_key = "642f6e7723b0f7d0"

$('#city_state').keypress(function(e) {
	if(e.which == 13) {
	    $('.get_weather').click();
	}
});

function getMyWeather(){
	resetScreen(null);
	$('.loading_gif').show();
	
	var user_input = $('#city_state').val().toLowerCase();

	if(user_input.match(',')){
		user_input = user_input.split(', ').toString().split(','),
		     state = user_input[1],
		      city = user_input[0],
		       url = encodeURI('https://api.wunderground.com/api/'+ api_key 
					 + '/forecast10day/geolookup/q/' + state + '/' + city + '.json');
		
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: function(data){
			   if ($(data.response.error).length || $(data.response.results).length){
				   resetScreen("no_location")
			   }
			   else{
				   populateForecast(data,1);
			   }
		    },
			error: function(){
				resetScreen("ajax_error");
			}
	    });
		
		setLead("get_forecast",city)
	}
	else{
		resetScreen("add_comma")
	}
}

function populateForecast(data,i){
	for(var i = 0; i <= 5; i ++){
		var forecast = data.forecast.simpleforecast.forecastday[i],
		    day = $('.forecast .day:nth-child(' + (i + 1) + ')');
				 
		day.find('img').attr('src',forecast.icon_url);
		day.find('.date').text(new Date(forecast.date.epoch * 1000).toDateString());
		day.find('.weather_description').text(forecast.conditions);
		day.find('.high_low').html("High: " + forecast.high.fahrenheit + "&deg;" + " Low: " + forecast.low.fahrenheit + "&deg;")
	}

	setLead("showing_forecast",data.location.city,data.location.state);
	$('.loading_gif').hide();
	$('.forecast').slideDown('slow');
}

function fetchMessage(message,city,state){
	var text = {};
	
	//error handling
	text["no_location"] = "We couldn't find your location. Please make sure it's in the correct format.";
	text["ajax_error"] = "Error retrieving weather from Weather Underground.";
	text["add_comma"] = 'Please use a comma to separate the city and state.';
	
	//other messages
	text["get_forecast"] = 'Getting your forecast for <span class="cap" style="text-transform:capitalize">' + city + '</span>...'
	text["showing_forecast"] = 'Showing five-day forecast for <span style="text-transform:capitalize">' 
								+ city + '</span>, ' + state + ':';
	text["need_forecast"] = 'Need a five-day forecast?'
	
	return text[message];
}

function setLead(message,city,state){
	$('.lead').html(fetchMessage(message,city,state))
	$('.error_message').hide()
}

function resetScreen(error){
	$('.forecast,.loading_gif').hide();
	$('.error_message').text(fetchMessage(error)).show();
	$('.lead').text(fetchMessage("need_forecast"));
    $('.day.img,.date,.weather_description,.high_low').text('').attr('src','');
}