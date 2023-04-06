/**
 * Geolocation chrome extension by Aaron Chen and Jackson Dahl
 * Description: 
 */


// messing with api access
const ipGeolocation_API_key = 'e025e69f35024a1e811f198d05431291';
const myIp = '38.140.1.59';
const endPointURL = 'https://api.ipgeolocation.io/ipgeo';




// weather api
const weather_API_key = '5468041419edd23a2de0ccffb23d5e27';


class DisplayInformation {
  constructor(data) {
    /**
     * want: country_name, country_capital, longitude, latitude, current_time
     */
    // from ip location
    this.country = data.country_name;
    this.capital = data.country_capital;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.time = data.time_zone.current_time;
    this.country_code = data.country_code2; // for reference in flag folder
    this.flag_path = `./flags/${this.country_code.toLowerCase()}.png`

    // from weather
    this.temperature; // C    // F
    this.wind_speed; // km/h  // mph
    this.percipitation; // mm // in
    this.cloudcover;  // % ?
    this.visibility; // km    // mi
    this.weather_icon; 
    this.addWeatherInformation = (data) => {
      this.temperature = data.current.temperature;
      this.wind_speed = data.current.wind_speed;
      this.weather_icon = data.current.weather_icons[0];
      this.percipitation = data.current.precip;
      this.cloudcover = data.current.cloudcover;
      this.visibility = data.current.visibility;
    }
    this.convertF = () => {
      this.temperature = Math.floor((this.temperature * 9/5) + 32);
      this.wind_speed = Math.floor(this.wind_speed / 1.609);
      this.percipitation = Math.floor(this.percipitation / 25.4);
      this.visibility = Math.floor(this.visibility / 1.609);
    }
  }
}


// want to get the ip of whatever website the user is on

async function logJSONData() {
  // location api call
  const location_url = `https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeolocation_API_key}&ip=${myIp}`
  const response = await fetch(location_url);
  const jsonData = await response.json();
  let location_obj = parseDataIntoObject(jsonData);

  // weather api call
  const location_string_for_weather = `'${location_obj.capital},${location_obj.country}'`
  const weather_url = `http://api.weatherstack.com/current?access_key=${weather_API_key}&query=${location_string_for_weather}`
  const response2 = await fetch(weather_url);
  const jsonData2 = await response2.json();
  location_obj.addWeatherInformation(jsonData2);
  console.log(location_obj);
  location_obj.convertF();
  console.log(location_obj);
}


function parseDataIntoObject(jsonData) {
  const new_country_display = new DisplayInformation(jsonData)
  return new_country_display;
}

logJSONData();
