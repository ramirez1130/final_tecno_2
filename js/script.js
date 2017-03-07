$(document).ready(function(){
	$.ajax({
		url : "hotels.json"
	}).done(function(data){
		var hotels = data.items;
		localStorage.hotels = JSON.stringify(hotels);
		for(var i=0;i<hotels.length;i++){
			var item = $("<li></li>");
				item.attr('data-hotel',JSON.stringify(hotels[i]));

			item.on("click",function(){
				localStorage.hotelActual = $(this).attr("data-hotel"); 
			});

			var hotelLink = $("<a href='#hotel' data-transition='flow'></a>");
			var imgHotel = $("<img/>");
				imgHotel.attr('src',hotels[i].hotel.main_picture);
			var nameHotel = $("<small></small>");
				nameHotel.text(hotels[i].hotel.name);

			item.append(hotelLink);
			hotelLink.append(imgHotel);
			hotelLink.append(nameHotel);

			$("#listHotels").append(item);
			$("#listHotels").listview("refresh");
		}
	});

	$("#hotel").on('pageshow',function(){
		var hotel = $.parseJSON(localStorage.hotelActual);
		var container = $("<div></div>");
		console.log(hotel);

		if(inFavorites(hotel.id)){
			$("#addFavorites").html("Eliminar de favoritos");
			$("#addFavorites").attr('data-action','delete');
			$("#addFavorites").parent().attr('data-icon','delete');
			$("#addFavorites").parent().parent().listview("refresh");
		}

		$("#presentation").css('background','url('+hotel.hotel.main_picture+') no-repeat');
		$("#presentation").css('background-size','cover');

		$("#hotelName").html(hotel.hotel.name);
		$("#adress").html("<p>"+hotel.hotel.address+"</p>");
		$("#hotelDescription").html(hotel.hotel.description);

		for(var i=0;i<hotel.hotel.stars;i++){
			var star = $("<img/>");
				star.attr('src',"img/star.png");
			container.append();
			$("#adress").append(star);
		}

		$("#addFavorites").click(addFavorites);

		$("#addFavorites").click(function(){
			var action = $(this).attr('data-action');

			if(action == 'add'){
				addFavorites();
				$("#addFavorites").html("Eliminar de favoritos");
				$("#addFavorites").attr('data-action','delete');
				$("#submenu").panel("close");
			}else{
				deleteFavorites();
				$("#addFavorites").html("Agregar a favoritos");
				$("#addFavorites").attr('data-action','add');
				$("#submenu").panel("close");
			}
		});
	});

	$("#pageMap").on('pageshow',function(){
		var hotel = $.parseJSON(localStorage.hotelActual);
		var lat = hotel.hotel.geo_location.latitude;
		var long = hotel.hotel.geo_location.longitude;
		
		crearMapa(lat,long,hotel.hotel.name);
	});

	$("#comments").on('pageshow',function(){
		var hotel = $.parseJSON(localStorage.hotelActual);
		var reviews = hotel.hotel.reviews;
		
		if(hotel.hotel.reviews){
			for(var i=0;i<reviews.length;i++){
				if(reviews[i].comments.good){
					var li = $("<li></li>");
					var name = $("<small>"+reviews[i].user.name+"</small>");
					var comment = $("<p>"+reviews[i].comments.good+"</p>");

					li.append(name);
					li.append(comment);
					$("#listComments").append(li);
				}
				$("#listComments").listview("refresh");
			}
		}else{
			$("#messageError").html("Parece que este hotel no tiene comentarios");
			$.mobile.changePage('#dialog');
		}
	});

	$("#favorites").on('pageshow',function(){
		if(localStorage.favorites){
			var hotels = $.parseJSON(localStorage.favorites);
			$("#listHotelsFavorites").empty();

			for(var i=0;i<hotels.length;i++){
				var item = $("<li></li>");
					item.attr('data-hotel',JSON.stringify(hotels[i]));

				item.on("click",function(){
					localStorage.hotelActual = $(this).attr("data-hotel"); 
				});

				var hotelLink = $("<a href='#hotel' data-transition='flow'></a>");
				var imgHotel = $("<img/>");
					imgHotel.attr('src',hotels[i].hotel.main_picture);
				var nameHotel = $("<small></small>");
					nameHotel.text(hotels[i].hotel.name);

				item.append(hotelLink);
				hotelLink.append(imgHotel);
				hotelLink.append(nameHotel);

				$("#listHotelsFavorites").append(item);
				$("#listHotelsFavorites").listview("refresh");
			}
		}else{
			$("#messageError").html("Parece que todavia no agregaste ningun hotel a favoritos.");
			$.mobile.changePage('#dialog');
		}
	});

	function crearMapa(lat,long,name){
		$(function() {
		    $("#map").googleMap();
		    $("#map").addMarker({
		      coords: [lat, long]
		    });
  		})
	}

	function addFavorites(){
		var hotel = $.parseJSON(localStorage.hotelActual);
		if(!inFavorites(hotel.id)){
			if(localStorage.favorites){
				var favorites = $.parseJSON(localStorage.favorites);
					favorites.push(hotel);

				localStorage.favorites = JSON.stringify(favorites);
			}else{
				var favorites = [];
					favorites.push(hotel);

				localStorage.favorites = JSON.stringify(favorites);
			}
		}
	}

	function deleteFavorites(){
		var hotel = $.parseJSON(localStorage.hotelActual);

		var favorites = $.parseJSON(localStorage.favorites);

		for(var i=0;i<favorites.length;i++){
			if(hotel.id == favorites[i].id){
				favorites.splice(i,1);
			}
		}

		if(favorites.length == 0){
			localStorage.removeItem("favorites");
		}

		localStorage.favorites = JSON.stringify(favorites);
	}

	function inFavorites(id){
		if(localStorage.favorites){
			var favorites = $.parseJSON(localStorage.favorites);

			for(var i=0;i<favorites.length;i++){
				if(favorites[i].id == id){
					return true;
				}
			}

			return false;
		}else{
			return false;
		}
	}
})