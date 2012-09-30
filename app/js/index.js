(function() {

	var PHOTOS_INDEX = 0;
	var MAP_INDEX = 1;
	var viewIndex = PHOTOS_INDEX;

	var initMasonry = function() {
		$(".preview-list").imagesLoaded(function() {
			var gutterWidth = 2;

			var one_column_threshold = 450;
			var two_column_threshold = 340;

			console.log("Previews loaded.");

			$(".preview-list").fadeIn("fast");
			$(".preview-list").masonry({
				itemSelector: ".preview",
				gutterWidth: gutterWidth,
				isAnimated: false,
				columnWidth: function(containerWidth) {
					var one_column_width = containerWidth;
					var two_column_width = Math.floor((containerWidth - gutterWidth) / 2);
					var three_column_width = Math.floor((containerWidth - 2 * gutterWidth) / 3);
					
					if (one_column_width <= one_column_threshold) {
						box_width = one_column_width;
					} else if (two_column_width <= two_column_threshold) {
						box_width = two_column_width;
					} else {
						box_width = three_column_width;
					}
					$(".preview > div").width(box_width);

					if (box_width != one_column_width) {
						$(".featured-box").width(box_width * 2 + gutterWidth);
					}
					
					return box_width;
				}
			});
		});
	};

	var initPreviewClickHandler = function() {
		$(".preview").click(function(event) {
			window.location.href = $(event.currentTarget).attr("id").split("preview-")[1];
		});
	};

	var initMapNavigation = function() {
		$(".header-div-map").click(function(event) {
			if (MAP_INDEX == viewIndex) {
				return;
			}
			viewIndex = MAP_INDEX;

			$(".map-fullscreen").css("display", "block");
			$(".preview-list").css("display", "none");
			
			var locations = [new google.maps.LatLng(48.18896, -116.081362),
							 new google.maps.LatLng(55.94300, -3.161),
							 new google.maps.LatLng(-3.066465, 37.350666),
							 new google.maps.LatLng(38.8406, -105.0442)]

			var bounds = new google.maps.LatLngBounds(locations[0], locations[0]);

			var mapOptions = {
				zoom: 4,
				center: locations[0],
				mapTypeId: google.maps.MapTypeId.TERRAIN
			}
			var map = new google.maps.Map($(".map-fullscreen")[0], mapOptions);

			for (var i = 0; i < locations.length; i++) {
				bounds.extend(locations[i]);
				var marker = new google.maps.Marker({
					position: locations[i],
					map: map
				});
			}
			map.fitBounds(bounds);
		});
	};

	var initPhotosNavigation = function() {
		$(".header-div-photos").click(function(event) {
			if (PHOTOS_INDEX == viewIndex) {
				return;
			}
			viewIndex = PHOTOS_INDEX;

			$(".map-fullscreen").css("display", "none");
			$(".preview-list").css("display", "block");
		});
	};

	var initNavigation = function() {
		initMapNavigation();
		initPhotosNavigation();
	};

	var initInfiniteScroll = function() {
		$(".preview-list").infinitescroll({
			navSelector  : ".pagination-links",
			nextSelector : ".pagination-links .next_page",
			itemSelector : ".preview",
			bufferPx : 500,
			loading : {
				img : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", // transparent 1x1 gif
				msgText : "",
				finishedMsg : ""
			}},
			function(newElements) {
				$(newElements).css({opacity: 0});
				$(newElements).imagesLoaded(function() {
					$(newElements).animate({opacity: 1});
					$(".preview-list").masonry("reload");
				});
			} 
		);

		// trigger the first retrieval, even before the user starts scrolling
		$(".preview-list").infinitescroll("retrieve");
	}

	$(document).ready(function() {
		if ($(".index-page").length) {
			initMasonry();
			initPreviewClickHandler();
			initNavigation();
			initInfiniteScroll();
		}	
	});
}
)();