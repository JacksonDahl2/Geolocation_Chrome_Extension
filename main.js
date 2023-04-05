/**
 * Geolocation chrome extension by Aaron Chen and Jackson Dahl
 * Description: 
 */


// messing with api access
const ipGeolocation_API_key = 'e025e69f35024a1e811f198d05431291';
const myIp = '38.140.1.57';
const endPointURL = 'https://api.ipgeolocation.io/ipgeo';

const test = `https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeolocation_API_key}&ip=${myIp}`


async function logJSONData() {
  console.log('here');
  const response = await fetch(test);
  const jsonData = await response.json();
  console.log(jsonData);
}

logJSONData();
