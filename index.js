let curDate = new Date();
let selectedDate = new Date();
let calFocus = new Date();
let pageYearsPast = curDate.getFullYear() - 5;
let pageYearsFutr = curDate.getFullYear() + 6;

const calContainer = document.querySelector(".cal-container");
const txtDateField = document.querySelector(".datePicker");
const btnDateField = document.querySelector(".datePickerButton");
const btnDateFieldIco = document.querySelector(".datePickerButton i");
const cal = document.querySelector(".calendar");
const headerMonth = document.querySelector(".year h5");
const headerYear = document.querySelector(".year p");
const daysSection = document.querySelector(".days");
const weekdaysSection = document.querySelector(".weekdays");
const monthsSection = document.querySelector(".months");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
let indvMonths = document.querySelector(".months div");
let indvYears = document.querySelector(".days .yeargrp");
let indvDays = document.querySelector(".days div");
let selDate = document.querySelector(".selected");
let yrPgUp = document.querySelector(".selected");
let yrPgDn = document.querySelector(".selected");
let showMonths = false;
let showYears = false;

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

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function documentClick(event) {
  if (!(btnDateField.contains(event.target) || calContainer.contains(event.target))) {
    if (
      (event.target.classList.contains("yeargrp") && cal.contains(indvMonths[0])) ||
      (event.target.classList.contains("monthgrp") && cal.contains(indvDays[0]))
    ) return;
    else {
      cal.classList.remove("show");
      dateChecker();
      btnDateFieldIco.classList.remove("bi-calendar-x");
      btnDateFieldIco.classList.add("bi-calendar2-plus");
    }
  }
}

function toggleCalendar() {
  cal.classList.toggle("show");
  dateChecker();
  if (cal.classList.contains("show")) {
    clearAllSections();
    renderCalendarDays();
    btnDateFieldIco.classList.remove("bi-calendar2-plus");
    btnDateFieldIco.classList.add("bi-calendar-x");
  } 
  else {
    btnDateFieldIco.classList.remove("bi-calendar-x");
    btnDateFieldIco.classList.add("bi-calendar2-plus");
  }
}

function clickPrevious() {
  clearAllSections();
  calFocus.setMonth(calFocus.getMonth() - 1);
  renderCalendarDays();
}

function clickNext() {
  clearAllSections();
  calFocus.setMonth(calFocus.getMonth() + 1);
  renderCalendarDays();
}

function clickHeaderYear() {
  showYears = !showYears;
  clearAllSections();
  if (showYears) renderYears();
  else if (showMonths) renderMonths();
  else renderCalendarDays();
}

function clickHeaderMonth() {
  showMonths = !showMonths;
  clearAllSections();
  if (showMonths) renderMonths();
  else renderCalendarDays();
}

function clickMonth(event) {
  const monthIndex = getMatchMonth(event.target.innerHTML);
  calFocus.setMonth(monthIndex);
  clearAllSections();
  renderCalendarDays();
}

function clearAllSections() {
  weekdaysSection.innerHTML = "";
  daysSection.innerHTML = "";
  monthsSection.innerHTML = "";
}

function getMatchMonth(monthName) {
  for (const [i, month] of months.entries())
    if (month.startsWith(monthName)) return i;
  return calFocus.getMonth();
}

function selectDate(event) {
  if (selDate !== null) selDate.classList.remove("selected");
  event.target.classList.add("selected");
  if (event.target.classList.contains("pmd"))
    selectedDate.setMonth(calFocus.getMonth() - 1);
  else if (event.target.classList.contains("nmd"))
    selectedDate.setMonth(calFocus.getMonth() + 1);
  else selectedDate.setMonth(calFocus.getMonth());
  selectedDate = new Date(
    calFocus.getFullYear(),
    selectedDate.getMonth(),
    Number(event.target.innerHTML)
  );
  selDate = document.querySelector(".selected");
  txtDateField.value = dateFormatter(selectedDate);
}

