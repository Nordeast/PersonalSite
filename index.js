$(document).ready(function () {
    var $introduction = $('#introduction');
    var dateStarted = new Date(2016, 2, 3);
    var currentDate = new Date();
    var timeBetween = currentDate.getTime() - dateStarted.getTime();
    var yearsBetween = round(timeBetween / (1000 * 3600 * 24) / 365, 2);
    $introduction.text($introduction.text().replace('{{years}}', yearsBetween));

    var centralTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago"
    });

    var weatherData = {
        temp: 80, // in Fahrenheit
        type: 'clear sky', // The current weather description
        time: centralTime
    };

    var data = {
        q: 'minneapolis,mn,us',
        appid: 'f47a5c7c8a82c3c6e962384c64ab9119'
    };

    $.get('https://api.openweathermap.org/data/2.5/weather', data, // url
        function (data, status, jqXHR) { // success
            weatherData.temp = kelvinToFahrenheit(data.main.temp);
            weatherData.type = data.weather[0].main;
        }).done(function () {
        updateWeatherHtml(weatherData);
    });

    animate();
});

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function animate() {
    var playground = document.querySelector('#playground');
    var $playground = $(playground);
    var frame = {
        x: $playground.position().left,
        y: $playground.position().top,
        width: $playground.width(),
        height: $playground.height()
    };

    playground.appendChild(svg('skyline', 'svgs/skyline.svg'));

    for (let i = 0; i < 300; i++) {
        raindrop(playground, frame);
    };

    //playground.appendChild(svg('clouds', 'svgs/clouds.svg'));
}

function raindrop(playground, frame) {
    let durantionMin = 2000;
    let durationVariance = 1000;
    let delayMin = 5000;
    let heightMin = 6;
    let heightVariance = 4;
    let rainLeftTravelDistance = 100;
    let blue1 = '#6bb9f0';
    let blue2 = '#59abe3';
    let blue3 = '#1e8bc3';
    let blue4 = '#2574a9';

    let random = Math.random();
    let duration = Math.round(random * durationVariance) + durantionMin;
    let height = Math.round((random * heightVariance)) + heightMin;
    let deplay = Math.round(Math.random() * delayMin);
    let left = Math.round(Math.random() * frame.width) + rainLeftTravelDistance;
    var color = blue1;
    if (random > 0.75) {
        color = blue4;
    } else if (random > 0.5) {
        color = blue3;
    } else if (random > 0.25) {
        color = blue2;
    }

    let raindropContainer = document.createElement('div');
    raindropContainer.style.left = left;

    raindropContainer.classList.add('raindrop-container');

    let raindrop = document.createElement('div');
    raindrop.style.height = height + 'px';
    raindrop.style.backgroundColor = color;
    raindrop.classList.add('raindrop');
    raindropContainer.appendChild(raindrop);

    anime({
        targets: raindropContainer,
        translateX: [0, -rainLeftTravelDistance],
        translateY: [0, frame.height],
        duration: duration,
        delay: deplay,
        endDelay: 0,
        direction: 'repeat',
        loop: true,
        easing: 'linear'
    });

    playground.appendChild(raindropContainer);
}

function svg(id, src) {
    var svg = document.createElement("img");
    svg.id = id;
    svg.src = src;
    return svg;
}

function kelvinToFahrenheit(kelvin) {
    return Math.round(kelvin * 9 / 5 - 459.67);
}

function updateWeatherHtml(weatherData) {
    $('#time').text(weatherData.time);
    $('#type').text(weatherData.type);
    $('#temp').text(weatherData.temp + '\u{2109}');
}