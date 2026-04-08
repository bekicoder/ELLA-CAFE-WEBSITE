let isloged_in;
const humbergur = document.querySelector(".humbergur");
const drinksContainer = document.querySelector("#drinksContainer");
const drinkCardsContainer = document.querySelector(".drinkCardsContainer");
const offcanvas_control = document.getElementById("offcanvas-control");
const popup = document.querySelector(".popup");

const confirmFoodName = document.getElementById("confirmFoodName");
const confirmFoodDescription = document.getElementById(
  "confirmFoodDescription",
);
const confirmFoodQty = document.getElementById("confirmFoodQty");
const confirmFoodPrice = document.getElementById("confirmFoodPrice");
const confirmFoodTotal = document.getElementById("confirmFoodTotal");
const selectedDrinkCount = document.querySelector(".selectedDrinkCount");
const totalDrinkCount = document.querySelector(".totalDrinkCount");
const drinkCount = document.getElementById("drinkCount");
const confirmDrinksList = document.getElementById("confirmDrinksList");
const noDrinkMessage = document.getElementById("noDrinkMessage");

const confirmTime = document.getElementById("confirmTime");
const confirmFoodQtyDisplay = document.getElementById("confirmFoodQtyDisplay");
const confirmTotalDrinkQty = document.getElementById("confirmTotalDrinkQty");

const summaryFoodSubtotal = document.getElementById("summaryFoodSubtotal");
const summaryDrinkSubtotal = document.getElementById("summaryDrinkSubtotal");
const confirmTotalPrice = document.getElementById("confirmTotalPrice");

const cancelConfirm = document.getElementById("cancel_confirm");
const submitOrder = document.getElementById("submit_order");

