var searchbar = document.querySelector("#citysearch");
var searchbtnEL = document.querySelector("#searchbtn");
var history = document.querySelector("#pastsearch");
const APIkey = "c92fc7b87242fe86c7a3c7862d1bfa6c";
// var Citycall;
var Chosencity = document.querySelector("#Chosencity");
var Todaysforecast = document.querySelector("#todaysweather");
var currentwind = document.querySelector("#todayswind")
var currenthumidity = document.querySelector("#todayshumidity")
var currentUVindex = document.querySelector("#todaysUVindex")
var multiday = document.querySelector("#dailyforecast")
const pastcities= JSON.parse(localStorage.getItem("cities")) || [];
var historybutton= document.querySelector(".history")


//Need to pull weather
function weatherpull(city){

   
    var URLpull = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`

   console.log("high",URLpull)
   
    fetch(URLpull)
        .then(function(response){
            return response.json();
        })
        
        .then(function(data){
            console.log("Test",data)

       
            
            // Fills in the city name
             Chosencity.innerHTML= data.name
             $("#Chosencity").append(Chosencity)
             console.log(data.name)
            //Date
            var currentDate = new Date().toLocaleDateString();
            $("#Chosencity").append(" "+ currentDate)

            console.log("Mom",data.weather)

            //Weather icon 
            var weathericon = data.weather[0].icon;
            var currentweathericon = $('<img>');
            currentweathericon.attr("src", "http://openweathermap.org/img/wn/" + weathericon + ".png");
            $("#Chosencity").append(currentweathericon)

            //Temp
            var todaysweather = (data.main.temp - 273.15) * 1.80 + 32;
            console.log("here",todaysweather)
            Todaysforecast.innerHTML = ("Temperature :" + todaysweather.toFixed(2) + " °F")

            //Wind
            var todayswind = data.wind.speed
            console.log("Show me",todayswind)
            currentwind.innerText = ("Windspeed: " + todayswind + " MPH")

            //Humidity
            var todayshumidity = data.main.humidity
            currenthumidity.textContent = ("Humidity :" + todayshumidity + " %")

            //UV
            latitude = data.coord.lat;
            longitude= data.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+latitude+"&lon="+longitude+"&appid="+ APIkey;
            UVindex(uvURL)
            
            //5 day for cast
            cityId=data.id
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&units=imperial&appid="+ APIkey
            fivedayforecast(forecastQueryURL)
            

            



            
             
             
             

        })
}

function userseachinput(){
    CityEL = searchbar.value;  
    pastcities.push(CityEL)
    var searchedCity = document.createElement("li")
    
    searchedCity.setAttribute("id","maincity") 
    localStorage.setItem("cities", JSON.stringify(pastcities))
    
    // searchedCity.setAttribute("data-city",past) 
    searchedCity.innerHTML= CityEL  
    searchedCity.classList.add("btn")
    searchedCity.classList.add("list-group-item","bg-secondary","text-white","past-city")
    // searchedCity.addEventListener("click",weatherpull(CityEL))
    // $("#celly").on("click",weatherpull(CityEL.innerHTML))
    console.log("here",searchedCity)
    console.log("Pastcities",pastcities)
    

    

    
    // if (historyList.includes(CityEL) === false){
        $(".history").append(searchedCity)
  
}; 



//Event listeners for search bar
searchbtnEL.addEventListener("click",userseachinput)
searchbtnEL.addEventListener("click",function(){
  weatherpull(searchbar.value)  

})
historybutton.addEventListener("click",getPastcity)



//Need to pull API information


//UV colors and pull
function UVindex(uvURL){
    fetch(uvURL)
        .then(function(response){
            return response.json();
        })
        
        .then(function(data){
            console.log("Teste",data)
        //clears out the UV Index Title
        $("#UVtitle").empty();
        var sunshine = data.value
        $("#UVtitle").append("UV INDEX :")
        if(sunshine >= 0 && sunshine <= 3){
            
            //low : green
            currentUVindex.classList.add("btn-success");
        }
        else if(sunshine >= 3 && sunshine <= 6){
            
            //moderate : yellow
            currentUVindex.classList.add("btn-warning");
        } 
        else if(sunshine >= 6 && sunshine <= 8){
            
            //high : grey
            currentUVindex.classList.add("btn-secondary");
        }
        else if(sunshine >= 8 && sunshine <= 10){
            
            //very high : red
            currentUVindex.classList.add("btn-danger");
        }
        else if(sunshine >= 10){
            
            //extreme : light blue
            currentUVindex.classList.add("btn-primary");
        }
        currentUVindex.textContent = (sunshine)

        
        
        
        

        
})
}

//5 day forecast

function fivedayforecast(forecastQueryURL){
    //Clear out daily forecast
    $( "#dailyforecast" ).empty();

    fetch(forecastQueryURL)
        .then(function(response){
            return response.json();
        })
        
        .then(function(data){

        var forecasts = data.list ;
        console.log("HERE",forecasts)

        for (var i = 1; i <=5; i++) {
            var date;
            var temp;
            var icon;
            var wind;
            var humidity;

            console.log("IT")

            date = forecasts[i].dt;
            date = moment.unix(date).format("MM/DD/YYYY");

            longtemp = forecasts[i].main.temp
            temp = longtemp.toFixed(2)
            icon = forecasts[i].weather[0].icon;
            wind = forecasts[i].wind.speed;
            humidity = forecasts[i].main.humidity;

            // create a card
            var card = document.createElement('div');
            card.classList.add('card', 'col-2', 'm-1', 'bg-primary', 'text-white');
            
            // create card body and append
            var cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            cardBody.innerHTML = `<h6>${date}</h6>
                                  <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                   ${temp}°F<br>
                                   ${wind} MPH <br>
                                   ${humidity}%`
            
            card.appendChild(cardBody);
            multiday.append(card);
        }
    })  



}

function getPastcity(event){
    var element= event.target;

    

    if(element.matches(".past-city")){

        currentCity=element.textContent;
        
   
            weatherpull(currentCity);
 
}



}