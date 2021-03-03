display_chart_button = document.getElementById("display_chart_button");
clear_chart_button = document.getElementById("clear_display_button");
SelectedDate = document.getElementById("selDate");
display_chart = () => {
  grafiekdata = [];
  opgewekt = [];
  afgenomen = [];
  getData();

  async function getData() {
    const graphqlQuery = {
      query: `
        {   
          valuesPerday(seldate: "${SelectedDate.value}") {
            timestamp
            afgenomen
            opgewekt
          }
        }
      `,
    };

    const response = await fetch("http://217.19.24.81:3001/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    const resData = await response.json();
    grafiekdata = resData.data.valuesPerday;
    // console.log("lengte van resData", grafiekdata.length);
    let laagste = 0;
    let hoogste = 0;
    grafiekdata.forEach(element => {
      if (parseInt(element.opgewekt) < 30) {
        opgewekt.push(0);
      } else {
        opgewekt.push(element.opgewekt);
      }
      afgenomen.push(element.afgenomen);
      if (parseInt(element.afgenomen) < parseInt(laagste)) {
        laagste = element.afgenomen;
      }
      if (parseInt(element.opgewekt) > parseInt(hoogste)) {
        hoogste = element.opgewekt;
      }
    });
    hoogste = parseInt(hoogste) + 100;
    laagste = parseInt(laagste) - 100;
    const kaartData = new Array(afgenomen, opgewekt);
    canvas = document.getElementById("Rgraphcvs");
    RGraph.clear(canvas);
    const myChart = new RGraph.Line({
      id: "Rgraphcvs",
      data: kaartData,
      options: {
        textAccessible: true,
        title: "Energie meting vandaag (groen is opgewekt)",
        backgroundColor: "black",
        backgroundGridColor: "#666",
        backgroundGridVlines: false,
        backgroundGridBorder: false,
        backgroundGridAutofitNumvlines: 10,
        shadowColor: "#666",
        ymin: laagste,
        ymax: hoogste,
        linewidth: 2,
        labels: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
        ],
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
        colors: ["red", "green"],
      },
    }).draw();
  }
};

display_chart_button.addEventListener("click", display_chart);
