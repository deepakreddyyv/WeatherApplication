const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

let buttonName = "";

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})


app.post("/", function(req, res) {
  if (req.body.button === "redirect") {
    res.redirect("/")
  }
  else {
  const query = req.body.cityName;
  const apiKey = "fa76048996fcd9ebfd8a315e70fb12c9";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response) {
    console.log(response.statusCode);

    if (response.statusCode === 200) {
      response.on('data', function(data) {
        const weatherData = JSON.parse(data);
        const temp = Math.round(weatherData.main.temp);
        const desc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const country = weatherData.sys.country;
        const city = weatherData.name;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const humidity = weatherData.main.humidity;

        const options = {weekday: "long", day: "numeric", month: "long" };
        const today = new Date();

        const currentTime = today.toLocaleDateString("en-US", options);

        let sunrise_utc = weatherData.sys.sunrise;
        let sunset_utc = weatherData.sys.sunset;

        var date_r = new Date(sunrise_utc * 1000);
        var hours_r = date_r.getHours();
        var minutes_r = "0" + date_r.getMinutes();
        var seconds_r = "0" + date_r.getSeconds();
        var formattedTime_r = hours_r + ':' + minutes_r.substr(-2) + ':' + seconds_r.substr(-2);

        var date_s = new Date(sunset_utc * 1000);
        var hours_s = date_s.getHours();
        var minutes_s = "0" + date_s.getMinutes();
        var seconds_s = "0" + date_s.getSeconds();
        var formattedTime_s = hours_s + ':' + minutes_s.substr(-2) + ':' + seconds_s.substr(-2);

        res.render("weather", {
          City: city,
          Country: country,
          Temp: temp,
          Time: currentTime,
          Image: imageUrl,
          Desc: desc,
          Humidity: humidity,
          Sunrise: formattedTime_r,
          Sunset: formattedTime_s,
        })

      });
    } else {
       res.sendFile(__dirname +"/failure.html");
    }

  })
}
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port number 3000");
})
