const time1=document.getElementById('time');
const date1=document.getElementById('date');
const currentWeatherElements=document.getElementById('current-weather-items');
const timezone=document.getElementById('time-zone');
const country1=document.getElementById('country');
const weatherForecast=document.getElementById('weather-forecast');
const currentTemp=document.getElementById('current-temp');

const API_KEY='2f6818e8ea8cd3f9a435462bebe4d7ab';

const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months=['Jan','Feb','Mar','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
setInterval(() =>{
    const time=new Date();
    const month=time.getMonth();
    const day=time.getDay();
    const date=time.getDate();
    const hour=time.getHours();
    const minutes=time.getMinutes();
    const HourIn12HourFormat=hour>=13?hour %12:hour;
    const ampm=hour>=12?'PM':'AM';
    time1.innerHTML= HourIn12HourFormat+':'+ minutes +''+ `<span id="am-pm">${ampm}</span>`
    
    date1.innerHTML=days[day]+ ', '+date+' '+months[month]
},1000); 

getWeatherData();


function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{
        let {latitude, longitude }=success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res=>res.json()).then(data=>{
            console.log(data)
            showWeatherData(data);
        })

    })

}
function showWeatherData(data){
    let {humidity,pressure,sunrise,sunset,wind_speed}=data.current;
    currentWeatherElements.innerHTML=`<div class="weather-item">
    <div>humidity</div>
    <div>${humidity}</div>
</div>
<div class="weather-item">
    <div>pressure</div>
    <div>${pressure}</div>
</div>
<div class="weather-item">
    <div>wind-speed</div>
    <div>${wind_speed}</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
</div>
<div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
</div>`;


let otherDayForecast='';
data.daily.forEach((day,idx)=>{
    if(idx==0)
    {
        currentTemp.innerHTML=`
        <div class="today" id="current-temp">
        <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="w-icon">
         <div class="other">
        <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
        <div class="temp">Night-${day.temp.night}&#176</div>
        <div class="temp">Day-${day.temp.day}&#176</div>
        </div>
    </div>
        `;

    }
    else{
        otherDayForecast +=`
        <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                    
                    <div class="temp">Night-${day.temp.night}&#176</div>
                    <div class="temp">Day-${day.temp.day}&#176</div>

                </div>        `
    }

})
weatherForecast.innerHTML=otherDayForecast;
}



