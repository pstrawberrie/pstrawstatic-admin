// HOLLA!
function swagLog() {
  console.log("==========================");
  console.log("*** pstrawstatic ADMIN ***");
  console.log("==========================");
}

//==========================================
// Data Utils
//==========================================
// Get JSON Data generic func
function getJsonData(path) {
  if (!path) return console.warn("no path passed into getJsonData funcion");
  console.log(`getJsonData from path: ${path}`);

  return new Promise((resolve, reject) => {
    fetch(path)
      .then((response) => {
        if (!response.ok)
          return reject(`Response wasn't ok (${response.status}): ${response}`);
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((err) => {
        console.error(`Fetch error in getData:`);
        return reject(err);
      });
  });
}

// Post JSON Data generic func
function postJsonData(path, data) {
  if (!path || !data)
    return console.warn("no path or data passed into postJsonData funcion");
  console.log(`postJsonData to path: ${path}`);
  console.log("postJsonData data:");
  console.log(data);

  fetch(path, {
    method: "post",
    body: JSON.stringify(data),

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
}

//==========================================
// UI
//==========================================
function newEl(tag) {
  return document.createElement(tag);
}

function createCard(data) {
  if (!data) return;
  const cardEle = newEl("form");
  cardEle.setAttribute("id", data.id);
  cardEle.classList.add("card");

  const dataArr = Object.keys(data);
  dataArr.map((info) => {
    if (info && info !== "id") {
      const infoEl = newEl("input");
      infoEl.setAttribute("type", "text");
      infoEl.classList.add(info);
      infoEl.innerText = data[info];
      cardEle.appendChild(infoEl);
    }
  });

  const editEl = newEl("button");

  const submitEl = newEl("input");
  submitEl.setAttribute("type", "submit");
  submitEl.setAttribute("value", "Update");
  submitEl.style.display = "none";

  console.log(cardEle);
}

//==========================================
// DOM Ready
//==========================================
document.addEventListener("DOMContentLoaded", function () {
  swagLog();

  // test GET
  getJsonData("/?id=01")
    .then((res) => {
      console.log("GET RESPONSE:");
      console.log(res);

      // test create card
      // createCard(res.data.movies[0]);
    })
    .catch((err) => console.error(err));

  // test POST
  // postJsonData("/", {
  //   some: "testdata",
  //   and: ["another", "test", "data"],
  // });
});
