const timeButtonControls = document.querySelectorAll(".time-tracking-control button");

const changeReportPeriod = async (e) => {
  const target = e.target;
  if (target.classList.contains("active")) return;
  document.querySelector(".time-tracking-control button.active").classList.remove("active");
  target.classList.add("active");
  const data = await loadData();
  updateUI(target.dataset.period, data);
};

const loadData = async () => {
  const response = await fetch("/data.json");
  const data = await response.json();
  return data;
};

const lowerCaseFirstString = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const updateUI = (periodType, datas) => {
  let period = "";
  if (periodType === "daily") {
    period = "Day";
  } else if (periodType === "weekly") {
    period = "Week";
  } else {
    period = "Month";
  }
  for (let data of datas) {
    const dataTarget = data.timeframes[periodType];
    const cardType = data.title
      .split(" ")
      .map((item) => lowerCaseFirstString(item))
      .join("");
    const prevElement = document.querySelector(`.${cardType} .previous`);
    const currentElement = document.querySelector(`.${cardType} .current`);
    setTimeout(() => {
      currentElement.innerText = `${dataTarget.current}hrs`;
      prevElement.innerText = `Last ${period} - ${dataTarget.previous}hrs`;
    }, 500);
  }
};

for (let button of timeButtonControls) {
  button.addEventListener("click", changeReportPeriod);
}

window.addEventListener("load", async () => {
  const data = await loadData();
  const periodType = document.querySelector(".time-tracking-control .active").dataset.period;
  updateUI(periodType, data);
});
