const date = new Date();
var selectedDate = new Date();
var dd = String(selectedDate.getDate()).padStart(2, "0");
var mm = String(selectedDate.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = selectedDate.getFullYear();
selectedDate = yyyy + "-" + mm + "-" + dd;
const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.getElementById("Year").innerHTML = yyyy;
  //document.querySelector(".date p").innerHTML = selectedDate;

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  if (document.getElementById("Month").innerHTML == "January") {
    yyyy--;
  }
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  if (document.getElementById("Month").innerHTML == "December") {
    yyyy++;
  }
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
document.querySelector(".days").addEventListener("click", function (e) {
  selectedDate = e.target.innerHTML;
  if (selectedDate < 10) {
    selectedDate = "0" + selectedDate;
  }
  month = document.getElementById("Month").innerHTML;
  switch (month) {
    case "December":
      month = 12;
      break;
    case "November":
      month = 11;
      break;
    case "October":
      month = 10;
      break;
    case "September":
      month = 9;
      break;
    case "August":
      month = 8;
      break;
    case "July":
      month = 7;
      break;
    case "June":
      month = 6;
      break;
    case "May":
      month = 5;
      break;
    case "April":
      month = 4;
      break;
    case "March":
      month = 3;
      break;
    case "February":
      month = 2;
      break;
    case "January":
      month = 1;
      break;
  }
  if (e.target.className == "prev-date") {
    month--;
  } else if (e.target.className == "next-date") {
    if (month == 12) {
      yyyy++;
      month = 1;
    } else {
      month++;
    }
  }
  if (month < 10) {
    month = "0" + 1;
  }
  selectedDate = yyyy + "-" + month + "-" + selectedDate;
  if (selectedDate.length < 11) {
    document.getElementById("SelectedDate").value = selectedDate;
    document.getElementById("LogActivity").submit();
    renderCalendar();
  }
});
renderCalendar();