function dateChecker() {
  const dt = txtDateField.value;
  if (dt === "") {
    calFocus = new Date();
    selectedDate = new Date();
    curDate = new Date();
    return;
  }
  else {
    let fomtedDt = txtDateField.getAttribute("placeholder");
    fomtedDt = fomtedDt.replace(/\\/g,"\\\\");
    fomtedDt = fomtedDt.replace("/","\/");
    fomtedDt = fomtedDt.replace(/ /g,"\\s");
    let chngGrp = 0;
    let datePos = null;
    let monthPos = null;
    let yearPos = null;
    [chngGrp, fomtedDt, datePos] = replaceStatus(fomtedDt, /DD[D]*/, "([0-3]\\d)");
    if (chngGrp === 0) [chngGrp, fomtedDt, datePos] = replaceStatus(fomtedDt, /D/, "([1-9]|[1-2]\\d|[3][0-1])");
    chngGrp = 0;
    [chngGrp, fomtedDt, monthPos] = replaceStatus(
      fomtedDt,
      /MMMM[M]*/i,
      "(\\bJanuary\\b|\\bFebruary\\b|\\bMarch\\b|\\bApril\\b|\\bMay\\b|\\bJune\\b|\\bJuly\\b|\\bAugust\\b|\\bSeptember\\b|\\bOctober\\b|\\bNovember\\b|\\bDecember\\b)"
    );
    if (chngGrp === 0)
      [chngGrp, fomtedDt, monthPos] = replaceStatus(
        fomtedDt,
        /MMM/i,
        "(\\bJan\\b|\\bFeb\\b|\\bMar\\b|\\bApr\\b|\\bMay\\b|\\bJun\\b|\\bJul\\b|\\bAug\\b|\\bSep\\b|\\bOct\\b|\\bNov\\b|\\bDec\\b)"
      );
    if (chngGrp === 0) [chngGrp, fomtedDt, monthPos] = replaceStatus(fomtedDt, /MM/i, "([0][1-9]|[1][0-2])");
    if (chngGrp === 0) [chngGrp, fomtedDt, monthPos] = replaceStatus(fomtedDt, /M/i, "([1][0-2]|\\d)");
    chngGrp = 0;
    [chngGrp, fomtedDt, yearPos] = replaceStatus(fomtedDt, /YYYY[Y]*/i, "(\\d\\d\\d\\d)");
    if (chngGrp === 0) [chngGrp, fomtedDt, yearPos] = replaceStatus(fomtedDt, /YYY/i, "(\\d\\d\\d\\d)");
    if (chngGrp === 0) [chngGrp, fomtedDt, yearPos] = replaceStatus(fomtedDt, /YY/i, "(\\d\\d)");
    if (chngGrp === 0) [chngGrp, fomtedDt, yearPos] = replaceStatus(fomtedDt, /Y/i, "(\\d\\d)");
    const dtRegex = new RegExp(fomtedDt, "i");
    const cont = txtDateField.value;
    if (cont.search(dtRegex) !== 0) txtDateField.value = "";
    else {
      const matchedDateContent = cont.match(dtRegex);
      if (datePos === 0) {
        calFocus.setDate(matchedDateContent[1])
        if (monthPos < yearPos) {
          parseMonthToSet(matchedDateContent[2]);
          parseYearToSet(matchedDateContent[3]);
        }
        else {
          parseYearToSet(matchedDateContent[2]);
          parseMonthToSet(matchedDateContent[3]);
        }
      }
      else if (monthPos === 0) {
        parseMonthToSet(2);
        if (datePos < yearPos) {
          calFocus.setDate(matchedDateContent[2]);
          parseYearToSet(matchedDateContent[3]);
        }  
        else {
          parseYearToSet(matchedDateContent[2]);
          calFocus.setDate(matchedDateContent[3]);
        } 
      }
      else {
        parseYearToSet(matchedDateContent[2]);
        if (datePos < monthPos) {
          calFocus.setDate(matchedDateContent[2]);
          parseMonthToSet(matchedDateContent[3]);
        }
        else {
          parseMonthToSet(matchedDateContent[2]);
          calFocus.setDate(matchedDateContent[3]);
        }
      }
    }
    selectedDate = new Date(
      calFocus.getFullYear(),
      calFocus.getMonth(),
      calFocus.getDate()
    );
  }
}

function parseMonthToSet(mon) {
  if (mon.length <= 2 && parseInt(mon) !== NaN) calFocus.setMonth(Number(mon)-1);
  else if (mon.length === 3) calFocus.setMonth(shortMonths.findIndex((m) => mon.toLowerCase()===m.toLowerCase()));
  else calFocus.setMonth(months.findIndex((m) => mon.toLowerCase()===m.toLowerCase()));
}

