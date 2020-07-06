const startAddScheduleButton = document.getElementById("addAnEventModalButton");
const addNewSchedularModel = document.getElementById("add-modal");
const backdrope = document.getElementById("backdrop");
const cancelAddScheduleButton = addNewSchedularModel.querySelector(
  ".btn--passive"
);

const toggleBackdrop = () => {
  backdrope.classList.toggle("visible");
};

const cancelAddSchedule = () => {
  toggleScheduleModel();
};

const toggleScheduleModel = () => {
  console.log("startAddScheduleButton clicked");
  addNewSchedularModel.classList.toggle("visible");
  toggleBackdrop();
};

startAddScheduleButton.addEventListener("click", toggleScheduleModel);
cancelAddScheduleButton.addEventListener("click", cancelAddSchedule);
backdrope.addEventListener("click", cancelAddSchedule);

const openAreaToAddAnEvent = () => {
  var btn = document.getElementById("addAnEvent");
  if (btn.value == "Click To Close") {
    btn.value = "Click To Add an Event";
    btn.innerHTML = "Click To Add an Event";
  } else {
    btn.value = "Click To Close";
    btn.innerHTML = "Click To Close";
    btn.class = "btn btn-danger";
  }
  var x = document.getElementById("AddAnEvent");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

const changeStatus = btn => {
  console.log("clicked");
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const id = btn.parentNode.querySelector("[name=id]").value;
  const previousStatus = btn.parentNode.querySelector("[name=previousStatus]")
    .value;
  console.log("previousStatus: ", previousStatus);
  console.log("csrf: ", csrf);
  console.log("id: ", id);
  fetch("/sonoff_schedule_status_change/" + id, {
    method: "POST",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      if (data.status == 0) {
        console.log("Status is 0");
        // btn.innerHTML = "Activate";
      } else {
        console.log("Status is 1");
        // btn.innerHTML = "De-activate";
      }
    })
    .catch(err => {
      console.log(err);
    });
};

ng.ready(function() {
  var tp = new ng.TimePicker({
    input: "tijdstip", // the input field id  NoGray.com
    top_hour: 0, // what's the top hour (in the clock face, 0 = midnight)
    use24: 24,
    format: "H:i"
  });
});
