var input = document.querySelector("#userInput");
var searchBtn = $(".searchBtn");
var userHistory = []
var cityBtn= $(".city");

// shows history even if screen is refreshed by getting local storage
var searchedCity = JSON.parse(localStorage.getItem("userHistory"))

if (searchedCity !== null) {
userHistory = userHistory.concat(searchedCity)

  for (i=0; i<searchedCity.length; i++) {
    $(".search").append(`<button style='margin-top:5px' class="city blue btn-small col s12">${searchedCity[i]}</button>`)


  } 
}

//on click it registers "input" and creates additional buttons and then pushes input into an array for storage
searchBtn.on("click", function () {

  input = $("input").val();
  $(".search").append(`<button style='margin-top:5px' class="city blue btn-small col s12" id='${input}'>${input}</button>`)
      
  userHistory.push(input)
  console.log(userHistory)
  localStorage.setItem("userHistory", JSON.stringify(userHistory))

  searchCity1(input);
  searchCity2(input);
  
})

// on click for the history buttons
$(".city").on("click", function(){
  input = $(this).text()
  // console.log(input)
  searchCity1(input);
  searchCity2(input);
  })


function searchCity1 (input) {
    var APIkey = "101a21b7d007f5835596750d36b5f1a2"
    var fetchAPI = `https://api.openweathermap.org/data/2.5/forecast?q=` + input + `&units=imperial&appid=` + APIkey
    // console.log(fetchAPI)
    fetch (fetchAPI)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
         console.log(data)
        var city = $("h2").html(data.city.name)

        //clear before running again
        $("#forecast").empty()
        //choose the arrays with noon in the dt_txt only in the 5 day forecast api
        for (var i = 0; i<data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("12:00:00") !== -1 ) {
            // console.log (data.list[i].dt_txt)
            //make cards
            var col = $("<div class='col s2.5 here2'>");
            var card = $("<div class='card blue-grey darken-1 here3'>");
            var cardContent = $("<div class='card-content white-text here4'>");
            console.log(i)
            //apply information to cards
            var day = moment(data.list[i].dt_txt).format("MMM Do YY");
            console.log(day)
            var date = $("<p>").text(day);
            var iconID5 = data.list[i].weather[0].icon;
            //  console.log(iconID5)
            // var iconUrl5 = "http://openweathermap.org/img/wn/10d@2x.png"
            var icon5 = $(`<p><img src='http://openweathermap.org/img/wn/${iconID5}.png'></p>`);

            var temp5 = $("<p>").text(`Temp: ${data.list[i].main.temp}\xB0F`);
            //console.log(temp5)

            var wind5 = $("<p>").text(`Wind: ${data.list[i].wind.speed}mph`);
            // console.log(wind5)

            var humidity5 = $("<p>").text(`Humidity: ${data.list[i].main.humidity}%`)
            // console.log(humidity5)
            
            //append information to cards
            cardContent.append(date, icon5, temp5, wind5, humidity5);
            card.append(cardContent);
            col.append(card);
            $("#forecast").append(col)
          }
        }
      })
}      
    
function searchCity2 (input) {
    var APIkey = "101a21b7d007f5835596750d36b5f1a2"
    var fetchAPI = `https://api.openweathermap.org/data/2.5/weather?q=` + input + `&units=imperial&appid=` + APIkey
    // console.log(fetchAPI)
    fetch (fetchAPI)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        // console.log(data)
        var lat = data.coord.lat
        var lon = data.coord.lon
        var fetchuv = `https://api.openweathermap.org/data/2.5/onecall?lat=` + lat + `&lon=` + lon + `&units=imperial&exclude=hourly,daily&appid=` + APIkey
          fetch (fetchuv)
          .then(function (response) {
          return response.json();
          })
          .then(function (data) {
          // console.log(data)
          var iconID = (data.current.weather[0].icon)
          // console.log(iconID)
          var iconUrl = "http://openweathermap.org/img/wn/10d@2x.png"
          var icon = $("#icon").html('<img src="http://openweathermap.org/img/wn/' + iconID + '@2x.png">')
          var uvi = data.current.uvi
          var uvColor = ""
          if (uvi < 3) {
            uvColor = "<span style='background-color: green; color: white; border-radius: 25%'>" + uvi + "<span>"
          } else if (3 >= uvi && uvi < 6) {
            uvColor = "<span style='background-color: yellow; color: white; border-radius: 25%'>" + uvi + "<span>"
          } else if (6 >= uvi && uvi < 8) {
            uvColor = "<span style='background-color: orange; color: white; border-radius: 25%'>" + uvi + "<span>"
          } else {
            uvColor = "<span style='background-color: red; color: white; border-radius: 25%'>" + uvi + "<span>"
          }
          var uv = $("#uv").html("UV Index: " + uvColor)
          // console.log(uvColor)
          })
          var today = moment();
          $("#date").text(today.format("dddd, MMM Do, YYYY"))
          var temp = $("#temp").html("Temp: " + data.main.temp + "\xB0F")
          var wind = $("#wind").html("Wind: " + data.wind.speed + "mph")
          var humid = $("#humid").html("Humidity: " + data.main.humidity + "%")
          // console.log(fetchuv)
        })
}