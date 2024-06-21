
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
  const header_string = sprintf("%s %d", monthNames[month], year);  // creating the header to pass to the views file as <%=header%>

  let lastDay = calcLastDayOfMonth(month);
  let firstDayOfMonthIndex = new Date(year, month - 1, 1).getDay(); // using -1 because months in the date class are 0-11 -- returns 0-6 for the days from sunday to saturday
  console.log("This is firstDayOfWeek ", firstDayOfMonthIndex);

  let calendar_string = '';
  let day = 1;

  // determine how many empty cells needed before the first day of the month
  let numEmptyCells = firstDayOfMonthIndex; // the amount of empty cells required is the same amount as the index of the day that starts that month, ie: feb/24 starts on wed, day 4 (index 3), meaning need 3 cells.
  // determine the number of rows needed
  // I know that the total amount of cells should be emptyCells + lastDay, since last day is the last day of the month, meaning, we need that many cells
  // I faced one problem here, since there was months where 31 would be in it's own row, and won't fill the remainder of the row with empty
  // I round up to ensure we have a row for any remaining days.
  let numWeeks = Math.ceil((lastDay + numEmptyCells) / 7); // ie. feb needed 33 cells, but that doesn't add up to 5 complete rows of cells, 33/7 = 4.7, so I needed to round up
  console.log("lastDay of month ", lastDay);
  let totalCells = numWeeks * 7; // total cells needed including empty ones
  console.log("This is numEmptyCells " + numEmptyCells);
  console.log("This is numWeeks " + numWeeks);
  console.log("This is totalCells " + totalCells);

  for (let i = 0; i < totalCells; i++) {
    if (i % 7 === 0) calendar_string += '<tr>'; // every 7 cells, make a new row table element
    // make sure I display the numbers in their correct positions
    // if we are after the empty cells, and less than the last day (because there maybe empty cells after it)
    if (i >= numEmptyCells && day <= lastDay) { 
      let isTodayString = isToday(month, day, year) ? 'today' : ''; // check if the current day is today. I will use that to add a class attribute to the day if it is today so I could change the color in CSS
      calendar_string += sprintf('<td class="%s">%d</td>', isTodayString, day); // add the day number, and append the class attribute, either '' or the 'today' class
      day++;
    } else {
      // adding empty cells if we are before month starts or after it ends
      calendar_string += '<td></td>';
    }

    if (i % 7 === 6) calendar_string += '</tr>'; // closing the row tag after 7 cells have been generated.
  }

  res.render("index", {
    header: header_string,
    calendar: calendar_string // just going to pass <%-calendar%> (found this tag on Piazza as it was escaping the html before I added this tag in index.ejs)
  });
}

// route ie: http://localhost:3000/calendar?month=7&year=2023
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

// I make sure to make the calendar wrap if at january and backmonth is called, we go back to the last year.
app.get("/backmonth", function (req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  }
  month--;
  if (month < 1) {
    month = 12;
    year--;
  }
  genCalendar(month, year, req, res);
});

// I make sure to make the calendar wrap if at december and forwardmonth is called, we go forward to the next year.
app.get("/forwardmonth", function (req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  }
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  genCalendar(month, year, req, res);
});

// go a year back
app.get("/backyear", function (req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  }
  year--;
  genCalendar(month, year, req, res);
});

// go a year forward
app.get("/forwardyear", function (req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  }
  year++;
  genCalendar(month, year, req, res);
});

app.listen(3000); 

