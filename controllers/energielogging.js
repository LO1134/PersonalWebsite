const EnergieLogging = require("../models/energielogging");
const Temperature = require("../models/temperaturelogging");

getlatesttempvalue = () => {
  const currentTime = new Date();
  let currentTemperature;
  Temperature.fetch_last_item_from_templogging()
    .then(([rows, fieldData]) => {
      const currentHumidity = rows[0].humidity;
      currentTemperature = rows[0].temperature;
      console.log("current time:", currentTime);
      console.log("current temperature:", currentTemperature);
      console.log("current humidity:", currentHumidity);
      return [currentTemperature, currentHumidity];
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // return[currentTime,currentTemperature];
};

exports.getIndex = (req, res, next) => {
  EnergieLogging.fetchAlls_today()
    .then(([rows, fieldData]) => {
      let i = 0;
      const kWattcosts = 0.2009;
      let varopgewekt = 0;
      let varafgenomen = 0;
      let laagste = 0;
      let hoogste = 0;
      let uur = 0;
      let minute;
      let FirstAfgenomen = rows[0].afgenomen.toFixed(3);
      let FirstOpgewekt = rows[0].opgewekt.toFixed(3);
      let LastOpgewekt = rows[rows.length - 1].opgewekt.toFixed(3);
      let LastAfgenomen = rows[rows.length - 1].afgenomen.toFixed(3);
      const verschilOpgewekt = Math.floor(
        1000 * (LastOpgewekt - FirstOpgewekt)
      );
      const verschilAfgenomen = Math.floor(
        1000 * (LastAfgenomen - FirstAfgenomen)
      );
      const labels = [];
      const opgewekt = [];
      const afgenomen = [];
      const afgenomengem = [];
      const opgewektgem = [];
      let x = 0;
      const diffrnce2 = rows.map(obj => {
        if (i < rows.length - 1) {
          varopgewekt = Math.floor(
            10000 * (rows[i + 1].opgewekt - rows[i].opgewekt)
          );
          varafgenomen = Math.floor(
            10000 * (rows[i + 1].afgenomen - rows[i].afgenomen) * -1
          );
          if (afgenomen[0] != undefined) {
            afgenomengem.push((varafgenomen + afgenomen[x]) / 2);
            opgewektgem.push((varopgewekt + opgewekt[x]) / 2);
            x++;
          } else {
            afgenomengem.push(0); // initiele waarden
            opgewektgem.push(0); // initiele waarden
          }
          if (varopgewekt <= 100 || varopgewekt > 1500) {
            //ruis
            varopgewekt = 0;
          }
          uur = obj.timestamp.getHours();
          minute = obj.timestamp.getMinutes();
          if (minute > 58 || minute < 2) {
            labels.push(uur);
          }
          afgenomen.push(varafgenomen);
          opgewekt.push(varopgewekt);

          if (varopgewekt > hoogste) {
            hoogste = varopgewekt;
          }
          if (varafgenomen < laagste) {
            laagste = varafgenomen;
          }
          obj.afgenomen = varafgenomen;
          obj.opgewekt = varopgewekt;
        }
        i++;
        return obj;
      });
      hoogste += 100;
      laagste -= 100;
      const euroMin = (verschilAfgenomen * kWattcosts / 1000).toFixed(2);
      const euroPlus = (verschilOpgewekt * kWattcosts / 1000).toFixed(2);
      // labels.push(uur + 1);
      labels.push(uur + "," + minute);
      // const grafiekData = new Array(afgenomen, opgewekt);
      afgenomengem[0] = afgenomen[0];
      const grafiekData = new Array(afgenomengem, opgewektgem);
      // console.log("grafiekData", grafiekData);
      Temperature.fetch_last_item_from_templogging().then(
        ([rows, fieldData]) => {
          const currentTime = new Date();
          const currentHumidity = rows[0].humidity;
          const currentTemperature = rows[0].temperature;
          // console.log("current time:",currentTime);
          // console.log("current temperature:",currentTemperature);
          // console.log("current humidity:",currentHumidity);
          res.render("energielogging/index", {
            grafiekdata: grafiekData,
            labels: labels,
            hoogste: hoogste,
            laagste: laagste,
            count: rows.length,
            currentTime: currentTime,
            currentHumidity: currentHumidity,
            currentTemperature: currentTemperature,
            firstafgenomen: FirstAfgenomen,
            lastafgenomen: LastAfgenomen,
            firstopgewekt: FirstOpgewekt,
            lastopgewekt: LastOpgewekt,
            verschilopgewekt: verschilOpgewekt,
            verschilafgenomen: verschilAfgenomen,
            euroMin,
            euroPlus,
            uur,
            minute,
            pageTitle: "EnergieLogging",
            path: "/energielogging",
          });
        }
      );
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDailyOverview = (req, res, next) => {
  EnergieLogging.fetch_Daily_this_month()
    .then(([rows, fieldData]) => {
      let i = 0;
      const kWattcosts = 0.2009;
      let varopgewekt = 0;
      let varafgenomen = 0;
      let laagste = 0;
      let hoogste = 0;
      let day;
      let FirstAfgenomen = rows[0].afgenomen.toFixed(3);
      let FirstOpgewekt = rows[0].opgewekt.toFixed(3);
      let LastOpgewekt = rows[rows.length - 1].opgewekt.toFixed(3);
      let LastAfgenomen = rows[rows.length - 1].afgenomen.toFixed(3);
      const labels = [];
      const opgewekt = [];
      const afgenomen = [];
      const verschilOpgewekt = Math.floor(
        1000 * (LastOpgewekt - FirstOpgewekt)
      );
      const verschilAfgenomen = Math.floor(
        1000 * (LastAfgenomen - FirstAfgenomen)
      );
      const diffrnce2 = rows.map(obj => {
        if (i < rows.length - 1) {
          varopgewekt = Math.floor(rows[i + 1].opgewekt - rows[i].opgewekt);
          varafgenomen = Math.floor(rows[i + 1].afgenomen - rows[i].afgenomen);
          day = obj.time_frame.getDate();
          labels.push(day);
          afgenomen.push(varafgenomen);
          opgewekt.push(varopgewekt);

          if (varopgewekt > hoogste) {
            hoogste = varopgewekt;
          }
          if (varafgenomen < laagste) {
            laagste = varafgenomen;
          }
          obj.afgenomen = varafgenomen;
          obj.opgewekt = varopgewekt;
        }
        i++;
        return obj;
      });
      hoogste += 100;
      laagste -= 100;
      const euroMin = (verschilAfgenomen * kWattcosts / 1000).toFixed(2);
      const euroPlus = (verschilOpgewekt * kWattcosts / 1000).toFixed(2);
      const grafiekData = [];
      let j = -1;
      while (afgenomen[++j]) {
        grafiekData.push([afgenomen[j], opgewekt[j]]);
      }
      res.render("energielogging/dailyoverview", {
        grafiekdata: grafiekData,
        labels: labels,
        hoogste: hoogste,
        laagste: laagste,
        count: rows.length,
        firstafgenomen: FirstAfgenomen,
        lastafgenomen: LastAfgenomen,
        firstopgewekt: FirstOpgewekt,
        lastopgewekt: LastOpgewekt,
        verschilopgewekt: verschilOpgewekt,
        verschilafgenomen: verschilAfgenomen,
        euroMin,
        euroPlus,
        pageTitle: "Daily overview",
        path: "/energie_daily_overview",
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getMonthlyOverview = (req, res, next) => {
  EnergieLogging.fetch_per_Month()
    .then(([rows, fieldData]) => {
      let i = 0;
      Monthofyear = [
        "Jan",
        " ",
        " ",
        " ",
        " ",
        " ",
        "Jul",
        " ",
        " ",
        " ",
        " ",
        " ",
      ];
      const jaardata = [
        { jaar: "2017", afgenomen: 3838, opgewekt: 801 },
        { jaar: "2018", afgenomen: 3388, opgewekt: 1225 },
        { jaar: "2019", afgenomen: 3259, opgewekt: 1393 },
        { jaar: "2020", afgenomen: 3076, opgewekt: 3540 },
        {
          jaar: "2021",
          afgenomen: 0,
          opgewekt: 0,
          beginstandopgewekt: 7789,
          beginstandafgenomen: 16474,
        },
      ];

      const kWattcosts = 0.23205;
      let varopgewekt = 0;
      let varafgenomen = 0;
      let LastiAfgenomen = 0;
      let Lastipgewekt = 0;
      let laagste = 0;
      let hoogste = 0;
      let FirstAfgenomen = rows[0].afgenomen.toFixed(3);
      let FirstOpgewekt = rows[0].opgewekt.toFixed(3);
      let LastOpgewekt = rows[rows.length - 1].opgewekt.toFixed(3);
      let LastAfgenomen = rows[rows.length - 1].afgenomen.toFixed(3);
      const labels = [];
      const opgewekt = [];
      const afgenomen = [];
      const diffrnce2 = rows.map(obj => {
        if (i < rows.length - 1) {
          varopgewekt = Math.floor(rows[i + 1].opgewekt - rows[i].opgewekt);
          varafgenomen = Math.floor(rows[i + 1].afgenomen - rows[i].afgenomen);
          month = obj.time_frame.getMonth();
          labels.push(Monthofyear[month]);
          afgenomen.push(varafgenomen);
          opgewekt.push(varopgewekt);
          if (varopgewekt > hoogste) {
            hoogste = varopgewekt;
          }
          if (varafgenomen < laagste) {
            laagste = varafgenomen;
          }
          obj.afgenomen = varafgenomen;
          obj.opgewekt = varopgewekt;
        }
        i++;
        return obj;
      });

      EnergieLogging.fetch_last_item_from_DailyEnergy().then(
        ([rows, fieldData]) => {
          // this will fail if this is the first day of a new month
          LastiAfgenomen = rows[0].afgenomen.toFixed(3);
          Lastipgewekt = rows[0].opgewekt.toFixed(3);
          LaatsteDatum = rows[0].time_frame;
          LaatsteDatum = LaatsteDatum.toDateString();
          varopgewekt = Math.floor(Lastipgewekt - LastOpgewekt);
          varafgenomen = Math.floor(LastiAfgenomen - LastAfgenomen);
          month = rows[0].time_frame.getMonth();
          afgenomen.push(varafgenomen);
          opgewekt.push(varopgewekt);
          labels.push(Monthofyear[month]);
          hoogste += 100;
          laagste -= 100;
          const verschilOpgewekt = Math.floor(
            1000 * (Lastipgewekt - FirstOpgewekt)
          );
          const verschilAfgenomen = Math.floor(
            1000 * (LastiAfgenomen - FirstAfgenomen)
          );
          const euroMin = (verschilAfgenomen * kWattcosts / 1000).toFixed(2);
          const euroPlus = (verschilOpgewekt * kWattcosts / 1000).toFixed(2);
          const grafiekData = [];
          let j = -1;
          while (afgenomen[++j]) {
            grafiekData.push([afgenomen[j], opgewekt[j]]);
          }
          LastiAfgenomen = (LastiAfgenomen * 1).toFixed(0);
          Lastipgewekt = (Lastipgewekt * 1).toFixed(0);
          varopgewekt = Math.floor(
            Lastipgewekt - jaardata[4].beginstandopgewekt
          );
          varafgenomen = Math.floor(
            LastiAfgenomen - jaardata[4].beginstandafgenomen
          );
          res.render("energielogging/monthlyoverview", {
            grafiekdata: grafiekData,
            labels: labels,
            hoogste: hoogste,
            laagste: laagste,
            LaatsteDatum: LaatsteDatum,
            count: rows.length,
            firstafgenomen: FirstAfgenomen,
            lastafgenomen: LastAfgenomen,
            firstopgewekt: FirstOpgewekt,
            lastopgewekt: LastOpgewekt,
            verschilopgewekt: verschilOpgewekt,
            verschilafgenomen: verschilAfgenomen,
            euroMin,
            euroPlus,
            jaardata,
            LastiAfgenomen,
            Lastipgewekt,
            eindstandafgenomen: varafgenomen,
            eindstandopgewekt: varopgewekt,
            pageTitle: "Daily overview",
            path: "/energie_monthly_overview",
          });
        }
      );
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
