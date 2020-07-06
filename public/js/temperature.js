timerbutton = document.getElementById("timer");
timerStopButton = document.getElementById("timer_stop");
changeLastNewsButton = document.getElementById("changeLastNewsButton");
display_chart_button = document.getElementById("display_chart_button");

headerToBeChanged = document.getElementById("ParagraaftobeChanged");
paragraafNews = document.getElementById("last_News_item");
timerData = document.getElementById("timer_data");
currentTemp = document.getElementById("CurrentTemp");
currentHumidity = document.getElementById("CurrentHum");

display_chart = () => {
  console.log("display chart pressed");
  grafiekdata = [];
  temperature = [];
  humidity = [];
  kaartData = [];
  labels = [];

  getData();

  async function getData() {
    const graphqlQuery = {
      query: `
        {   
          temperatureData {
            timestamp
            temperature
            humidity
          }
        }
      `,
    };

    const response = await fetch("http://217.19.24.81:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    const resData = await response.json();
    grafiekdata = resData.data.temperatureData;
    let laagsteTemp = 0;
    let hoogsteTemp = 0;
    let laagsteHumidity = 0;
    let hoogsteHumidity = 0;
    let res = 0;
    let tempie = 0.7;
    let pageTemp = "";
    let humpie = 0.7;
    let pageHum = "";
    grafiekdata.forEach(element => {
      res = element.timestamp.substring(0, element.timestamp.indexOf(":"));
      if (!labels.includes(res)) {
        labels.push(res);
      }
      temperature.push(element.temperature);
      tempie = element.temperature;
      humpie = element.humidity;
      humidity.push(element.humidity);
      if (parseInt(element.temperature) < parseInt(laagsteTemp)) {
        laagsteTemp = element.temperature;
      }
      if (parseInt(element.temperature) > parseInt(hoogsteTemp)) {
        hoogsteTemp = element.temperature;
      }
      if (parseInt(element.humidity) < parseInt(laagsteHumidity)) {
        laagsteHumidity = element.humidity;
      }
      if (parseInt(element.humidity) > parseInt(hoogsteHumidity)) {
        hoogsteHumidity = element.humidity;
      }
    });

    hoogsteHumidity = parseInt(hoogsteHumidity) + 1;
    hoogsteTemp = parseInt(hoogsteTemp) + 1;
    laagsteTemp = 16;
    // laagsteTemp = parseInt(laagsteTemp) - 1;
    laagsteHumidity = 30;
    // laagsteHumidity = 38;
    // const kaartData = new Array(temperature, humidity);
    const Humidity = new Array(humidity);
    const Temperature = new Array(temperature);

    const myChart = new RGraph.Line({
      id: "Rgraphcvs_temperature",
      data: Temperature,
      options: {
        textAccessible: true,
        title: "Temperature meting vandaag ",
        backgroundColor: "black",
        backgroundGridColor: "#666",
        backgroundGridVlines: false,
        backgroundGridBorder: false,
        backgroundGridAutofitNumvlines: 10,
        shadowColor: "#666",
        ymin: laagsteTemp,
        ymax: hoogsteTemp,
        linewidth: 2,
        labels: labels,
        ylabelsCount: 3,
        numyticks: 3,
        backgroundGridAutofitNumhlines: 3,
        gutterBottom: 35,
        gutterLeft: 35,
        gutterRight: 35,
        shadow: false,
        textSize: 14,
        numxticks: 6,
        numyticks: 3,
        linewidth: 2,
        textAccessible: true,
        hmargin: 3,
        outofbounds: true,
        colors: ["red"],
      },
    }).draw();
    if (tempie.length > 4) {
      pageTemp = tempie.substring(0, 4);
    } else {
      pageTemp = tempie;
    }
    currentTemp.innerHTML = `Laatste stand: ${pageTemp} C `;
    if (humpie.length > 4) {
      pageHum = humpie.substring(0, 4);
    } else {
      pageHum = humpie;
    }
    currentHumidity.innerHTML = `Laatste stand: ${pageHum} % `;
    const myChart2 = new RGraph.Line({
      id: "Rgraphcvs_humidity",
      data: Humidity,
      options: {
        textAccessible: true,
        title: "Humidity",
        backgroundColor: "black",
        backgroundGridColor: "#666",
        backgroundGridVlines: false,
        backgroundGridBorder: false,
        backgroundGridAutofitNumvlines: 10,
        shadowColor: "#666",
        ymin: laagsteHumidity,
        ymax: hoogsteHumidity,
        linewidth: 2,
        labels: labels,
        ylabelsCount: 3,
        numyticks: 3,
        backgroundGridAutofitNumhlines: 3,
        gutterBottom: 35,
        gutterLeft: 35,
        gutterRight: 35,
        shadow: false,
        textSize: 14,
        numxticks: 6,
        numyticks: 3,
        linewidth: 2,
        textAccessible: true,
        hmargin: 3,
        outofbounds: true,
        colors: ["green"],
      },
    }).draw();
  }
};

display_chart_button.addEventListener("click", display_chart);

document.getElementById("display_chart_button").click();

timerbutton.addEventListener("click", () => {
  timerData.className = "visible";
  display_chart();
  const timerValue = setInterval(myTimer, 1000);
  let d = new Date();
  let x = 0;
  let y = 0;
  function myTimer() {
    var d = new Date();
    // console.log("tijd:", d.toLocaleTimeString(), "x=", x);
    if (x > 229) {
      display_chart();
      x = 0;
    } else {
      x++;
      y = 229 - x;
    }

    timerData.innerHTML =
      // "timer button activated   " +
      // d.toLocaleTimeString() +
      "Time for new refresh: " + y;
  }
});

timerStopButton.addEventListener("click", () => {
  timerData.className = "invisible";
});
