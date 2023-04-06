/**
 * Geolocation chrome extension by Aaron Chen and Jackson Dahl
 * Description: 
 */

class DisplayInformation {
  constructor(data) {
    /**
     * want: country_name, country_capital, longitude, latitude, current_time
     */
    // from ip location
    this.country = data.country_name;
    this.city = data.city;
    this.capital = data.country_capital;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.time = data.time_zone.current_time;
    this.country_code = data.country_code2; // for reference in flag folder
    this.flag_path = `./flags/${this.country_code.toLowerCase()}.png`

    // from weather
    this.temperature; // C    // F
    this.wind_speed; // km/h  // mph
   // this.percipitation; // mm // in
    this.cloudcover;  // % ?
    this.visibility; // km    // mi
    this.description; 
    this.addWeatherInformation = (data) => {
      //console.log(data);
      this.temperature = data.main.temp;
      this.wind_speed = Math.floor(data.wind.speed);
      this.description = data.weather[0].description;
      //this.percipitation = data.rain['1hr'];
      this.cloudcover = data.clouds.all;
      this.visibility = data.visibility;
    }
    this.convertF = () => {
      this.temperature = Math.floor((this.temperature * 9/5) + 32);
      this.wind_speed = Math.floor(this.wind_speed / 1.609);
      this.percipitation = Math.floor(this.percipitation / 25.4);
      this.visibility = Math.floor(this.visibility / 1.609);
    }
  }
}

// get current tab gets the current tab and returns the url
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  url = await tab.url;
  console.log(url);
  logJSONData(url)
}


getCurrentTab();
  // messing with api access
const ipGeolocation_API_key = 'e025e69f35024a1e811f198d05431291';
let myIp = {'https://www.facebook.com/': '157.240.241.35',
            'https://www.google.com/': '142.250.81.238',
            'https://alaska.gov/': '158.145.65.37',
            'https://www.novinky.cz/': '77.75.78.151',
            'https://www.baidu.com/': '110.242.68.66',
            'https://shopee.vn/': '103.117.240.34',
            'https://www.hasil.gov.my/':'113.11.238.133',
            'https://www.kpay.com.kw/portal/':'195.137.190.29'};

const common_weather = {
  'clear sky': 'https://openweathermap.org/img/wn/01d@4x.png',
  'few clouds': 'https://openweathermap.org/img/wn/02d@4x.png',
  'scattered clouds': 'https://openweathermap.org/img/wn/03d@4x.png',
  'broken clouds': 'https://openweathermap.org/img/wn/04d@4x.png',
  'shower rain':'https://openweathermap.org/img/wn/09d@4x.png',
  'rain': 'https://openweathermap.org/img/wn/10d@4x.png',
  'thunderstorm': 'https://openweathermap.org/img/wn/11d@4x.png',
  'snow':'https://openweathermap.org/img/wn/13d@4x.png',
  'mist':'https://openweathermap.org/img/wn/50d@4x.png',
  'overcast clouds':'https://openweathermap.org/img/wn/04d@4x.png'
}

const fun_facts = {
  'China': 'Toilet paper was invented in China',
  'United States': 'More people live in New York City than in 40 out of 50 of the states',
  'Vietnam': 'Almost every household in Vietnam has a motorcycle',
  'Czech Republic': 'The Czech Republic has the most castles out of every country in Europe.',
  'Malaysia': 'The worlds largest cave chamber is in Malaysia',
  'Kuwait': 'The Kuwait Dinar is the most valuable currency in the world',
}

//logJSONData('https://www.google.com/');

  // weather api
//const weather_API_key = '5468041419edd23a2de0ccffb23d5e27';
  //want to get the ip of whatever website the user is on
async function logJSONData(web_ip) {
  console.log(myIp[web_ip]);
  // location api call
  const location_url = `https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeolocation_API_key}&ip=${myIp[web_ip]}`
  const response = await fetch(location_url);
  const jsonData = await response.json();
  let location_obj = parseDataIntoObject(jsonData);

  // weather api call
  getWeather(location_obj, web_ip)
    .then((data) => {
      location_obj.addWeatherInformation(data)
      //console.log(location_obj);
      buildHTML(location_obj, web_ip);
    });
}

