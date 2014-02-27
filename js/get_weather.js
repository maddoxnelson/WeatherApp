$(document).ready(function(){
	$('.get_weather').click(getMyWeather)
});

function getMyWeather(){
	//Get variable from within city_input
	var user_input = $('#city_state').val().toLowerCase().split(',');
	
	
	console.log(user_input)
	
	var send = 'http://api.wunderground.com/api/642f6e7723b0f7d0/forecast10day/q/' 
	+ user_input[1] + '/' + encodeURIComponent(user_input[0]) + '.json';
	
	$.get(send,
	function(data){
		console.log(user_input);
		if (data.cod == '200'){
			console.log(data)
			var forecast = data;
			populateForecast(data);
		}
		else{
			console.log(data)
			$('img,.date,.weather_description,.high_low').text('').attr('src','');
			$('.error_message').text("We couldn't find your location. Please make sure it's in the correct format.")
		}
	});
}

function populateForecast(data){
	$('.error_message').text('');
	$.each(data.list, function(i){
		var forecast = this.weather[0];
		var temp = this.temp
		console.log(this)
		i += 1;
		var day = $('.forecast .day:nth-child(' + i + ')');
		
		day.find('img').attr('src',icon_source + forecast.icon + '.png');
		day.find('.date').text(new Date(this.dt * 1000).toDateString());
		day.find('.weather_description').text(forecast.main + ", " + forecast.description + '.');
		day.find('.high_low').text("High temp: " + temp.max + "; Low temp: " + temp.min)
		
	})
}