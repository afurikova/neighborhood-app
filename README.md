# neighborhood app

[See the project](http://adica.me.cz/neighborhood/)

This is my realization of a final project of [JavaScript Design Patterns](https://www.udacity.com/course/javascript-design-patterns--ud989) course on Udacity.

A single-page web application. It shows my favourite places of chosen location. In this project I use framework Knockout js and in order to get some additional information about the places I retrieve data through Google Maps API and its relevant services.

The application first loads a map of given location via Google Maps API. Then I turn each favourite place of that location into a marker object. I use Geocoding service to convert the addresses into geographic coordinates.  The markers are displayed on the map and the map is centred according to the markers. 

The markers are then used to build a side bar that interacts with the markers. When click on a marker or a side bar element, the marker animation is triggered and description of the place is displayed included a picture that is retrieved from Street View Service. The side bar is also scrolled to the relevant element. 
At one moment only one mark animation can be active and only one element description content can by displayed. 

### In the project, I am using following APIs:  
*	Google Maps API
