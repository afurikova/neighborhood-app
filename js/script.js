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
    };

    // define a handler to manage the map loading
    ko.bindingHandlers.loadMap = {
        update: function(element, valueAccessor, allBindings, viewModel) {
            console.log("map loading")
            // get the value of current Location and unwrap it (in case it is not an observable)
            var location = valueAccessor();
            var locationUnwrapped = ko.unwrap(location);
            // define initial map variables
            var myLatLng = new google.maps.LatLng(50.0833, 14.4167);
            // define initial markers variables
            var places = locationUnwrapped.places;
            var markers = []

            // define map options 
            var mapOptions = {
                center: myLatLng,
                zoom: 15
            }
            // display the updated map attached to the current element
            viewModel.map(new google.maps.Map(element, mapOptions));
        }
    };

    // define a ha
    ko.bindingHandlers.loadMarkers = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            console.log("load markers");
            var map = ko.unwrap(valueAccessor());
            var bounds = new google.maps.LatLngBounds();

            var places = viewModel.currentLocation().places;
            var markers = [];
            // console.log(places)
            var infoWindow = new google.maps.InfoWindow; //static infoWindow for all your markers
            
            // add markers of current place and display them
            places.forEach(function (place) {
                // define markers position and create an object
                var lat = place.lat;
                var lng = place.lng;
                var placeLatLng = new google.maps.LatLng(lat, lng);
                
                // infoWindow.setContent(place.description)

                var marker = new google.maps.Marker({
                    position: placeLatLng,
                    map: map,
                    title: place.title,
                    address: place.address,
                    content: place.description,

                    // function opening an info window, use this function to manipulate the side-bar
                    openInfo: function () {
                        // infoWindow.close();
                        infoWindow.setContent("<a href='#'>" + marker.title + "</a>" + "<p>" + marker.content + "</p>")
                        infoWindow.open(map, this);
                    }
                });

                // display the info window upon click on the marker
                console.log(marker)
                google.maps.event.addListener(marker, 'click', function() {
                    console.log(marker.title)
                    infoWindow.setContent("<a href='#'>" + marker.title + "</a>" + "<p>" + marker.content + "</p>")
                    infoWindow.open(map, marker);
                });
                    // add each marker to the list
                markers.push(marker);
                // and extend the boundaries of the map according to the each added marker
                bounds.extend(marker.position);
            })
            
            if (map) {
                // adjust the map according to the added markers
                map.fitBounds(bounds)

                // and when the window is being resi
                google.maps.event.addDomListener(window, 'resize', function() {
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                });
            }
            viewModel.markers(markers)
            // console.log(viewModel.markers())

        }
    }

    var AppViewModel = function () {
        // data
        var self = this;
        self.map = ko.observable();
        self.currentLocation = ko.observable(new Location(model[0]));
        self.markers = ko.observableArray();

        self.openInfo = function () {
            // open the info window of a marker when an item of the list is clicked
            this.openInfo()
        }
    }
        
    ko.applyBindings(new AppViewModel());
    
 });

