/* Magic Mirror Module: MMM-Weather-Now helper
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Weather-Now helper, started...');

        // Set up the local values
        this.nowIcon = '';
        this.nowWeather = '';
        this.nowTempC = '';
        this.nowTempF = '';
        },


    getWeatherData: function(payload) {

        var that = this;

        request({url: payload, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                // Let's get the weather data for right now
                that.nowIcon = result.current_observation.icon;
                that.nowWeather = result.current_observation.weather;
                that.nowTempC = result.current_observation.feelslike_c;
                that.nowTempF = result.current_observation.feelslike_f;
            } else {
                // In all other cases it's some other error
                that.nowIcon = 'blank';
                that.nowWeather = 'Error getting data';
                that.nowTempC = '--';
                that.nowTempF = '--';
                }

                // We have the response figured out so lets fire off the notifiction
                this.sendSocketNotification('GOT-WEATHER-NOW', {'url': payload, 'nowIcon': this.nowIcon, 'nowWeather': this.nowWeather, 'nowTempC': this.nowTempC, 'nowTempF': this.nowTempF});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-WEATHER-NOW') {
            this.getWeatherData(payload);
            }
        }

    });
