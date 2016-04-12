var app = angular.module('userLocal', []);

var forecast = [{
    date: 1465804800000,//Today Date
    city: "consenza",
    country: "IT",
    main: "sun",
    temp: 23,
    temp_min: 18,
    temp_max: 25,
    humidity: 67,
    wind_speed: 5,
    sunrise: new Date(1465796700000),
    sunset: new Date(1465849800000)
    },
                
    {
    date: 1465891200000,
    city: "consenza",
    country: "IT",
    main: "rain",
    temp: 20,
    temp_min: 16,
    temp_max: 25,
    humidity: 60,
    wind_speed: 3,
    sunrise: new Date(1465882200000),
    sunset: new Date(1465936643000)
    } ,
                
    {
    date: 1465977600000,
    city: "consenza",
    country: "IT",
    main: "sun",
    temp: 22,
    temp_min: 20,
    temp_max: 28,
    humidity: 75,
    wind_speed: 6,
    sunrise: new Date(1465968841000),
    sunset: new Date(1466023392000)
    } ,
                
    {
    date: 1466064000000,
    city: "consenza",
    country: "IT",
    main: "sun",
    temp: 25,
    temp_min: 21,
    temp_max: 26,
    humidity: 72,
    wind_speed: 5,
    sunrise: new Date(1466054684000),
    sunset: new Date(1466109894000)
    } 
];

app.controller("GetLocation", function($scope){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.$apply(function(){
                $scope.lat = lat;
                $scope.lng = lng;
            });
        });
    } else {
        $scope.error = "Geolocation is not supported by this browser.";
    }
});

app.controller("GetForecast", function(){
    this.today = forecast[0];
    
    this.pred = {};
    
    this.pred[0] = forecast[1];
    this.pred[1] = forecast[2];
    this.pred[2] = forecast[3];
                
    /*$http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + 39.82 + "&" + "lon=" + -7.49 + "&appid=2064cd1f6b177f54627e549645285203").success(function(response){
        this.data = response.data;
    });*/
    
    
});