let selectedDrinks = [];
const drinksData = [
  {
    id: 1,
    name: "Fresh Mint Lemonade",
    description: "Fresh mint leaves, lemon juice, honey, and sparkling water",
    price: 4.5,
    imageURI:
      "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    name: "Strawberry Banana Smoothie",
    description:
      "Fresh strawberries, ripe banana, Greek yogurt, and almond milk",
    price: 6.0,
    imageURI:
      "https://images.pexels.com/photos/5946649/pexels-photo-5946649.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    name: "Iced Caramel Latte",
    description:
      "Double espresso, caramel syrup, oat milk, topped with whipped cream",
    price: 5.5,
    imageURI:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    name: "Fresh Orange Juice",
    description:
      "100% freshly squeezed oranges, no added sugar, served chilled",
    price: 4.5,
    imageURI:
      "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    name: "Mango Tango Smoothie",
    description:
      "Sweet mango, pineapple chunks, coconut milk, and a hint of lime",
    price: 5.5,
    imageURI:
      "https://images.pexels.com/photos/109275/pexels-photo-109275.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    name: "Sparkling Water with Lime",
    description: "Crisp sparkling water, fresh lime slices, served over ice",
    price: 2.5,
    imageURI:
      "https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 7,
    name: "Matcha Green Tea Latte",
    description: "Premium matcha powder, steamed oat milk, lightly sweetened",
    price: 5.0,
    imageURI:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    name: "Watermelon Cooler",
    description:
      "Fresh watermelon juice, mint leaves, lime, and a pinch of sea salt",
    price: 4.0,
    imageURI:
      "https://images.pexels.com/photos/5946649/pexels-photo-5946649.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 9,
    name: "Classic Coca Cola",
    description: "Ice-cold Coca Cola served with fresh lemon wedge",
    price: 2.5,
    imageURI:
      "https://images.pexels.com/photos/50593/coca-cola-coca-glass-beverage-50593.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 10,
    name: "Pink Dragon Fruit Refresher",
    description:
      "Dragon fruit puree, coconut water, strawberry pieces, and basil seeds",
    price: 6.5,
    imageURI:
      "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];
const daysOfWeek = ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሑድ"];
let day;

window.addEventListener("load", async () => {
  isloged_in = false;
  const response = await fetch("/isloged_in");
  const isloged_in_status = await response.json();
  if (
    isloged_in_status.message !== "no session id" &&
    isloged_in_status.message !== "not loged in"
  ) {
    document.querySelectorAll(".signUp_link").forEach((link) => {
      link.classList.add("hidden");
    });
    document.querySelector('a[href="/logout"]').classList.remove("hidden");
    isloged_in = true;
  } else {
    document.querySelectorAll(".signUp_link").forEach((link) => {
      link.classList.remove("hidden");
      isloged_in = false;
    });
  }
});

humbergur.addEventListener("blur", () => {
  setTimeout(() => {
    offcanvas_control.checked = false;
  }, 500);
});
function openDrinkContainer() {
  drinksContainer.classList.remove("hidden");
  popup.classList.add("hidden");
}
function closeDrinkContainer() {
  drinksContainer.classList.add("hidden");
  popup.classList.remove("hidden");
}
function handleSelectedDrinks() {
  console.log(selectedDrinks, "this is the selected ");
  if (selectedDrinks.length > 0) {
    noDrinkMessage.classList.add("hidden");

    confirmDrinksList.innerHTML = "";
    selectedDrinks.map((sdrink) => {
      const drinkCard = document.createElement("div");

      drinkCard.classList.add = "drink-item";
      drinkCard.innerHTML = `<div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <i
                        class="fas fa-glass-martini-alt text-green-500 text-sm"
                      ></i>
                      <span class="font-semibold text-gray-800 drink-name"
                        >${sdrink.name}</span
                      >
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Cold beverage</p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm text-gray-500 drink-qty-text"
                      >${sdrink.amount} * ${sdrink.price} <span class="text-xs text-gray-400 ml-1">Birr</span></span
                    >
                    <div class="font-bold text-green-600 drink-total">
                      ${sdrink.amount > 0 ? sdrink.amount * sdrink.price : sdrink.price} <span class="text-xs text-gray-400 ml-1">Birr</span>
                    </div>
                  </div>
                </div>`;
      confirmDrinksList.append(drinkCard);
      console.log(sdrink, "this is the sdrink");
    });
    confirmDrinksList;
  } else {
    noDrinkMessage.classList.remove("hidden");
  }
}
const order_btn = document.getElementById("order_btn");
const orderInfoInput = document.querySelector('input[name="info"]');
const timeShow = document.querySelector(".selectedTime");
const houre_btn = document.querySelectorAll(".houre_btn");
const minute_btn = document.querySelectorAll(".minute_btn");
let choosenPreferences = {};
const houreContainer = document.querySelector(".houreContainer");
const minuteContainer = document.querySelector(".minuteContainer");
const night_btn = document.querySelector(".night_btn");
const day_btn = document.querySelector(".day_btn");
function getCenteredItem(container) {
  const items = container.children;
  const containerRect = container.getBoundingClientRect();
  const centerY = containerRect.top + containerRect.height / 2; // relative to viewport

  let closest = null;
  let closestDistance = Infinity;

  for (let item of items) {
    const rect = item.getBoundingClientRect();
    const itemCenterY = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenterY - centerY);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = item;
    }
  }

  return closest;
}

function getShiftedHour(date = new Date(), shiftHour = 12) {
  let shiftedHour = (date.getHours() - shiftHour + 24) % 24;

  return shiftedHour;
}

function getCurrentHour() {
  let now = new Date();
  let currentHour = getShiftedHour();
  let currentMinute = now.getMinutes();
  let currentPeriode = currentHour < 12 || currentHour === 12 ? "PM" : "AM";

  //== Upadte choosenPreferences ====

  return { hour: currentHour, minute: currentMinute, period: currentPeriode };
}

