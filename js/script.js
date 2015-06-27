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
                "title": "KMG Krav Maga Academy",
                "address": "Na Pankraci 32, Praha 4",
                "description": "One of the several KMG training places in Prague where I used to do my trainings. Awesome pepople and awesome trainers.",
                "url": "http://www.krav-maga.cz/",
                "category": "krav maga"
            },
            {
                "title": "Swimming Pool Podoli",
                "address": "Podolská 74, Praha 4",
                "description": "Don't know what to do during the sunny days? Go to Podoli. Beside a huge indoor and two outdoor swimming pools you can find there a water slide, pools for kids fitness and several fast-foods. One of the oudtood swimming pool is warmed up in any season so you can enjoy outdoor swimming also during the winter.",
                "url": "http://www.pspodoli.cz/",
                "category": "swimming"
            },
            {
                "title": "Aquapark Cestlice",
                "address": "Prazska 138, Čestlice, Praha - vychod",
                "description": " The biggest aqupark in Central Europe. So if are fan of water slides water slide or other water attraction, this is the right place to go. And when you are there don't forget to check out the sauna world.",
                "url": "http://www.aquapalace.cz/en",
                "category": "swimming"
            },
            {
                "title": "Hybernia",
                "address": "Hybernska 7/1033, Praha 1",
                "description": "If you enjoy eating meet try this restaurant because here they really know how to prepare it. You can find there some Czech and other specialities for reasonable prices. Make also sure you are starving enough, because the portion are big. And in addition to that you can also draw beer directly from the table. ",
                "url": "http://www.hybernia.cz/",
                "category": "restaurant"
            },
            {
                "title": "U Dzouydyho",
                "address": "Jugoslavska 670, Praha 2",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "https://www.udzoudyho.cz/",
                "category": "teahouse"
            },
            {
                "title": "Zanzibar",
                "address": "Americka 152/15, Praha 2-Vinohrady",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "http://www.kavarnazanzibar.cz/",
                "category": "coffee"
            },
            {
                "title": "Divoka Sarka",
                "address": "Divoka Sarka 41, Praha 6, 164 00",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "http://koupaliste-sarka.webnode.cz/",
                "category": "swimming"
            },
            {
                "title": "Riegrovy sady",
                "address": "Riegrovy sady, Praha 2",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "http://www.myczechrepublic.com/prague/riegrovy-sady-park.html",
                "category": "park"
            },
            {
                "title": "Dobra Trafika",
                "address": "Korunni 42, Praha 2",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "http://www.dobratrafika.cz/",
                "category": "coffee"
            },
            {
                "title": "Hells Bells Rockin' Pub",
                "address": "Na Belidle 27, Praha 5-Andel",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "url": "http://rockinpub.hellsbells.cz/",
                "category": "music_rock"
            },
            {
                "title": "Golf Club Praha",
                "address": "Plzenska 401/2, Praha 5",
                "description": "Nice, calm place to play golf with course of nine holes. However, the course is quite hilly. You can also watch the game directly from the terrace of the local, homely restaurant.",
                "url": "http://www.gcp.cz/index.php?lang=en",
                "category": "golf"
            }]

        }
    ];

    // Create an array of styles.
    var styles = [
    {
        "featureType": "administrative.locality",
        "elementType": "geometry",
        "stylers": [
        { "visibility": "on" },
        { "hue": "#0099ff" },
        { "saturation": 20 }
        ]
    },
    {
    "stylers": [
      { "weight": 3 },
      { "visibility": "simplified" },
      { "saturation": -46 },
      { "gamma": 0.41 },
      { "hue": "#0077ff" }
    ]}];

    // constructor of location object
    var Location = function (data) {
        this.city = ko.observable(data.city);
        this.country = ko.observable(data.coutnry);
        this.places = data.favourite_places;
    };

    var setIconImage = function (category) {
        // console.log(category)
        return "images/" + category + ".png";
    }

    var createItem = function () {

    }

    // define a handler to manage the map loading
    ko.bindingHandlers.loadMap = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            console.log("map loading")
            // get the value of current Location and unwrap it (in case it is not an observable)
            // var map = ko.unwrap(bindingContext.$data.map());
            // var map2 = ko.unwrap(viewModel.map());
            var map;
            var location = valueAccessor();
            var locationUnwrapped = ko.unwrap(location);
            // define initial map variables
            var myLatLng = new google.maps.LatLng(50.0833, 14.4167);

            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            // define map options 
            var mapOptions = {
                center: myLatLng,
                zoom: 15,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            // display the updated map attached to the current element
            map = new google.maps.Map(element, mapOptions);

            //Associate the styled map with the MapTypeId and set it to display.
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

            // adjust the map when the window is beeing resized
            google.maps.event.addDomListener(window, 'resize', function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });

            // pass the map object to viewModel so it can be reached 
            // when markers are created
            (bindingContext.$data.map(map));
        }
    };

    // define a handler for displaying the markers
    ko.bindingHandlers.loadMarkers = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            console.log("load markers");
            var map = ko.unwrap(valueAccessor());
            var bounds = new google.maps.LatLngBounds();

            // get all the favourite places in currentLocation and
            // sort them alphabetically
            var places = bindingContext.$data.currentLocation().places;
            places.sort(function (place1, place2) {
                return (place1.title > place2.title) ? 1 : -1;
            });

            var markers = [];
            // console.log(places)

            var infoWindow = new google.maps.InfoWindow({
                maxWidth: 200
            }); //static infoWindow for all the markers, 
            // it makes sure only one ifowindow is open at the moment
            
            // initialize a variable for the last selected article
            var previousArticle;
            // initialize a variable for the last animated marker
            var previousAnimation;

            var address;
            var geocoder = new google.maps.Geocoder();
            
            // add markers of current place and display them
            places.forEach(function (place) {
                // define markers position and create an object
                var lat = place.lat;
                var lng = place.lng;
                var placeLatLng = new google.maps.LatLng(lat, lng);

                address = place.address;

                // use the google geocoding API to get latitude and longitude from
                // the address. The free API has request limit (11) in short time 
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();
                        createMarker (latitude, longitude);
                    } else {
                        console.log("request not successful")
                    }
                }); 
                // define a function that will create a marker, adjust the map according
                // to the marker and add the marker to the list in viewModel
                // the function shall be called after address is convert to
                // latitude and longitude
                function createMarker (lat, lng) {
                    console.log("create marker")
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lng),
                        map: map,
                        icon: setIconImage(place.category),
                        title: place.title,
                        address: place.address,
                        content: place.description,
                        link: place.url,
                        category: place.category,
                        // image: "https://maps.googleapis.com/maps/api/streetview?size=400x250&location=" + lat + "," + lng + " &fov=90&heading=235&pitch=10",
                        imageUrl: "https://maps.googleapis.com/maps/api/streetview?size=800x400&location=" + place.address,

                        // a function opening an info window, use this function to manipulate 
                        // the side-bar and the markers at the same time
                        openInfo: function () {
                            // open an info window
                            // infoWindow.setContent("<a href='#'>" + marker.title + "</a>" + "<p>" + marker.content + "</p>")
                            // infoWindow.open(map, this);

                            // create an animation of the marker, only one or any
                            // marker animation can be active at the moment

                            // activate the animation if not activated and asign the
                            // the current animation as the previous one
                            if (this.getAnimation() != null) {
                                this.setAnimation(null);
                                previousAnimation = this;
                            // or if the animation is not activated, check for the previous
                            // animation, switch it off if needed and activate the current animation,
                            // finaly asign the new activation to the previous one 
                            } else {
                                if ((previousAnimation) && (previousAnimation.getAnimation() != null)) {
                                    previousAnimation.setAnimation(null);                   
                                }

                                this.setAnimation(google.maps.Animation.BOUNCE);
                                previousAnimation = this;
                            }

                            // show the info of the actual selected place
                            var index = $.inArray(marker, markers)
                            var selectedArticleContent = $(".article:eq(" + index + ") .content")
                            selectedArticleContent.toggle();
                            
                            // hide the previously selected article if any
                            if(previousArticle) {
                                previousArticle.toggle()
                            };
                            // set the selected article as the previous one
                            previousArticle = selectedArticleContent;
                        }
                    })
                    // trigger an event when click on a marker
                    google.maps.event.addListener(marker, 'click', function() {
                        this.openInfo();
                    });

                    // add the new marker to the list of markers in viewModel
                    // so it can be used to build a sidebar list
                    bindingContext.$data.markers.push(marker)
                    markers.push(marker);

                    // adjust a map according to the added markers
                    bounds.extend(marker.position);
                    map.fitBounds(bounds)
                }
            })
        }

    }

    var AppViewModel = function () {
        // data
        var self = this;
        self.map = ko.observable();
        self.currentLocation = ko.observable(new Location(model[0]));
        self.markers = ko.observableArray();
    }
    
    // apply the bindings
    ko.applyBindings(new AppViewModel());
    
 });