function parseYearToSet(yr) {
  const syr = selectedDate.getFullYear();
  if (yr.length === 4) calFocus.setFullYear(yr);
  else if (syr !== calFocus.getFullYear()) calFocus.setFullYear(syr);
}

function dateFormatter(date) {
  const dateFormat = txtDateField.getAttribute("placeholder");
  if (!/^[dDmMyY\/-:\\ ]*$/.test(dateFormat))
    return "Date format incorrect - use only dDmMyY-\/:\\ and space in the placeholder";
  let inputDate = dateFormat;
  let status = 0;
  [status, inputDate] = replaceStatus(
    inputDate,
    /YYYY[Y]*/gi,
    date.getFullYear()
  );
  if (status === 0) [status, inputDate] = replaceStatus(inputDate, /YYY/gi, date.getFullYear());
  if (status === 0) [status, inputDate] = replaceStatus(
    inputDate,
    /YY/gi,
    date.getFullYear().toString().substring(2, 4)
  );
  if (status === 0) [status, inputDate] = replaceStatus(
    inputDate,
    /Y/gi,
    date.getFullYear().toString().substring(2, 4)
  );
  status = 0;
  [status, inputDate] = replaceStatus(
    inputDate,
    /MMMM[M]*/gi,
    months[date.getMonth()]
  );
  if (status === 0)
    [status, inputDate] = replaceStatus(
      inputDate,
      /MMM/gi,
      months[date.getMonth()].substring(0, 3)
    );
  const mon = (date.getMonth() + 1).toString();
  if (status === 0)
    [status, inputDate] = replaceStatus(
      inputDate,
      /MM/gi,
      mon.length === 1 ? "0" + mon : mon
    );
  if (status === 0) [status, inputDate] = replaceStatus(inputDate, /M/gi, mon);
  status = 0;
  const dat = date.getDate().toString();
  [status, inputDate] = replaceStatus(
    inputDate,
    /DD[D]*/gi,
    dat.length === 1 ? "0" + dat : dat
  );
  if (status === 0)
    [status, inputDate] = replaceStatus(inputDate, /D/gi, date.getDate());
  return inputDate;
}

function replaceStatus(text, replaceText, withText) {
  const positionOfText = text.search(replaceText);
  if (positionOfText === null) return null;
  else {
    const replacedText = text.replace(replaceText, withText);
    return text === replacedText ? [0, text, positionOfText] : [1, replacedText, positionOfText];
  }
}

function renderCalendarDays() {
  headerMonth.innerHTML = months[calFocus.getMonth()];
  headerYear.innerHTML = calFocus.getFullYear();
  daysSection.innerHTML = "";
  showMonths = false;
  showYears = false;
  curDate = new Date();
  let lastDateOfCurrMonth = new Date(
    calFocus.getFullYear(),
    calFocus.getMonth() + 1,
    0
  ).getDate();
  let firstDayOfCurrMonth = new Date(
    calFocus.getFullYear(),
    calFocus.getMonth(),
    1
  ).getDay();
  let lastDayOfCurrMonth = new Date(
    calFocus.getFullYear(),
    calFocus.getMonth() + 1,
    0
  ).getDay();
  let lastDateOfPrevMonth = new Date(
    calFocus.getFullYear(),
    calFocus.getMonth(),
    0
  ).getDate();

  renderWeekdays();

  if (firstDayOfCurrMonth === 0) firstDayOfCurrMonth = 7;
  let n = 0;
  for (
    let i = lastDateOfPrevMonth - firstDayOfCurrMonth + 2, j = 1;
    j < firstDayOfCurrMonth;
    i++, j++, n++
  ) {
    const ds = daysSection.appendChild(document.createElement("div"));
    ds.textContent = i;
    if (
      calFocus.getFullYear() === curDate.getFullYear() &&
      calFocus.getMonth() - 1 === curDate.getMonth() &&
      curDate.getDate() === i
    ) {
      ds.classList.add("pmd");
      ds.classList.add("today");
    } 
    else ds.classList.add("pmd");
    if (
      calFocus.getFullYear() === selectedDate.getFullYear() &&
      calFocus.getMonth() - 1 === selectedDate.getMonth() &&
      i === selectedDate.getDate()
    ) {
      ds.classList.add("selected");
      selDate = document.querySelector(".selected");
    }
  }

  for (let i = 1; i <= lastDateOfCurrMonth; i++, n++) {
    const ds = daysSection.appendChild(document.createElement("div"));
    ds.textContent = i;
    if (
      calFocus.getFullYear() === curDate.getFullYear() &&
      calFocus.getMonth() === curDate.getMonth() &&
      curDate.getDate() === i
    ) {
      ds.classList.add("weekday");
      ds.classList.add("today");
    } 
    else ds.classList.add("weekday");
    if (
      calFocus.getFullYear() === selectedDate.getFullYear() &&
      calFocus.getMonth() === selectedDate.getMonth() &&
      i === selectedDate.getDate()
    ) {
      ds.classList.add("selected");
      selDate = document.querySelector(".selected");
    }
  }

  for (let i = 1; i < 7 - lastDayOfCurrMonth + 1 + 7 && n < 42; i++, n++) {
    const ds = daysSection.appendChild(document.createElement("div"));
    ds.textContent = i;
    if (
      calFocus.getFullYear() === curDate.getFullYear() &&
      calFocus.getMonth() + 1 === curDate.getMonth() &&
      curDate.getDate() === i
    ) {
      ds.classList.add("nmd");
      ds.classList.add("today");
    } 
    else ds.classList.add("nmd");
    if (
      calFocus.getFullYear() === selectedDate.getFullYear() &&
      calFocus.getMonth() + 1 === selectedDate.getMonth() &&
      i === selectedDate.getDate()
    ) {
      ds.classList.add("selected");
      selDate = document.querySelector(".selected");
    }
  }
  const focusDays = document.querySelectorAll(".days div");
  focusDays.forEach((focusDay) =>
    focusDay.addEventListener("click", selectDate)
  );
  indvDays = document.querySelectorAll(".days div");
}