async function getEthiopianTime() {
  let requested = "timeapi";
  let res = await fetch(
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Africa/Addis_Ababa",
  );
  if (!res.ok) {
    console.error("API request failed with status:", res.status);
    res = await fetch(
      "https://worldtimeapi.org/api/timezone/Africa/Addis_Ababa",
    );
    res = "worldtimeapi";
  }
  if (res.ok) {
    const data = await res.json();
    const date = new Date(
      requested == "timeapi" ? data.dateTime : data.datetime,
    );

    const hour24 = date.getHours();
    const minute = date.getMinutes();
    let ethiopianHour = hour24 - 6;
    if (ethiopianHour <= 0) ethiopianHour += 12;
    if (ethiopianHour > 12) ethiopianHour -= 12;
    const period = hour24 >= 6 && hour24 < 18 ? "day" : "night";

    console.log(
      "Ethiopian hour:",
      ethiopianHour,
      {
        hour: ethiopianHour,
        minute: minute,
        period: period,
      },
      requested,
    );

    return {
      status: "ok",
      hour: ethiopianHour,
      minute: minute,
      period: period,
    };
  } else {
    return { status: "API request failed" };
  }
}
async function getEthiopianDay() {
  const res = await fetch("https://api.ethioall.com/date/api");
  if (!res.ok) console.log("failed to fetch api.ethioall.com");
  const { day_english,numeric_date } = await res.json();
  choosenPreferences.day = day_english;
  choosenPreferences.date = numeric_date
}
let time;
choosenPreferences.period = time?.period;
let amountShow = document.getElementById("amount");
let amount = 1;
let total_price;
let excutingCentered = false;

async function manageCenterd() {
  if (!excutingCentered) {
    excutingCentered = true;
    if (choosenPreferences?.period === "day") {
      day_btn.classList.add("bg-amber-500", "text-white", "border-none");
      night_btn.classList.remove("bg-amber-500", "text-white", "border-none");
    } else {
      night_btn.classList.add("bg-amber-500", "text-white", "border-none");
      day_btn.classList.remove("bg-amber-500", "text-white", "border-none");
    }

    let centerdHour = getCenteredItem(houreContainer);
    let centerdMinute = getCenteredItem(minuteContainer);
    houre_btn.forEach((btn) => {
      btn.classList.remove("bg-amber-500");
      btn.classList.remove("text-white");
    });
    centerdHour.classList.add("bg-amber-500");
    centerdHour.classList.add("text-white");

    minute_btn.forEach((btn) => {
      btn.classList.remove("bg-amber-500", "text-white");
    });
    centerdMinute.classList.add("bg-amber-500", "text-white");
    let choosenHour = parseInt(centerdHour.textContent);
    choosenPreferences.hour = choosenHour;
    // == Accesing day hour in day ==
    if (time?.period === "day" && choosenPreferences?.period === "day") {
      // ====== remove unavailable Hour ====
      houre_btn.forEach((btn) => {
        if (
          btn.dataset.period == "night" ||
          parseInt(btn.dataset.index) < time.hour
        ) {
          btn.classList.add("hidden");
        } else {
          btn.classList.remove("hidden");
        }
      });
      // ====== remove unavailable minute ====
      if (parseInt(centerdHour.dataset.index) === time.hour) {
        minute_btn.forEach((mbtn) => {
          if (parseInt(mbtn.textContent) < time.minute) {
            mbtn.classList.add("hidden");
          } else {
            mbtn.classList.remove("hidden");
          }
        });
      } else if (parseInt(centerdHour.dataset.index) > time.hour) {
        minute_btn.forEach((mbtn) => {
          mbtn.classList.remove("hidden");
        });
      }
    }
    // == Accesing day hour in night ==
    else if (time?.period === "night" && choosenPreferences?.period === "day") {
      houre_btn.forEach((btn) => {
        if (btn.dataset.period === "night") {
          btn.classList.add("hidden");
        }
        if (btn.dataset.period === "day") {
          btn.classList.remove("hidden");
          minute_btn.forEach((mbtn) => {
            mbtn.classList.remove("hidden");
          });
        }
      });
    }
    // == Accesing Night hour in Night ==
    else if (
      time?.period === "night" &&
      choosenPreferences?.period === "night"
    ) {
      // ====== remove unavailable Hour ====
      houre_btn.forEach((btn) => {
        if (
          btn.dataset.period === "day" ||
          parseInt(btn.dataset.index) < time.hour
        ) {
          btn.classList.add("hidden");
        } else {
          btn.classList.remove("hidden");
        }
      });

      if (time.hour > 15) {
        houre_btn.forEach((btn) => {
          if (btn.dataset.period === "day") {
            btn.classList.add("hidden");
          }
          if (btn.dataset.period === "night") {
            btn.classList.remove("hidden");
          }
        });
      }
      // ====== remove unavailable minute ====
      if (parseInt(centerdHour.dataset.index) === time.hour) {
        minute_btn.forEach((mbtn) => {
          if (parseInt(mbtn.textContent) < time.minute) {
            mbtn.classList.add("hidden");
          } else {
            mbtn.classList.remove("hidden");
          }
        });
      } else if (parseInt(centerdHour.dataset.index) > time.hour) {
        minute_btn.forEach((mbtn) => {
          mbtn.classList.remove("hidden");
        });
      }
      if (Number(centerdHour.dataset.index) == 15) {
        minute_btn.forEach((mbtn) => {
          mbtn.classList.remove("hidden");
        });
        minute_btn.forEach((mbtn) => {
          if (parseInt(mbtn.textContent) > 1) {
            mbtn.classList.add("hidden");
          }
        });
      }
    }
    // == Accesing Night hour in day ==
    else if (time?.period === "day" && choosenPreferences?.period === "night") {
      houre_btn.forEach((btn) => {
        if (btn.dataset.period === "day") {
          btn.classList.add("hidden");
        }
        if (btn.dataset.period === "night") {
          btn.classList.remove("hidden");
          minute_btn.forEach((mbtn) => {
            mbtn.classList.remove("hidden");
          });
        }
      });
    }
    centerdHour = getCenteredItem(houreContainer);
    centerdMinute = getCenteredItem(minuteContainer);
    choosenPreferences.food_id = popup.dataset.id;
    choosenPreferences.totalFoodQty = amount;
    choosenPreferences.total_price = total_price;
    choosenPreferences.minute = parseInt(centerdMinute.textContent);
    orderInfoInput.value = JSON.stringify(choosenPreferences);
    excutingCentered = false;
  }
}