function buildHTML(location_obj, web_ip) {
  console.log(location_obj);

  let webSiteName = document.querySelector('#currentWebsite');
  webSiteName.innerText = web_ip;
  let countryInput = document.querySelector('#facts > :first-child');
  countryInput.textContent = location_obj.country;
  let capitalInput = document.querySelector('#facts > :nth-child(3)');
  capitalInput.textContent = location_obj.city;
  let flagInput = document.querySelector('#facts > :nth-child(2)');
  let flagImage = document.createElement('img');
  flagImage.setAttribute('src', location_obj.flag_path);
  flagImage.setAttribute('width', "100px");
  flagInput.append(flagImage);
  let longInput = document.querySelector('#facts > :nth-child(4)');
  longInput.textContent = `longitude: ${location_obj.longitude}`;
  let latInput = document.querySelector('#facts > :nth-child(5)');
  latInput.textContent = `latitude: ${location_obj.latitude}`;
  let funFact = document.querySelector('#facts > :nth-child(6)')
  funFact.textContent = `funFact: ${fun_facts[location_obj.country]}`;
  //populate weather
  // this.temperature = data.main.temp;
  // this.wind_speed = Math.floor(data.wind.speed);
  // this.description = data.weather[0].description;
  // //this.percipitation = data.rain['1hr'];
  // this.cloudcover = data.clouds.all;
  // this.visibility = data.visibility;
  let temperatureInput = document.querySelector('#Weather > :first-child');
  temperatureInput.textContent = `Temperature: ${Math.floor(location_obj.temperature - 273.15)}C`;
  let wind_speedInput = document.querySelector('#Weather > :nth-child(2)');
  console.log(location_obj.wind_speed);
  wind_speedInput.textContent = `Wind Speed: ${location_obj.wind_speed}km/h`;
  let descriptionInput = document.querySelector('#Weather > :nth-child(3)');
  descriptionInput.textContent = `Description: ${location_obj.description}`;
  let cloudcoverInput = document.querySelector('#Weather > :nth-child(4)');
  cloudcoverInput.textContent = `Cloud coverage: ${location_obj.cloudcover}%`;
  let visibilityInput = document.querySelector('#Weather > :nth-child(5)');
  if (location_obj.visibility === 10000) {
    location_obj.visibility = 'Clear';
  }
  visibilityInput.textContent = `Visibility: ${location_obj.visibility}`;

  let weatherIcon = document.querySelector('#Weather >:nth-child(6)');
  let weatherImage = document.createElement('img');
  weatherImage.setAttribute('src', common_weather[location_obj.description]);
  weatherImage.setAttribute('width', "100px");
  weatherIcon.append(weatherImage);

  // weather icon
} 

async function getWeather(location_obj) {
  const key = '19775201bbeb6b19e7f4e1737a8dfe1e';

  //const location_string_for_weather = `${location_obj.capital},${location_obj.country}`
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${location_obj.latitude}&lon=${location_obj.longitude}&appid=${key}`;
  //const weather_url = `http://api.weatherstack.com/current?access_key=${weather_API_key}&query=${location_string_for_weather}`
  const response2 = await fetch(weather_url);
  const jsonData2 = await response2.json();
  return jsonData2;
}

const weatherButton = document.querySelector('#weatherbutton');
const factsButton = document.querySelector('#normalfactsbutton');
weatherButton.addEventListener( 'click', () => {
  document.querySelector('#Weather').style.display = "block";
  document.querySelector('#facts').style.display = "none";
})
factsButton.addEventListener( 'click', () => {
  document.querySelector('#Weather').style.display = "none";
  document.querySelector('#facts').style.display = "block";
})


function parseDataIntoObject(jsonData) {
  const new_country_display = new DisplayInformation(jsonData)
  return new_country_display;
}
