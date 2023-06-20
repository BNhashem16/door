$(document).ready(function () {
  if (localStorage.getItem("username") == "null") {
    let username = prompt("Please enter your username");
    localStorage.setItem("username", username);
  }
  // user type if guest prompt for reason of visit
  if (localStorage.getItem("userType") == "null") {
    let userType = prompt("Please enter your user type");
    localStorage.setItem("userType", userType);
    if (userType == "guest") {
      let reason = prompt("Please enter your reason of visit");
      localStorage.setItem("reason", reason);
    }
  }

  // append data to html
  $("#username").text(localStorage.getItem("username"));
  $("#userType").text(localStorage.getItem("userType"));
  $("#reason").text(localStorage.getItem("reason"));

  checkSwitch();
  getLastLogIndex();
  var textToSend =
    "Door is " + $("#on-off-switch").prop("checked") ? "ON" : "OFF";
  textToSend =
    textToSend + "\n" + "Date: " + new Date().toLocaleString().split(",")[0];
  textToSend =
    textToSend + "\n" + "Time: " + new Date().toLocaleString().split(",")[1];
  // send browser type to telegram
  textToSend = textToSend + "\n" + "Browser: " + navigator.userAgent;

  $.getJSON("https://ipapi.co/json/", function (data) {
    textToSend =
      textToSend +
      "\n" +
      "Location: " +
      data.city +
      ", " +
      data.region +
      ", " +
      data.country_name;
    textToSend = textToSend + "\n" + "IP: " + data.ip;
    textToSend = textToSend + "\n" + "Timezone: " + data.timezone;
    textToSend = textToSend + "\n" + "Latitude: " + data.latitude;
    textToSend = textToSend + "\n" + "Longitude: " + data.longitude;
  });

  textToSend =
    textToSend + "\n" + "Username: " + localStorage.getItem("username");
  textToSend =
    textToSend + "\n" + "User Type: " + localStorage.getItem("userType");
  textToSend = textToSend + "\n" + "Reason: " + localStorage.getItem("reason");

  $("#on-off-switch").click(function () {
    let data = JSON.stringify({
      apikey: "D",
      changedby: "ahmed hashem",
      name: "Door",
      state: $("#on-off-switch").prop("checked") ? "ON" : "OFF",
      timestamp: 123123123232332,
      type: "Motor",
    });

    $.ajax({
      url: "https://microiot.firebaseio.com/users/1BEy97EhEObAeP7U6s4CFM66IPr2/devices/D.json?auth=VSV5R6QkmXOT12rrR6fuawILTpJdM8GjUQhiyShM",
      type: "PUT",
      data: data,
      success: function (data) {
        $.ajax({
          url:
            "https://api.telegram.org/bot" +
            "5895910680:AAE1alrNX2TtQwTInbv0OW1UAcLRdd71wWI" +
            "/sendMessage",
          type: "GET",
          data: {
            chat_id: "-981207113",
            text: textToSend,
          },
          success: function (data) {
            $("#on-off-switch").prop("checked", false);

            console.log(
              "🚀 ~ file: scripts.js ~ line 32 ~ $.ajax ~ data",
              data
            );
          },
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "تم تغيير حالة الباب بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });

        console.log("🚀 ~ return status ==========", data);
        // location.reload();
      },
    });
  });
});

checkSwitch = () => {
  $.ajax({
    url: "https://microiot.firebaseio.com/users/1BEy97EhEObAeP7U6s4CFM66IPr2/devices/D/state.json?auth=VSV5R6QkmXOT12rrR6fuawILTpJdM8GjUQhiyShM",
    type: "GET",
    success: function (data) {
      $("#on-off-switch").prop("checked", false);
    },
  });
};

getLastLogIndex = () => {
  $.ajax({
    url: "https://microiot.firebaseio.com/users/1BEy97EhEObAeP7U6s4CFM66IPr2/devices/D/logs.json?auth=VSV5R6QkmXOT12rrR6fuawILTpJdM8GjUQhiyShM",
    type: "GET",
    success: function (data) {
      if (data == null || data == undefined) return 0;

      return Object.keys(data).length - 1;
    },
  });
};