const confirm_cost = document.querySelector(".confirm_cost");
const confirm_time = document.querySelector(".confirm_time");
const confirm_amount = document.querySelector(".confirm_amount");
function showSelectedTime() {
  let selectedPeriod = choosenPreferences?.period == "day" ? "ቀን" : "ማታ";
  timeShow.textContent = `Time: ${choosenPreferences.hour}:${choosenPreferences.minute} ${selectedPeriod} `;
  confirmTime.textContent = `${choosenPreferences.day} ${selectedPeriod} ${choosenPreferences.hour.toString().padStart(2, "0")}:${choosenPreferences.minute.toString().padStart(2, "0")} `;
}

houreContainer.addEventListener("scroll", () => {
  manageCenterd();
  manageCenterd();
  showSelectedTime();
});
minuteContainer.addEventListener("scroll", () => {
  manageCenterd();
  manageCenterd();
  showSelectedTime();
});

night_btn.addEventListener("click", function () {
  choosenPreferences.period = "night";
  manageCenterd();
  manageCenterd();
  showSelectedTime();
  // ============ //
  day_btn.classList.remove("bg-amber-500", "text-white", "border-none");
  this.classList.add("bg-amber-500", "text-white", "border-none");
});

day_btn.addEventListener("click", function () {
  choosenPreferences.period = "day";
  manageCenterd();
  manageCenterd();
  showSelectedTime();

  // =============== //

  night_btn.classList.remove("bg-amber-500", "text-white", "border-none");
  this.classList.add("bg-amber-500", "text-white", "border-none");
});

