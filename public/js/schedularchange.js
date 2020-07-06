const cancelChangeScheduleButton = document.querySelector(".btn--passive");
const addNewSchedularModel = document.getElementById("add-modal");

const cancelChangeSchedule = () => {
  window.history.back();
};

cancelChangeScheduleButton.addEventListener("click", cancelChangeSchedule);

ng.ready(function() {
  var tp = new ng.TimePicker({
    input: "tijdstip", // the input field id  NoGray.com
    top_hour: 0, // what's the top hour (in the clock face, 0 = midnight)
    use24: 24,
    format: "H:i"
  });
});
