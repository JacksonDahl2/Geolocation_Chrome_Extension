# By Jackson Dahl & Aaron Chen.
# Geolocation_Chrome_Extension
For the Codesmith hackathon on 2023-04-05. Chrome extension that displays geolocation data of the website the user is on.

Uses the ip geolocation api [ipgeolocation](https://app.ipgeolocation.io/) and the weather api https://openweathermap.org/api to accomplish our extension.

The extension takes the currently open tab's domain name to find it's associated ip. It then can make the calls to the geo-locator api to get information about where the current website is hosted. 

