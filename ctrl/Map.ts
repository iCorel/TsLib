module z.ctrl {
	export class Map {
		public static getAddress(address: Text, map= null) {
			var latlng = new google.maps.LatLng(10.926016860004053, -253.2958193359375);
			geocoder.geocode({
				'address': address
			//, 'bounds': latlng
				, 'region': 'VN'
			}, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK && results.length) {
						var rs = results[0].address_components;
						var dis = Map.findResult(rs, "administrative_area_level_2");
						var city = Map.findResult(rs, "administrative_area_level_1");
						if (map != null) {
							map.setCenter(results[0].geometry.location);
							map.setZoom(15);
							var marker = new google.maps.Marker({
								'position': results[0].geometry.location,
								'Map': map,
								'Draggable': true
							});
						}
						//var state = Map.findResult(results, "administrative_area_level_1");
						//var country = Map.findResult(results, "country");
						console.debug("city", city.long_name, dis.long_name);
						//Map.foundLocation(city, state, country, r.coords.latitude, r.coords.longitude);
					}
				});
		}
		public static findResult = function (results, name) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].types.indexOf(name) >= 0) {
					return results[i];
				}
			}
			return null;
		};
		public elMap: HTMLElement;
		public elAddress: HTMLElement;
		public elCity: HTMLElement;
		public elDic: HTMLElement;
		public map;
		constructor(elMap:HTMLElement,elAddress:HTMLInputElement,elCity:HTMLElement,elDis:HTMLElement) {
			var mapOptions = {
				center: { lat: 10.926016860004053, lng: -253.2958193359375 },
				zoom: 8
			};
			this.map = new google.maps.Map(elMap, mapOptions);
			
		}
	}
}
var google;
var geocoder = new google.maps.Geocoder();