const rowData = document.querySelector(".rowData");
const main_loading = document.querySelector(".main-loading");
const inner_loading = document.querySelector(".inner-loading-screen");
const toggleBtn = document.querySelector(".open-close-icon");
const nav_links = document.querySelector(".menu-links");
const side_bar = document.querySelector(".side-bar");
const searchContainer = document.getElementById("searchContainer");
let submitBtn;
let nameInput;
let emailInput;
let ageInput;
let phoneInput;
let passwordInput;
let repasswordInput;
toggleBtn.addEventListener("click", function (event) {
  togglSideNav();
});

searchByName("");
toggleMainLoader();

function togglSideNav() {
  toggleBtn.classList.toggle("fa-bars");
  toggleBtn.classList.toggle("fa-x");

  side_bar.classList.toggle("left-0");
  side_bar.classList.toggle("left-13");
  searchContainer.innerHTML = "";
}

function toggleMainLoader() {
  main_loading.classList.toggle("d-flex");
  main_loading.classList.toggle("d-none");
}

async function searchByName(term) {
  rowData.innerHTML = "";
  inner_loading.classList.add("d-flex");
  inner_loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  inner_loading.classList.remove("d-block");
  inner_loading.classList.add("d-none");
}

function displayMeals(meals) {
  let divBody = "";
  meals.forEach((item) => {
    divBody += `
        <div class="col-lg-3 col-md-6">
          <div class="img-box position-relative rounded-3" onclick="getMealDetails('${item.idMeal}')">
              <img src="${item.strMealThumb}" class="d-block w-100" alt="...">
              <div class="overlay position-absolute start-0 end-0 bottom-0 top-0">
                  <div class="text-black d-flex align-items-center h-100 fs-3 fw-medium px-2">
                      ${item.strMeal}
                  </div>
              </div>
          </div>
        </div>
      `;
  });
  rowData.innerHTML = divBody;
}

async function showCategories() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let result = await response.json();
  if (result.categories) {
    let divBody = "";
    result.categories.forEach((item) => {
      divBody += `
      
          <div class="col-lg-3 col-md-6">
                  <div class="img-box position-relative rounded-3" onclick="getMeals('c=${
                    item.strCategory
                  }')">
                    <img class="w-100" src="${
                      item.strCategoryThumb
                    }" alt="..." srcset="">
                    <div class="overlay position-absolute start-0 end-0 bottom-0 top-0 text-black text-center p-3">
                        <h3>${item.strCategory}</h3>
                        <p>
                        ${item.strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}
                        </p>
                    </div>
                </div>
          </div>
      `;
    });
    rowData.innerHTML = divBody;
  }
}

async function getMeals(searchText) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${searchText}`
  );
  let result = await response.json();
  result.meals ? displayMeals(result.meals.slice(0, 20)) : displayMeals([]);
}

async function getMealDetails(meal_id) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`
  );
  let result = await response.json();

  if (result.meals && result.meals[0]) {
    drawMealDetails(result.meals[0]);
  }
}

function drawMealDetails(meal) {
  let ingredients = ``;
  for (let i = 1; i <= 10; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  rowData.innerHTML = cartoona;
}

async function showAreas() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let result = await response.json();

  if (result.meals) {
    let Areas = result.meals.slice(0, 20);
    let divBody = "";
    Areas.forEach((item) => {
      divBody += `
          <div class="col-lg-3 col-md-6">
                <div onclick="getMeals('a=${item.strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${item.strArea}</h3>
                </div>
        </div>
      `;
    });
    rowData.innerHTML = divBody;
  }
}

async function showIngredientss() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let result = await response.json();
  if (result.meals) {
    let Ingredients = result.meals.slice(1, 21);
    let divBody = "";
    Ingredients.forEach((item) => {
      divBody += `
        <div class="col-lg-3 col-md-6">
                <div
                 onclick="getMeals('i=${item.strIngredient}')"
                class="rounded-2 text-center cursor-pointer">
                        <img src="${
                          item.strThumb
                        }" class="d-block w-100" alt="...">
                        <h3>${item.strIngredient}</h3>
                        <p>
                        ${item.strDescription.split(" ").slice(0, 20).join(" ")}
                        </p>
                </div>
        </div>
      `;
    });
    rowData.innerHTML = divBody;
  }
}

function showSearchInputs() {
  rowData.innerHTML = "";
  searchContainer.innerHTML = `
    <div class="container w-75" id="searchContainer">
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input oninput="searchByName(this.value)" class="form-control" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input oninput="fLetterByFirstLetter(this.value)" maxlength="1" class="form-control" type="text" placeholder="Search By First Letter">
        </div>
    </div></div>
  `;
}

async function fLetterByFirstLetter(val = "") {
  if (val) {
    rowData.innerHTML = "";
    inner_loading.classList.add("d-flex");
    inner_loading.classList.remove("d-none");
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`
    );
    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    inner_loading.classList.remove("d-block");
    inner_loading.classList.add("d-none");
  }
}

/*concat */

function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");
  nameInput = document.getElementById("nameInput");
  emailInput = document.getElementById("emailInput");
  ageInput = document.getElementById("ageInput");
  phoneInput = document.getElementById("phoneInput");
  passwordInput = document.getElementById("passwordInput");
  repasswordInput = document.getElementById("repasswordInput");

  nameInput.addEventListener("input", function (event) {
    enableSubmitBtn(validateform(event.target));
  });

  emailInput.addEventListener("input", function (event) {
    enableSubmitBtn(validateform(event.target));
  });

  phoneInput.addEventListener("input", function (event) {
    enableSubmitBtn(validateform(event.target));
  });

  ageInput.addEventListener("input", function (event) {
    enableSubmitBtn(validateform(event.target));
  });

  passwordInput.addEventListener("input", function (event) {
    enableSubmitBtn(validateform(event.target));
  });

  repasswordInput.addEventListener("input", function (event) {
    enableSubmitBtn(checkEquality(event.target));
  });
}

function validateform(src, canShow = true) {
  var vaildObj = {
    emailInput:
      /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    nameInput: /^[a-zA-Z ]+$/,
    passwordInput: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
    phoneInput: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    ageInput: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
  };

  if (vaildObj[src.id].test(src.value)) {
    hideErrors(src);
    return true;
  } else {
    canShow ? showErrors(src) : null;
    return false;
  }
}

function hideErrors(src) {
  src.nextElementSibling.classList.add("d-none");
  src.classList.remove("is-invalid");
  src.classList.add("is-valid");
}

function showErrors(src) {
  src.nextElementSibling.classList.remove("d-none");
  src.classList.remove("is-valid");
  src.classList.add("is-invalid");
}

function checkEquality(src, canShow = true) {
  if (src.value == document.getElementById("passwordInput").value) {
    hideErrors(src);
    return true;
  } else {
    canShow ? showErrors(src) : null;
    return false;
  }
}

function enableSubmitBtn(flag) {
  if (
    flag &&
    validateform(nameInput, false) &&
    validateform(emailInput, false) &&
    validateform(ageInput, false) &&
    validateform(phoneInput, false) &&
    validateform(passwordInput, false) &&
    checkEquality(repasswordInput, false)
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}
