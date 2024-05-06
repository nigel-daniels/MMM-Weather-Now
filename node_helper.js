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
		this.isDay = 1;
        this.nowWeather = '';
        this.nowC = '';
		this.nowF = '';
        },


    getWeatherData: function(payload) {

        var that = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                // Let's get the weather data for right now
                that.nowIcon = result.current.condition.code;
				that.isDay = result.current.is_day;
                that.nowWeather = result.current.condition.text;
                that.nowC = result.current.feelslike_c;
				that.nowF = result.current.feelslike_f;
            } else {
                // In all other cases it's some other error
                that.nowIcon = '0000';
                that.nowWeather = 'Error getting data';
                that.nowC = '--';
				that.nowF = '--';
            }

            // We have the response figured out so lets fire off the notifiction
            that.sendSocketNotification('GOT-WEATHER-NOW', {
				'url': that.url,
				'nowIcon': that.nowIcon,
				'isDay': that.isDay,
				'nowWeather': that.nowWeather,
				'nowC': that.nowC,
				'nowF': that.nowF
			});
        });
    },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-WEATHER-NOW') {
            this.getWeatherData(payload);
            }
        }

    });
