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
                "address": "Na Pankraci 32, Praha 4, 147 00",
                "description": "One of the several KMG training places in Prague where I used to do my trainings. Awesome pepople and awesome trainers.",
                "url": "http://www.krav-maga.cz/",
                "category": "sport",
                "lat" : 50.0833,
                "lng" : 14.4167
            },
            {
                "title": "Swimming Pool Podoli",
                "address": "Podolská 74, 147 50 Praha 4",
                "description": "Don't know what to do during the sunny days? Go to Podoli. Beside a huge indoor and two outdoor swimming pools you can find there a water slide, pools for kids fitness and several fast-foods. One of the oudtood swimming pool is warmed up in any season so you can enjoy outdoor swimming also during the winter.",
                "url": "http://www.pspodoli.cz/",
                "category": "swimming",
                "lat" : 50.051762,
                "lng" : 14.416978
            },
            {
                "title": "Hybernia",
                "address": "Hybernska 7/1033, Praha 1, 110 00",
                "description": "Czech cuisine is said to be heavy and unhealthy. But not in this restaurant where you can get some of delicious czech specialities for reasonable prices. And in addition to that you can also draw beer directly from the table. ",
                "url": "http://www.hybernia.cz/",
                "category": "restaurant",
                "lat" : 50.087502,
                "lng" : 14.431470
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
        { "saturation": 30 }
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

// Create an array of styles.
  // var styles = [
  //   {
  //     stylers: [
  //       { hue: "#00ffe6" },
  //       { saturation: -20 }
  //     ]
  //   },{
  //     featureType: "road",
  //     elementType: "geometry",
  //     stylers: [
  //       { lightness: 100 },
  //       { visibility: "simplified" }
  //     ]
  //   },{
  //     featureType: "road",
  //     elementType: "labels",
  //     stylers: [
  //       { visibility: "off" }
  //     ]
  //   }
  // ];


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

            var places = viewModel.currentLocation().places;
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
            // image for the marker
            // var iconImage = 'images/restaurant.png';

            var index = 0;


            // add markers of current place and display them
            places.forEach(function (place) {
                // define markers position and create an object
                var lat = place.lat;
                var lng = place.lng;
                var placeLatLng = new google.maps.LatLng(lat, lng);
                
                var marker = new google.maps.Marker({
                    position: placeLatLng,
                    map: map,
                    icon: setIconImage(place.category),
                    title: place.title,
                    address: place.address,
                    content: place.description,
                    link: place.url,
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
                });
                
                // trigger an event when click on a marker
                google.maps.event.addListener(marker, 'click', function() {
                    this.openInfo();
                });

                // add each marker to the list
                markers.push(marker);
                // and extend the boundaries of the map according to the each added marker
                bounds.extend(marker.position);
                index = index + 1;
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
    }
    
    // apply the bindings
    ko.applyBindings(new AppViewModel());
    
 });

