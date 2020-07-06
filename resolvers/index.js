const Sonoff = require("../models/sonoff");

module.exports = {
  sonoffs: () => {
    // return [
    //   { title: "Dit is een titel", description: "dit is de description" }
    // ];
    return ["Dit is een titel", "dit is de description"];
    // Sonoff.fetchAll(req.session.user[0].id)
    //   .then(([rows, fieldData]) => {
    //     res.setHeader("Content-Type", "application/json");
    //     console.log("response: ", rows);
    //     return JSON.stringify({
    //       data: rows
    //     });
    //   })
    //   .catch(err => {
    //     const error = new Error(err);
    //     error.httpStatusCode = 500;
    //     return next(error);
    //   });
  }
};

// module.exports = {
//   sonoffs: () => {
//     Sonoff.fetchAll(req.session.user[0].id)
//       .then(([rows, fieldData]) => {
//         res.setHeader("Content-Type", "application/json");
//         console.log("response: ", rows);
//         return JSON.stringify({
//           data: rows
//         });
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   }
// };
