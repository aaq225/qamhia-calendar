/* 
Abdelrahman Qamhia
aaq225
CSE 264
Prog3
*/

const { log } = require("console");
const express = require("express");
const path = require("path");
const sprintf = require('sprintf-js').sprintf;

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public")));

let month = 0;
let year = 0;

function genCalendar(month, year, req, res) {
  function calcLastDayOfMonth(month) {
    let lastDay = 0;
    if (month === 4 || month === 6 || month === 9 || month === 11)
      lastDay = 30;
    else if (month !== 2)
      lastDay = 31;
    else if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
      lastDay = 29;
    else
      lastDay = 28;
    return lastDay;
  }

  function isToday(m, d, y) {
    const today = new Date();
    return m == today.getMonth() + 1 && y == today.getFullYear() && d == today.getDate();
  }

  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const header_string = sprintf("%s %d", monthNames[month], year);

  let lastDay = calcLastDayOfMonth(month);
  let firstDayOfMonthIndex = new Date(year, month - 1, 1).getDay(); // using -1 because months in the date class are 0-11 -- returns 0-6 for the days from sunday to saturday
  console.log("This is firstDayOfWeek ", firstDayOfMonthIndex);

  let calendar_string = '';
  let day = 1;

  let numEmptyCells = firstDayOfMonthIndex;
  let weeks = Math.ceil((lastDay + numEmptyCells) / 7);
  console.log("lastDay of month ", lastDay);
  let totalCells = weeks * 7; // Total cells in the table
  console.log("This is numEmptyCells " + numEmptyCells);
  console.log("This is weeks " + weeks);
  console.log("This is totalCells " + totalCells);

  for (let i = 0; i < totalCells; i++) {
    if (i % 7 === 0) calendar_string += '<tr>';

    if (i >= numEmptyCells && day <= lastDay) {
      let cellClass = isToday(month, day, year) ? 'today' : '';
      calendar_string += `<td class="${cellClass}">${day}</td>`;
      day++;
    } else {
      calendar_string += '<td></td>';
    }

    if (i % 7 === 6) calendar_string += '</tr>';
  }

  res.render("index", {
    header: header_string,
    calendar: calendar_string
  });
}


app.get("/calendar", function (req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  } else {
    let today = new Date();
    month = today.getMonth() + 1;
    year = today.getFullYear();
  }
  genCalendar(month, year, req, res);
});

app.get("/backmonth", function (req, res) {


});

app.get("/forwardmonth", function (req, res) {

});

app.get("/backyear", function (req, res) {
  
});

app.get("/forwardyear", function (req, res) {
  
});

app.listen(3000);

