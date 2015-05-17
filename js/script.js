$( document ).ready(function () {
    console.log("DOM fully loaded and parsed");

    /////////////////////////////////////////////////
    // model
    var model = [
        {
            "city" : "Prague",
            "coutnry" : "Czech Republic",
            "lat" : 50.0833,
            "lng" : 14.4167,
            "favourite_places": [
            {
                "title": "Krav Maga Academy",
                "address": "Na Pankráci 32, Praha 4, 147 00",
                "description": "ipsum blba blaballbab",
                "url": "http://www.krav-maga.cz/",
                "category": "sport",
                "lat" : 50.0833,
                "lng" : 14.4167
            },
            {
                "title": "Plavecký stadion Podolí",
                "address": "Podolská 74, 147 50 Praha 4",
                "description": "swimming pool",
                "url": "http://www.pspodoli.cz/",
                "category": "sport",
                "lat" : 50.051762,
                "lng" : 14.416978
            },
            {
                "title": "Hybernia",
                "address": "Hybernská 7/1033, Praha 1, 110 00",
                "description": "One of the best restaurant in Prague",
                "url": "http://www.hybernia.cz/",
                "category": "restaurant",
                "lat" : 50.087502,
                "lng" : 14.431470
            }]

        }
    ];

    // constructor of location object
    var Location = function (data) {
        this.city = ko.observable(data.city);
        this.country = ko.observable(data.coutnry);
        this.places = data.favourite_places;        
    }

    ko.bindingHandlers.loadMap = {
        update: function(element, valueAccessor, allBindings, viewModel) {
            // console.log("map loading")
            // get the value of current Location and unwrap it (in case it is not an observable)
            var location = valueAccessor();
            var locationUnwrapped = ko.unwrap(location);
            // define initial map variables
            var map;
            var myLatLng = new google.maps.LatLng(50.0833, 14.4167);
            // define initial markers variables
            var places = locationUnwrapped.places;
            var bounds = new google.maps.LatLngBounds();
            var markers = []

            // define map options 
            var mapOptions = {
                center: myLatLng,
                zoom: 14
            }
            // display the updated map attached to the current element
            map = new google.maps.Map(element, mapOptions);

            // add markers
            places.forEach(function (place) {
                // add marker of each place of the current location
                var lat = place.lat;
                var lng = place.lng;
                var placeLatLng = new google.maps.LatLng(lat, lng);
                var marker = new google.maps.Marker({
                    position: placeLatLng,
                    map: map,
                    title: place.title
                });
                // and extend the boundaries of the map according to the each added marker
                bounds.extend(marker.position);
            })
            // adjust the map
            map.fitBounds(bounds);
            // keep the center when rezing the map
            google.maps.event.addDomListener(window, 'resize', function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });            
        }
    };


    var AppViewModel = function () {
        // data
        var self = this;
        self.currentLocation = ko.observable(new Location(model[0]));
    }
        
    ko.applyBindings(new AppViewModel());
    
 });