function calculateTotal() {
  const totalFoodQt = choosenPreferences.totalFoodQty;
  const totalFoodPrice = totalFoodQt * popup.dataset.price.split(".")[0];
  let totalDrinkPrice = 0;
  let drinkAmount = 0;
  selectedDrinks.map(({ price, amount }) => {
    totalDrinkPrice += price * amount;
    drinkAmount += amount;
  });
  total_price = totalFoodPrice + totalDrinkPrice;
  choosenPreferences.totalFoodPrice = totalFoodPrice;
  choosenPreferences.totalDrinkPrice = totalDrinkPrice;
  choosenPreferences.totalDrinkQty = drinkAmount;
  drinkCount.textContent = drinkAmount;
  confirmFoodTotal.innerHTML = `${totalFoodPrice} <span class="text-xs text-gray-400 ml-1">Birr</span>`;
  confirmTotalDrinkQty.textContent = choosenPreferences.totalDrinkQty
    ? choosenPreferences.totalDrinkQty
    : 0;
  summaryFoodSubtotal.textContent = totalFoodPrice + 0.025 * totalFoodPrice;
  summaryDrinkSubtotal.textContent = totalDrinkPrice + 0.025 * totalDrinkPrice;
  confirmTotalPrice.textContent =
    totalFoodPrice +
    0.025 * totalFoodPrice +
    totalDrinkPrice +
    0.025 * totalDrinkPrice;
  console.log(choosenPreferences);
  manageCenterd();
}

document.getElementById("increase_btn").addEventListener("click", () => {
  const qty = parseInt(amountShow.textContent) + 1;
  amountShow.textContent = qty;
  confirmFoodQty.textContent = qty;
  confirmFoodQtyDisplay.textContent = qty;
  choosenPreferences.totalFoodQty = qty;
});

document.getElementById("decrease_btn").addEventListener("click", () => {
  if (parseInt(amountShow.textContent) > 1) {
    const qty = parseInt(amountShow.textContent) - 1;
    amountShow.textContent = qty;
    confirmFoodQty.textContent = qty;
    confirmFoodQtyDisplay.textContent = qty;
    choosenPreferences.totalFoodQty = qty;
  }
});

async function cheack() {
  manageCenterd();
}
const confirm_form = document.querySelector(".confirm_form");

order_btn.addEventListener("click", () => {
  if (isloged_in) {
    popup.classList.add("scale-70");
    setTimeout(() => {
      popup.classList.add("hidden");
      confirm_form.classList.remove("hidden");
    }, 250);

    setTimeout(() => {
      confirm_form.classList.remove("scale-70");
    }, 260);
    console.log(choosenPreferences);
    handleSelectedDrinks();
    calculateTotal();
    getEthiopianDay();
    showSelectedTime();
  } else {
    window.location.href = "/Ella_accounts";
  }
});

document.getElementById("cancel_confirm").addEventListener("click", () => {
  confirm_form.classList.add("scale-70");
  setTimeout(() => {
    confirm_form.classList.add("hidden");
    popup.classList.remove("hidden");
  }, 250);
  setTimeout(() => {
    popup.classList.remove("scale-70");
  }, 260);
});

document
  .querySelector(".comment_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isloged_in === false) {
      window.location.assign("/Ella_accounts");
    }
    if (isloged_in === true) {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const response = await fetch("/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.message === "Error") {
        window.location.href = "/";
        return;
      }
      if (result.message === "successful") {
        const succes_massage = document.querySelector(".succes_massage");
        const popupOverlay = document.querySelector(".popup_overlay");
        popupOverlay.classList.remove("hidden");
        setTimeout(() => {
          succes_massage.classList.remove("scale-75");
        }, 8);
        setTimeout(() => {
          popupOverlay.classList.add("hidden");
          succes_massage.classList.add("scale-75");
          document.querySelector('textarea[name="comment"]').value = "";
        }, 650);
      }
    }
  });