function renderMonths() {
  showYears = false;
  months.forEach((month) => {
    const mon = monthsSection.appendChild(document.createElement("div"));
    mon.classList.add("monthgrp");
    mon.textContent = month.substring(0, 3);
    mon.addEventListener("click", clickMonth);
  });
  indvMonths = document.querySelectorAll(".months div");
}

function renderYears() {
  showMonths = false;
  const iup = weekdaysSection.appendChild(document.createElement("i"));
  iup.classList.add("bi");
  iup.classList.add("bi-caret-up-fill");
  iup.addEventListener("click", clickYearPgUp);
  const idn = weekdaysSection.appendChild(document.createElement("i"));
  idn.classList.add("bi");
  idn.classList.add("bi-caret-down-fill");
  idn.addEventListener("click", clickYearPgDn);
  yearsPgUpDnRender();
  indvDays = document.querySelectorAll(".days .yearsgrp");
}

function yearsPgUpDnRender() {
  for (let year = pageYearsPast; year <= pageYearsFutr; year++) {
    const yrPg = daysSection.appendChild(document.createElement("div"));
    yrPg.classList.add("yeargrp");
    if (curDate.getFullYear() === year) yrPg.classList.add("curyear");
    yrPg.textContent = year;
    yrPg.addEventListener("click", selectYear);
  }
}

function selectYear(event) {
  const yr = event.target.textContent;
  calFocus.setFullYear(yr);
  showMonths = true;
  showYears = false;
  headerYear.innerHTML = yr;
  clearAllSections();
  renderMonths();
}

function clickYearPgUp() {
  daysSection.innerHTML = "";
  pageYearsFutr = pageYearsPast - 1;
  pageYearsPast = pageYearsFutr - 11;
  yearsPgUpDnRender();
}

function clickYearPgDn() {
  daysSection.innerHTML = "";
  pageYearsPast = pageYearsFutr + 1;
  pageYearsFutr = pageYearsFutr + 12;
  yearsPgUpDnRender();
}

function renderWeekdays() {
  showMonths = false;
  showYears = false;
  weekdays.forEach((wkd, i) => {
    const wkds = weekdaysSection.appendChild(document.createElement("div"));
    wkds.textContent = wkd.substring(0, 3);
    if (i < 5) wkds.classList.add("weekday");
    else wkds.classList.add("weekend");
  });
}

prevButton.addEventListener("click", clickPrevious);
nextButton.addEventListener("click", clickNext);
headerMonth.addEventListener("click", clickHeaderMonth);
headerYear.addEventListener("click", clickHeaderYear);
btnDateField.addEventListener("click", toggleCalendar);
txtDateField.addEventListener("click", toggleCalendar);
txtDateField.addEventListener("focusout", dateChecker);
document.addEventListener("click", documentClick);

renderCalendarDays();