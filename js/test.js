$( document ).ready(function () {
    console.log("DOM fully loaded and parsed");

    /////////////////////////////////////////////////
    // model
  	var initialLocations = [
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
                "category": "sport"
            },
            {
                "title": "Plavecký stadion Podolí",
                "address": "Podolská 74, 147 50 PRAHA 4",
                "description": "swimming pool",
                "url": "http://www.pspodoli.cz/",
                "category": "sport"
            },
            {
                "title": "Hybernia",
                "address": "Hybernská 7/1033, Praha 1, 110 00",
                "description": "One of the best restaurant in Prague",
                "url": "http://www.hybernia.cz/",
                "category": "restaurant"
            }]

        },

        {
            "city" : "Brussels",
            "coutnry" : "Belgium",
            "lat" : 50.0833,
            "lng" : 14.4167,
            "favourite_places": [
            {
                "title": "Archiduc",
                "address": "Bruxelles",
                "description": "ipsum blba blaballbab",
                "url": "http://www.archiduc.be/",
                "category": "bar"
            }]
        }
    ];
    //console.log(initialLocations);

    //create a custopm function which will check value is in list or not
    Array.prototype.inArray = function (value){
        // Returns true if the passed value is found in the
        // array. Returns false if it is not.
        var i;
        for (i=0; i < this.length; i++) {
            if (this[i] === value) {
                return true;
            }
        }
        return false;
    };

    /////////////////////////////////////////////////
    // model view
    // var getLatLng = function (location) {
    //     var jqxhr = $.getJSON( "https://maps.googleapis.com/maps/api/geocode/json?address=Prague,Czech Republic", function(data) {
    //         console.log( "success" );
    //         var lat = data.results[0].geometry.location.lat;
    //         var lng = data.results[0].geometry.location.lng;
    //         //console.log(lat)
    //         //console.log(lng)
    //         var latLng = new google.maps.LatLng(50.0833, 14.4167);
    //         return latLng;

    //         //return new google.maps.LatLng(50.0833, 14.4167)
    //         //console.log(this)
    //     })
    //         .done(function() {
    //             //console.log()
    //          })
    //         .fail(function() {
    //             console.log( "error" );
    //         });
    // }

    // constructor of location object
    var Location = function (data) {
        this.city = ko.observable(data.city);
        this.country = ko.observable(data.coutnry);
        this.categories = ko.observableArray([]);
        this.places = data.favourite_places;

        // return city + country, this will be used in select element and as location lat and lng from google maps api
        this.cityCountry = ko.computed(function () {
            return this.city() + ", " + this.country();
        }, this);
        this.lat = ko.observable(data.lat);
        this.lng = ko.observable(data.lng);
        
        // create an object with unique categories containing an array of the relative objects
        if(this.places){
            // new, empty array of categories
            var categories = new Array();
            // for each place in the locations, check the category, and if the category
            // is already in categories push this place to the list of respective category
            // or if it is not, create a new category containing this place object
            this.places.forEach(function (item) {
                var category = item.category;
                var categoriesList = Object.keys(categories);
                if(categoriesList.inArray(category)) {
                    categories[category].push(item);
                } else {
                    categories[category] = [item];
                }
            })
            this.categories(categories);
            //console.log(this.categories())
        }
    }

     var addMarker = function (places) {
        var address = places.address;
      // the search request object
      var request = {
        query: address
      };
      console.log(request)

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(50.0833, 14.4167),
            map: map,
            name: "marker"
        });
    }

    ko.bindingHandlers.loadMap = {
        update: function(element, valueAccessor, allBindings, viewModel) {
            //console.log("update")
            // First get the latest data that we're bound to
            var value = valueAccessor();
            // Next, whether or not the supplied model property is observable, get its current value
            var valueUnwrapped = ko.unwrap(value);

            // define map options 
            var mapOptions = {
                center: "",
                zoom: ""
            }
            // if no location choose, display center the map to the Europe or else, if location choosen,
            // dipslay the map of the location with greater zoom
            if (!valueUnwrapped) {
                //console.log("location not choosen")
                mapOptions.center =  new google.maps.LatLng(54.9000, 25.3167);
                mapOptions.zoom = 5;
            }
            else {
                //console.log("load a map")
                var lat = valueUnwrapped.lat();
                var lng = valueUnwrapped.lng();
                mapOptions.center = new google.maps.LatLng(lat, lng);
                mapOptions.zoom = 14;
            }
            // display the updated map attached to the current element
            viewModel.map = new google.maps.Map(element, mapOptions);
            //console.log(map)

            //////////////////////////////////////
            // load markers of or places if any places
            // using peek prevent from automatic dependency tracking and ensures that 
            // the update will not be fired second time
            var places = viewModel.placesList.peek();
            if(ko.unwrap(places).length > 0) {
                console.log("places not empty")
                viewModel.pinPoster(places)
                // places.forEach(function (place){
                //     viewModel.addMarker(place);
                // })
            }
        }
    };

    var AppViewModel = function () {
        // data
        var self = this;
        self.map;
        self.markers = [];
        self.locationList = ko.observableArray([]);
        self.placesList = ko.observableArray();

        // behaviours
        initialLocations.forEach(function (item) {
            self.locationList.push(new Location(item))
        })
        self.selectedLocation = ko.observable(); // nothing selected by default
        self.selectedLocation.subscribe(function (newValue) {
            self.placesList(newValue.places);
            //console.log(self.placesList())
        });
        self.addMarker = function (places) {
            // var address = places.address;
            // // the search request object
            // var request = {
            //     query: address
            // };
            // //console.log(request)

            // var marker = new google.maps.Marker({
            //     position: new google.maps.LatLng(50.0833, 14.4167),
            //     map: self.map,
            //     name: "marker"
            // });
            // var geocode = self.getPosition();
            // console.log(geocode)
            // // var geocode = self.getPosition();
            // // console.log(geocode)
        };
        self.getPosition = function () {
            // var address = "Prague"
            // // var code = new Array ();
            // // var lat = 324;
            // // var lng =53;
            // //console.log(code)
            // $.ajax({
            //     url:"https://maps.googleapis.com/maps/api/geocode/json?address="+ address,
            //     type: "POST",
            //     success:function(res){
            //         console.log("success")
            //         var code = new Array ();
            //         lat = res.results[0].geometry.location.lat;
            //         lng = res.results[0].geometry.location.lng
            //         code.push(lat)
            //         code.push(lng)
            //         console.log(code)
            //         return code
            //     }
            // });
        };
        self.pinPoster = function (locations) {
            console.log(locations)
            // // creates a Google place search service object. PlacesService does the work of
            // // actually searching for location data.
            // var service = new google.maps.places.PlacesService(self.map);
            // // Iterates through the array of locations, creates a search object for each location
            // for (var place in locations) {

            //     // the search request object
            //     var request = {
            //         query: locations[place]
            //     };
            // // Actually searches the Google Maps API for location data and runs the callback
            // // function with the search results after each search.
            // service.textSearch(request, callback);
            // }
        }
    }
        
	ko.applyBindings(new AppViewModel());
	
 });