const popup_overlay = document.querySelector(".popup-overlay");
const imgShow = popup_overlay.querySelector(".foodImg");
imgShow.classList.remove(`bg-[url('${popup.dataset.imguri}`);
document.querySelector(".cancelOrder_btn").addEventListener("click", () => {
  popup.classList.add("scale-70");
  setTimeout(() => {
    popup_overlay.classList.add("hidden");
  }, 250);
});
totalDrinkCount.textContent = `⚡${drinksData.length} drinks`;
function renderDrinks() {
  drinkCardsContainer.innerHTML = "";
  drinksData.forEach((drink) => {
    let isSelected = selectedDrinks.find((sdrink) => sdrink.id == drink.id);
    const drinkCard = document.createElement("div");
    const selectBtn = document.createElement("button");
    const increaseDrinkBtn = document.createElement("button");
    const decreaseDrinkBtn = document.createElement("button");
    let amount = isSelected?.amount ? isSelected?.amount : 1;
    increaseDrinkBtn.innerHTML = `<i class="fas fa-plus-circle text-xs"></i>`;
    decreaseDrinkBtn.innerHTML = `<i class="fas fa-minus-circle text-xs"></i>`;
    drinkCard.className =
      "drink-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-amber-200";
    selectBtn.className = `w-full bg-amber-50 hover:bg-amber-600 ${isSelected && "bg-amber-600 text-white"} text-amber-600 hover:text-white font-semibold py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-sm border border-amber-200 hover:border-transparent`;
    increaseDrinkBtn.className =
      "h-fit bg-gray-900 px-4 py-1 block flex-none text-white rounded-r-sm border-l overflow-hidden cursor-pointer";
    decreaseDrinkBtn.className =
      "h-fit bg-gray-900 px-4 py-1 block flex-none text-white rounded-l-sm border-l ml-auto cursor-pointer";

    selectBtn.innerHTML = `${!isSelected ? "Select Drink" : " Cancel Drink"}`;

    selectBtn.addEventListener("click", () => {
      if (isSelected) {
        selectedDrinks = selectedDrinks.filter(
          (sdrink) => sdrink.id !== drink.id,
        );
      } else {
        selectedDrinks.push({
          id: drink.id,
          name: drink.name,
          price: drink.price,
          description: drink.description,
          amount: 0,
        });
      }
      selectedDrinkCount.textContent = `${selectedDrinks.length} drinks selected`;

      renderDrinks();
    });

    increaseDrinkBtn.addEventListener("click", () => {
      if (isSelected) {
        selectedDrinks.forEach(
          (sdrink) => sdrink.id == drink.id && sdrink.amount++,
        );
        renderDrinks();
      }
    });
    decreaseDrinkBtn.addEventListener("click", () => {
      if (isSelected) {
        selectedDrinks.forEach((sdrink) => {
          if (sdrink.id == drink.id && sdrink.amount > 1) {
            sdrink.amount--;
          }
        });
        renderDrinks();
      }
    });

    drinkCard.innerHTML = `
          <div class="relative h-40 overflow-hidden rounded-t-xl">
                <img
                  src="${drink.imageURI}"
                  alt="Fresh Mint Lemonade"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500 rounded-t-xl"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"
                ></div>
              </div>

              <div class="innercard p-3">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="text-base font-bold text-gray-800">
                    ${drink.name}
                  </h3>
                  <span class="text-amber-600 font-bold text-base"
                    >${drink.price} Birr</span
                  >
                </div>

                <p class="text-gray-400 text-xs mb-2 line-clamp-1">
                  ${drink.description}
                </p>
                <div class="realcard w-full ${!isSelected && "hidden"} flex items-center mb-2 pr-1">
                  <strong>Amount: <span id="amount">${amount}</span></strong>
                </div>
              </div>`;

    const realCard = drinkCard
      .querySelector(".innercard")
      .querySelector(".realcard");
    realCard.appendChild(decreaseDrinkBtn);
    realCard.appendChild(increaseDrinkBtn);
    drinkCard.querySelector(".innercard").appendChild(selectBtn);
    drinkCardsContainer.appendChild(drinkCard);
  });
}
renderDrinks();
document.addEventListener("DOMContentLoaded", async () => {
  let isloged_in = false;
  const islogedIn_response = await fetch("/isloged_in");
  const isloged_in_status = await islogedIn_response.json();
  if (
    isloged_in_status.message !== "no session id" &&
    isloged_in_status.message !== "not loged in"
  ) {
    isloged_in = true;
  }
  if (isloged_in_status.message === "user logged in") {
    const profileLetter = document.querySelector(".profileLetter");
    const profileName = document.querySelector(".profileName");
    const profileEmail = document.querySelector(".profileEmail");

    profileLetter.textContent = isloged_in_status.info[0].name.substr(0, 1);
    profileLetter.classList.add(
      `bg-[${isloged_in_status.info[0].profile_color}]`,
    );
    profileName.textContent = isloged_in_status.info[0].name;
    profileEmail.textContent = isloged_in_status.info[0].email;
  }

  const response = await fetch("/getAllfoods");
  const foods = await response.json();
  let liked_foods;
  let liked_res;
  if (isloged_in === true) {
    liked_foods = await fetch("/getLikedfoods");
    liked_res = await liked_foods.json();
  }

  const food_container = document.getElementById("food_container");

  foods.forEach((food) => {
    const card = document.createElement("div");
    const food_photo = document.createElement("div");
    const contentContainer = document.createElement("div");
    const titlePriceRow = document.createElement("div");
    const food_name = document.createElement("h3");
    const priceSpan = document.createElement("span");
    const description = document.createElement("p");
    const orderInfoRow = document.createElement("div");
    const availabilitySpan = document.createElement("div");
    const orderBtn = document.createElement("button");
    const book_mark = document.createElement("button");
    const book_mark_icon = document.createElement("i");
    const timeBadge = document.createElement("div");
    const hoverBorder = document.createElement("div");

    // Apply modern card classes
    card.className =
      "h-fit rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col flex-none relative overflow-hidden group cursor-pointer";
    card.setAttribute("data-id", food.id);

    // Image Container with Overlay
    food_photo.className = "relative w-full h-36 overflow-hidden";
    const imgDiv = document.createElement("div");
    imgDiv.className = `bg-[url(${food.image_url})] w-full h-full bg-cover bg-no-repeat bg-center transition-transform duration-500 group-hover:scale-110`;
    const gradientOverlay = document.createElement("div");
    gradientOverlay.className =
      "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300";

    // Time Badge
    timeBadge.className =
      "absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1";
    timeBadge.innerHTML = `
    <span class="text-white text-[10px] flex items-center gap-1">
      <i class="far fa-clock text-[8px]"></i> ${food.time_taken || 20}-${(food.time_taken || 20) + 5} min
    </span>
  `;

    food_photo.appendChild(imgDiv);
    food_photo.appendChild(gradientOverlay);
    food_photo.appendChild(timeBadge);

    // Content Container
    contentContainer.className = "flex flex-col p-3 flex-1";

    // Title and Price Row
    titlePriceRow.className = "flex justify-between items-start mb-2";
    food_name.className = "text-lg font-bold text-gray-800 line-clamp-1 flex-1";
    food_name.textContent = food.name;

    const priceWrapper = document.createElement("div");
    priceWrapper.className = "bg-amber-100 rounded-lg px-2 py-1 ml-2";
    priceSpan.className = "text-amber-700 font-bold text-base";
    priceSpan.textContent = `${food.price} Birr`;
    priceWrapper.appendChild(priceSpan);

    titlePriceRow.appendChild(food_name);
    titlePriceRow.appendChild(priceWrapper);

    // Description
    description.className =
      "text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed";
    description.textContent =
      food.description ||
      "Fresh mint leaves, lemon juice, honey, and sparkling";

    // Order Info Row
    orderInfoRow.className = "flex items-center justify-between mt-auto pt-2";
    availabilitySpan.className =
      "flex items-center gap-1 text-green-600 text-xs";
    availabilitySpan.innerHTML = `
    <i class="fas fa-check-circle text-[10px]"></i>
    <span>Available now</span>
  `;

    orderBtn.className =
      "px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1 order-btn";
    orderBtn.innerHTML = `<i class="fas fa-shopping-cart text-[10px]"></i> Order`;

    orderInfoRow.appendChild(availabilitySpan);
    orderInfoRow.appendChild(orderBtn);

    contentContainer.appendChild(titlePriceRow);
    contentContainer.appendChild(description);
    contentContainer.appendChild(orderInfoRow);

    // Favorite Button
    book_mark.className =
      "book_mark rounded-full bg-white/90 backdrop-blur-sm hover:bg-amber-500 text-gray-600 hover:text-white absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all duration-200 shadow-md z-10";
    book_mark_icon.className = "book_mark fa-regular fa-bookmark text-sm";

    let is_liked;
    if (isloged_in == true) {
      is_liked = liked_res.some((like) => like.liked_foodid == food.id);
      if (is_liked == true) {
        book_mark_icon.classList.remove("fa-regular");
        book_mark_icon.classList.add("fa-solid");
        book_mark_icon.classList.add("text-amber-500");
      }
    }

    book_mark.appendChild(book_mark_icon);

    // Hover Effect Border
    hoverBorder.className =
      "absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-400 pointer-events-none transition-all duration-300";

    // Assemble card
    card.appendChild(food_photo);
    card.appendChild(contentContainer);
    card.appendChild(book_mark);
    card.appendChild(hoverBorder);

    // Bookmark click event (stops propagation to prevent card click)
    book_mark.addEventListener("click", async function (e) {
      e.stopPropagation();
      if (isloged_in === false) {
        window.location.assign("/Ella_accounts");
      } else {
        book_mark_icon.classList.toggle("fa-regular");
        book_mark_icon.classList.toggle("fa-solid");
        book_mark_icon.classList.toggle("text-amber-500");

        const like_fetch = await fetch(`/togglelike`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_liked: is_liked, food_id: food.id }),
        });
        const like_res = await like_fetch.json();
        is_liked ? (is_liked = false) : (is_liked = true);
      }
    });

    // Order button click event (opens popup)
    orderBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      imgShow.classList.add(`bg-[url('${food.image_url}')]`);
      manageCenterd();

      // food order preference
      popup_overlay.querySelector(".name").textContent = food.name;
      popup_overlay.querySelector(".price").textContent =
        "Price: " + food.price;
      popup_overlay.querySelector("img").setAttribute("src", food.image_url);
      popup_overlay.setAttribute("data-id", food.id);
      popup_overlay.classList.remove("hidden");

      setTimeout(() => {
        popup.classList.remove("scale-70");
      }, 10);

      popup.setAttribute("data-price", food.price);
      popup.setAttribute("data-id", food.id);
      popup.setAttribute("data-imguri", food.image_url);
      total_price = parseInt(Math.trunc(food.price));
      choosenPreferences.total_price = total_price;

      // confirm screen
      confirmFoodName.textContent = food.name;
      confirmFoodDescription?.description;
      confirmFoodPrice.textContent = food.price;
      choosenPreferences.totalFoodPrice = Number(Math.trunc(food.price));
      time = await getEthiopianTime();
      choosenPreferences.period = time?.period;
      manageCenterd();
      manageCenterd();
      showSelectedTime();

      let centerdMinute = getCenteredItem(minuteContainer);
      minute_btn.forEach((btn) => {
        btn.classList.remove("bg-amber-500", "text-white");
      });
      centerdMinute.classList.add("bg-amber-500", "text-white");
    });

    // Optional: If you still want card click for something else (but NOT to open popup)
    // Remove or comment out the old card click listener
    // card.addEventListener("click", ...) - DO NOT ADD THIS

    food_container.appendChild(card);
  });
});
