/* Magic Mirror Module: MMM-Weather-Now
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-Weather-Now', {

    defaults: {
            api_key:    '',
            lat:		0.0,
            lon:		0.0,
			units:		'M',
			lang:		'en',
            interval:   900000 // Every 15 mins
        },


    start:  function() {
        Log.log('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-Weather-Now') {
            this.data.classes = 'MMM-Weather-Now bright medium';
        }

        // Set up the local values, here we construct the request url to use
        this.units = this.config.units;
        this.loaded = false;
        this.url = 'https://api.weatherbit.io/v2.0/current?key=' + this.config.api_key + '&lat=' + this.config.lat + '&lon=' + this.config.lon + '&units=' + this.config.units + '&lang=' + this.config.lang;
        this.nowIcon = '';
        this.nowWeather = '';
        this.nowTemp = '';

        // Trigger the first request
        this.getWeatherData(this);
        },


    getStyles: function() {
            return ['weather-now.css', 'font-awesome.css'];
        },


    getTranslations: function() {
        return  {
				da: 'translations/da.json',
                en: 'translations/en.json',
				nb:	'translations/nb.json'
                };
        },


    getWeatherData: function(_this) {
        // Make the initial request to the helper then set up the timer to perform the updates
        _this.sendSocketNotification('GET-WEATHER-NOW', _this.url);
        setTimeout(_this.getWeatherData, _this.config.interval, _this);
        },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;
		var C = '--';
		var F = '--';
		if (this.nowTemp !== '--') {
			if (this.units = 'M') {
				C = this.nowTemp;
				F = Math.round( (((C*9)/5)+32) * 10 ) / 10;
			} else {
				F = this.nowTemp;
				C = Math.round( (((F-32)*5)/9) * 10 ) / 10;
				}
			}

        // If we have some data to display then build the results table
        if (this.loaded) {
            wrapper = document.createElement('div');
		    wrapper.className = 'now small';

            // Elements to add to the wrapper
            nowIconImg = document.createElement('img');
            nowIconImg.className = 'nowIcon';
            nowIconImg.src = './modules/MMM-Weather-Now/images/' + this.nowIcon + '.gif';

            nowDetailDiv = document.createElement('div');
            nowDetailDiv.className = 'nowDetail';

            // Elements to add to the nowDetail
            nowTitleDiv = document.createElement('div');
            nowTitleDiv.className = 'nowTitle normal';
            nowTitleDiv.innerHTML = this.translate('NOW');

            nowTextDiv = document.createElement('div');
            nowTextDiv.className = 'nowText';
            nowTextDiv.innerHTML = this.nowWeather;

            nowTempDiv = document.createElement('div');
            nowTempDiv.className = 'nowTemp';
            if (this.units === 'M') {
				nowTempDiv.innerHTML = this.translate('FEELS_LIKE') + ' ' + C + '&deg; C (' + F + '&deg; F)';
            } else {
                nowTempDiv.innerHTML = this.translate('FEELS_LIKE') + ' ' + F + '&deg; F (' + C + '&deg; C)';
                }

            // Add elements to the nowDetail div
            nowDetailDiv.appendChild(nowTitleDiv);
            nowDetailDiv.appendChild(nowTextDiv);
            nowDetailDiv.appendChild(nowTempDiv);

            // Add elements to the now div
            wrapper.appendChild(nowIconImg);
            wrapper.appendChild(nowDetailDiv);
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = this.translate('LOADING');
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-WEATHER-NOW' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.nowIcon = payload.nowIcon;
                this.nowWeather = payload.nowWeather;
                this.nowTemp = payload.nowTemp;
                this.updateDom(1000);
            }
        }
    });
