(function() {
    var app = angular.module('myApp', []);
    
    //Welcome/Loading directive before weather is showed
    app.directive('welcomeDiv', function(){
        return{
            restrict: 'E',
            templateUrl: 'welcome-div.html'
        };
    });
    
    //Directive for currently weather predictions
    app.directive('currentWeather',['$http', function($http){
       return{
           restrict: 'E',
           templateUrl: 'current-weather.html',
           controller:function(){
                var today = this;
                today.info = [];
                today.date = new Date();

                today.setInfo = function (lat, lng) {            
                    if(lat > 0) {
                        if(today.info.length == 0){
                            $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&appid=2064cd1f6b177f54627e549645285203')
                                 .then(function(resp) {
                                    today.info = resp.data;

                                    if(today.info.sys.sunset*1000 < today.date)
                                        today.dayNight = "night";
                                    else
                                        today.dayNight = "day";                            
                                 }, function(error) {
                                    today.error = error;
                                 });
                        }
                    }

                    return today.info.length != 0;
                };
           },
           controllerAs: 'current'
       };
    }]);
    
    //Three days forecast counting after the current date
    app.directive('threeDayWeather',['$http', function($http){
        return{
            restrict: 'E',
            templateUrl: 'three-day-weather.html',
            controller: function(){
                var forecast = this;
                forecast.info = [];

                forecast.setInfo = function(lat, lng) {  
                    if(lat > 0) {
                        if(forecast.info.length == 0){
                            $http.get('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lng + '&units=metric&appid=2064cd1f6b177f54627e549645285203')
                                 .then(function(resp) {
                                    var today = new Date();
                                    today.setHours(0,0,0,0);

                                    forecast.info = resp.data;

                                    forecast.weatherInfo = [];

                                    if(forecast.info.list.length > 0){
                                        var i;
                                        var start = 0;
                                        var end = 0;
                                        for (i = 0; i < forecast.info.list.length; i++){
                                            var currentDate = new Date(forecast.info.list[i].dt*1000);
                                            currentDate.setHours(0,0,0,0);

                                            //number of days after current date
                                            var days = ((currentDate.getTime() - today.getTime()) / (1000*60*60*24));

                                            if(days == 1 && start == 0){
                                                start = i;
                                            }

                                            if(days == 4){
                                                end = i;
                                                break;
                                            }
                                        }
                                        
                                        var x = 0;
                                        var min = forecast.info.list[0].main.temp_min;
                                        var max = 0;
                                        var t = 0;

                                        //count number of daily forecast.info.list[index].main.temp
                                        var count = 0; 
                                        var hours = [];
                                        var keywords = [];

                                        for(i = start; i < end; i++){
                                            //console.log(forecast.info.list[i]);
                                            var date1 = 0;
                                            var date2 = 0;

                                            hours[count] = forecast.info.list[i];

                                            if(keywords.length == 0){
                                                keywords[count] = {
                                                    val: forecast.info.list[i].weather[0].main,
                                                    count: 1
                                                };
                                            }
                                            else {
                                                var n;

                                                for(n = 0; n < keywords.length; n++){
                                                    if(forecast.info.list[i].weather[0].main == keywords[n].val)
                                                        keywords[n].count += 1;
                                                    else
                                                        keywords[n + 1] = {
                                                            val: forecast.info.list[i].weather[0].main,
                                                            count: 1
                                                        };

                                                    //console.log(keywords[n]);
                                                }
                                            }

                                            count = count + 1;
                                            t = t + forecast.info.list[i].main.temp;

                                            if(forecast.info.list[i].main.temp_max > max)
                                                max = forecast.info.list[i].main.temp_max;

                                            if(forecast.info.list[i].main.temp_min < min)
                                                min = forecast.info.list[i].main.temp_min;

                                            if(i < end){
                                                date1 = new Date(forecast.info.list[i].dt*1000);
                                                date1.setHours(0,0,0,0);
                                                date2 = new Date(forecast.info.list[i + 1].dt*1000);
                                                date2.setHours(0,0,0,0);

                                                var days = ((date2.getTime() - date1.getTime()) / (1000*60*60*24));

                                                if(days == 1){
                                                    var nKey;
                                                    var main_max = keywords[0].count;
                                                    var main;

                                                    for(nKey = 0; nKey < keywords.length; nKey++){
                                                        main = main_max >= keywords[nKey].count ? keywords[nKey].val : main;
                                                    }

                                                    t = t / count; 

                                                    forecast.weatherInfo[x] = {
                                                        date: date1,
                                                        hours: hours,
                                                        temp: t,
                                                        temp_min: min,
                                                        temp_max: max,
                                                        main: main
                                                    };

                                                    x = x + 1;

                                                    t = 0;
                                                    count = 0;
                                                    hours = [];
                                                }
                                            }  

                                        }
                                    }

                                    //console.log(forecast.weatherInfo);
                                 }, function(error) {
                                    forecast.error = error;
                                 });
                        }
                    }

                    return forecast.info.length != 0;
                }
            },
            controllerAs: 'forecast'
        };
    }]);
    
    //Get current location using html5 geolocation
    app.controller('LocationController',['$scope', function($scope){ 
        var coords = this;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
        else {
            coords.error = "Geolocation is not supported by this browser.";
        }
        
        function showPosition (position) {
            coords.pos = position.coords;
            $scope.$apply();
        }
 
        function showError (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    coords.error = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    coords.error = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    coords.error = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    coords.error = "An unknown error occurred."
                    break;
            }
            
            $scope.$apply();
        }               
    }]);

    //Controller for card fliping animation
    app.controller('flipCtrl',['$scope', function($scope) {}]);
    
})();