//==========================================
// Util
//==========================================
function swagLog() {
  console.log("%c==========================", "color: #ff0");
  console.log("%c*** pstrawstatic ADMIN ***", "color: #0ff");
  console.log("%c==========================", "color: #ff0");
}

function newEl(tag) {
  return document.createElement(tag);
}

//==========================================
// API Data Utils
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
// Form Data Utils
//==========================================
function getFormJson(formEl) {
  if(formEl && formEl.tagName === 'FORM') {
    const formData = {id: formEl.dataset.id};
    const inputEls = formEl.querySelectorAll('input[type="text"]');

    if(inputEls.length < 1) return null;
    inputEls.forEach(el => {
      const fieldName = el.dataset.field;
      const fieldVal = el.value;
      formData[fieldName] = fieldVal;
    });

    return formData;
  }
}

//==========================================
// UI
//==========================================
// Create a Card
function createCard(data, category) {
  if (!data) return;
  const cardEle = newEl("form");
  cardEle.setAttribute("data-id", data.id);
  cardEle.setAttribute("data-category", category);
  cardEle.classList.add("card");

  // Card (Form)
  const dataArr = Object.keys(data);
  dataArr.map((info) => {
    if (info && info !== "id") {
      const infoParentEl = newEl('div');

      const infoLabelEl = newEl('label');
      infoLabelEl.innerText = info;
      infoParentEl.appendChild(infoLabelEl);

      const infoEl = newEl("input");
      infoEl.setAttribute("type", "text");
      infoEl.setAttribute("data-field", info);
      infoEl.setAttribute('disabled', '');
      infoEl.classList.add(info);
      infoEl.value = data[info];
      infoParentEl.appendChild(infoEl);

      cardEle.appendChild(infoParentEl);
    }
  });

  // Edit Button + Listener
  const editEl = newEl("button");
  editEl.innerText = 'edit';
  
  // Submit Button
  const submitEl = newEl("input");
  submitEl.setAttribute("type", "submit");
  submitEl.setAttribute("value", "update");
  submitEl.style.display = "none";

  // edit event
  editEl.addEventListener('click', (event) => {
    const { target } = event;
    event.preventDefault();

    if(target.parentNode.tagName === 'FORM') {
      const inputEles = target.parentNode.querySelectorAll('input[type="text"]');
      [...inputEles].map(el => el.removeAttribute('disabled'));
      editEl.style.display = 'none';
      submitEl.style.display = 'block';
    }
  });

  // submit event
  submitEl.addEventListener('click', (event) => {
    const { target } = event;
    event.preventDefault();

    if(target.parentNode.tagName === 'FORM') {
      const inputEles = target.parentNode.querySelectorAll('input[type="text"]');
      const postPath = `/?id=${target.parentNode.dataset.id}`
      const formJson = getFormJson(target.parentNode);
      postJsonData(postPath, formJson);
      [...inputEles].map(el => el.setAttribute('disabled', ''));
      submitEl.style.display = 'none';
      editEl.style.display = 'block';
    }
  });

  cardEle.appendChild(editEl);
  cardEle.appendChild(submitEl);

  return cardEle;
}

// Populate cards from category
function populateCards(dataArr, category) {
  if(!dataArr || dataArr.length < 1 || !category) return console.warn('populateCards failed, incorrect arguments passed');
  const resultsInner = document.querySelector('.results__inner');
  resultsInner.innerHTML = '';
  const resultsTitle = document.querySelector('.results__title');
  let eleArr = [];

  dataArr.forEach(item => {
    eleArr.push(createCard(item, category));
  });

  resultsTitle.innerText = category;
  eleArr.forEach(el => resultsInner.appendChild(el));
}

// Card buttons
function setupButtons() {
  const cardButtons = document.querySelectorAll('.populate-cards');
  if(cardButtons.length > 0) {
    cardButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        const { target } = event;
        const category = target.dataset.category;
        if(category) {
          getJsonData(`/?category=${category}`)
          .then((res) => {
            if(res && res.result) populateCards(res.result, category);
          })
          .catch((err) => console.error(err));
        }
      });
    });
  }
}

//==========================================
// DOM Ready
//==========================================
document.addEventListener("DOMContentLoaded", function () {
  swagLog();
  setupButtons();

  //testing
  // postJsonData('/?add=true', {some: 'new item test', category: 'movies'});
});
