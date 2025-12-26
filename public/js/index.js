
  let isloged_in;
  const humbergur=document.querySelector(".humbergur")
  const offcanvas_control=document.getElementById("offcanvas-control")
  window.addEventListener("load",async()=>{
     isloged_in=false
    const response=await fetch("/isloged_in")
    const isloged_in_status=await response.json()
    if(isloged_in_status.message !=="no session id" && isloged_in_status.message !=="not loged in"){
      document.querySelectorAll(".signUp_link").forEach(link=>{
       link.classList.add("hidden") 
      })
      document.querySelector('a[href="/logout"]').classList.remove("hidden")
      isloged_in=true;
    }
    else{
      document.querySelectorAll(".signUp_link").forEach(link=>{
       link.classList.remove("hidden") 
       isloged_in=false
      })
      
    }
  })
  
  humbergur.addEventListener("blur",()=>{
     setTimeout(()=>{
       offcanvas_control.checked=false
     },10)
  })
  
  const order_btn=document.getElementById("order_btn")
  const orderInfoInput=document.querySelector('input[name="info"]')
  const timeShow=document.querySelector(".selectedTime")
  const houre_btn=document.querySelectorAll(".houre_btn")
  const minute_btn=document.querySelectorAll(".minute_btn")
let choosenTime={}
const houreContainer = document.querySelector('.houreContainer');
const minuteContainer = document.querySelector('.minuteContainer');
const night_btn=document.querySelector(".night_btn")
const day_btn=document.querySelector(".day_btn")
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
  let shiftedHour=(date.getHours() - shiftHour + 24) % 24
  
  return (shiftedHour)
}


function getCurrentHour(){
  let now= new Date()
  let currentHour=getShiftedHour()
  let currentMinute=now.getMinutes()
  let currentPeriode=currentHour < 12 || currentHour===12?"PM":"AM"
  
  //== Upadte choosenTime ====
  
  return({hour:currentHour,minute:currentMinute,period:currentPeriode})
 }
 
 let time=getCurrentHour()
 choosenTime.period=time.period
 let amountShow=document.getElementById("amount")
 let amount=1
 let total_price;
 function manageCenterd(){
   
  if(choosenTime.period==="PM"){
   day_btn.classList.add("bg-amber-500","text-white","border-none")
 }
   else{
   night_btn.classList.add("bg-amber-500","text-white","border-none")
 }
 
   time=getCurrentHour()
   let centerdHour=getCenteredItem(houreContainer)
   let centerdMinute=getCenteredItem(minuteContainer)
   houre_btn.forEach(btn=>{
     btn.classList.remove("bg-amber-500")
     btn.classList.remove("text-white")
   })
   centerdHour.classList.add("bg-amber-500")
   centerdHour.classList.add("text-white")
   
   minute_btn.forEach(btn=>{
     btn.classList.remove("bg-amber-500","text-white")
   })
   centerdMinute.classList.add("bg-amber-500","text-white")
   let choosenHour=parseInt(centerdHour.textContent)
   choosenTime.hour=choosenHour
   choosenTime.minute=parseInt(centerdMinute.textContent)
// == Accesing day hour in day ==
   if(time.period==="PM" && choosenTime.period==="PM"){
     
// ====== remove unavailable Hour ====
    houre_btn.forEach((btn)=>{
        if(btn.dataset.period=="AM" || parseInt(btn.dataset.index) < time.hour){
        btn.classList.add("hidden")
      }
         else{
        btn.classList.remove("hidden")
      }
    }) 
// ====== remove unavailable minute ====   
    if(parseInt(centerdHour.dataset.index)===time.hour){
      minute_btn.forEach(mbtn=>{
        if(parseInt(mbtn.textContent)<time.minute){
          mbtn.classList.add("hidden")
        }
        else{
          mbtn.classList.remove("hidden")
        }
      })
    }
    else if(parseInt(centerdHour.dataset.index) > time.hour){
      minute_btn.forEach(mbtn=>{
        mbtn.classList.remove("hidden")
      })
    }
   }
// == Accesing day hour in night ==   
   else if(time.period==="AM" && choosenTime.period==="PM"){
     houre_btn.forEach(btn=>{
       if(btn.dataset.period==="AM"){
         btn.classList.add("hidden")
       }
       if(btn.dataset.period==="PM"){
         btn.classList.remove("hidden")
         minute_btn.forEach(mbtn=>{
           mbtn.classList.remove("hidden")
         })
       }
     })
     
   }
// == Accesing Night hour in Night ==   
   else if(time.period==="AM" && choosenTime.period==="AM"){
// ====== remove unavailable Hour ====     
 houre_btn.forEach((btn)=>{
       if(btn.dataset.period==="PM" || parseInt(btn.dataset.index) < time.hour){
         btn.classList.add("hidden")
       }
       else{
         btn.classList.remove("hidden")
       }
     })

 if(time.hour > 15){
  houre_btn.forEach((btn)=>{
  if(btn.dataset.period==="PM"){
         btn.classList.add("hidden")
       }
  if(btn.dataset.period==="AM"){
         btn.classList.remove("hidden")
       }
   }) 
 }     
// ====== remove unavailable minute ====  
  if(parseInt(centerdHour.dataset.index)===time.hour){
  minute_btn.forEach(mbtn=>{
        if(parseInt(mbtn.textContent)<time.minute){
          mbtn.classList.add("hidden")
        }
        else{
          mbtn.classList.remove("hidden")
        }
      })  
  }
  
  else if(parseInt(centerdHour.dataset.index) > time.hour){
      minute_btn.forEach(mbtn=>{
        mbtn.classList.remove("hidden")
      })
    }
    
    
   }
  // == Accesing Night hour in day == 
  else if(time.period==="PM" && choosenTime.period==="AM"){
     houre_btn.forEach(btn=>{
       if(btn.dataset.period==="PM"){
         btn.classList.add("hidden")
       }
       if(btn.dataset.period==="AM"){
         btn.classList.remove("hidden")
         minute_btn.forEach(mbtn=>{
           mbtn.classList.remove("hidden")
         })
       }
     })
     
   }
   choosenTime.food_id=popup.dataset.id
   choosenTime.amount=amount
   choosenTime.total_price=total_price
   orderInfoInput.value=JSON.stringify(choosenTime)
 }
 
 const confirm_cost=document.querySelector(".confirm_cost")
 const confirm_time=document.querySelector(".confirm_time")
 const confirm_amount=document.querySelector(".confirm_amount")
 function showSelectedTime(){
  let selectedPeriod =choosenTime.period=="PM" ? "ቀን" :"ማታ"
  timeShow.textContent=`Time: ${choosenTime.hour}:${choosenTime.minute} ${selectedPeriod} `
  confirm_time.textContent=` ${choosenTime.hour}:${choosenTime.minute} ${selectedPeriod} `
}

 houreContainer.addEventListener("scroll",()=>{
   manageCenterd()
   manageCenterd()
   showSelectedTime()
 })
 minuteContainer.addEventListener("scroll",()=>{
   manageCenterd()
   manageCenterd()
   showSelectedTime()
 })
  
night_btn.addEventListener("click",function(){
  choosenTime.period="AM"
  manageCenterd()
  manageCenterd()
  showSelectedTime()
  // ============ //
  day_btn.classList.remove("bg-amber-500","text-white","border-none")
  this.classList.add("bg-amber-500","text-white","border-none")
})
  

day_btn.addEventListener("click",function(){
  
  choosenTime.period="PM"
  manageCenterd()
  manageCenterd()
  showSelectedTime()
  
  // =============== //
  
  night_btn.classList.remove("bg-amber-500","text-white","border-none")
  this.classList.add("bg-amber-500","text-white","border-none")
})  

document.getElementById("increase_btn").addEventListener("click",()=>{
  amount=parseInt(amountShow.textContent)+1
  amountShow.textContent = amount
  confirm_amount.textContent=amount
  total_price=amount* popup.dataset.price.split(".")[0]
  confirm_cost.textContent=total_price
  manageCenterd()
})

document.getElementById("decrease_btn").addEventListener("click",()=>{
  if(parseInt(amountShow.textContent) >1){
    amount=parseInt(amountShow.textContent)-1
  amountShow.textContent = amount
  confirm_amount.textContent=amount
  total_price=amount* popup.dataset.price.split(".")[0]
  confirm_cost.textContent=total_price
  manageCenterd()
  }
  
})

async function cheack(){
  manageCenterd()
}
  const confirm_form=document.querySelector(".confirm_form")
order_btn.addEventListener("click",()=>{
  if(isloged_in){
    popup.classList.add("scale-70")
  setTimeout(()=>{
    popup.classList.add("hidden")
  confirm_form.classList.remove("hidden")
  },250)
  
  setTimeout(()=>{
  confirm_form.classList.remove("scale-70")
  },260)
  
  confirm_cost.textContent=amount * popup.dataset.price.split(".")[0]
  showSelectedTime()
  }
  else{
    window.location.href="/Ella_accounts"
  }
})

document.getElementById("cancel_confirm").addEventListener("click",()=>{
  confirm_form.classList.add("scale-70")
  setTimeout(()=>{
    confirm_form.classList.add("hidden")
  popup.classList.remove("hidden")
  },250)
  setTimeout(()=>{
  popup.classList.remove("scale-70")
  },260)
  
})


  document.querySelector('.comment_form').addEventListener("submit",async(e)=>{
    e.preventDefault()
    
    if(isloged_in===false){
      window.location.assign("/Ella_accounts")
    }
    if(isloged_in===true){
      const fd=new FormData(e.target)
    const data=Object.fromEntries(fd.entries())
    const response= await fetch("/comments",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })
    const result=await response.json()
    if(result.message==="Error"){
      window.location.href="/"
      return;
    }
    if(result.message==="successful"){
      const succes_massage=document.querySelector(".succes_massage")
  const popupOverlay=document.querySelector(".popup_overlay")
  popupOverlay.classList.remove("hidden")
  setTimeout(()=>{
    succes_massage.classList.remove("scale-75")
  },8)
  setTimeout(()=>{
    popupOverlay.classList.add("hidden")
    succes_massage.classList.add("scale-75")
    document.querySelector('textarea[name="comment"]').value=""
  },650)
    }
    }
  })

  
const popup_overlay=document.querySelector(".popup-overlay")
const popup=document.querySelector(".popup")
document.querySelector(".cancelOrder_btn").addEventListener("click",()=>{
  popup.classList.add("scale-70")
  setTimeout(()=>{
    popup_overlay.classList.add("hidden")
  },250)
})


  document.addEventListener("DOMContentLoaded",async()=>{
  let isloged_in=false
    const islogedIn_response=await fetch("/isloged_in")
    const isloged_in_status=await islogedIn_response.json()  
    if(isloged_in_status.message !=="no session id" && isloged_in_status.message !=="not loged in"){
      isloged_in=true
    }
    if(isloged_in_status.message==="user logged in"){


  const profileLetter=document.querySelector(".profileLetter")   
  const profileName=document.querySelector(".profileName")   
  const profileEmail=document.querySelector(".profileEmail")   
  
  profileLetter.textContent=isloged_in_status.info[0].name.substr(0,1)
  profileLetter.classList.add(`bg-[${isloged_in_status.info[0].profile_color}]`)
  profileName.textContent=isloged_in_status.info[0].name
  profileEmail.textContent=isloged_in_status.info[0].email
  
      
      
    }
    
  const response=await fetch("/getAllfoods")
  const foods=await response.json()
  let liked_foods;
  let liked_res;
  if(isloged_in===true){
   liked_foods=await fetch("/getLikedfoods")
   liked_res=await liked_foods.json()
   
  }
  
  const food_container=document.getElementById("food_container")
  
  
foods.forEach(food=>{
const card=document.createElement("div");
const food_photo=document.createElement("div");
const text_wrapper=document.createElement("div");
const food_name=document.createElement("strong");
const book_mark=document.createElement("button");
const book_mark_icon=document.createElement("i");
const cook_time=document.createElement("span");
const food_price=document.createElement("strong");
card.classList.add("w-[150px]","min-h-48","h-fit","rounded-xl","border","border-gray-200","flex","flex-col","flex-none","relative")
book_mark.classList.add("book_mark","rounded-full","bg-black/70","text-white","absolute","text-2xl", "top-2","right-2","w-10","h-10","aspect-square","favorite_btn")

book_mark_icon.classList.add("book_mark","fa-regular","fa-bookmark")

let is_liked;
if(isloged_in==true){
is_liked= liked_res.some(like => like.liked_foodid == food.id);
if(is_liked==true){
  book_mark_icon.classList.remove("fa-regular")
    book_mark_icon.classList.add("fa-solid")
    book_mark_icon.classList.add("text-yellow-500")
}
  
}

book_mark.appendChild(book_mark_icon)
card.setAttribute("data-id",food.id)


food_photo.classList.add(`bg-[url(${food.image_url})]`,"w-full","h-25","bg-cover","rounded-t-xl","bg-no-repeat","bg-center","flex-none")
text_wrapper.classList.add("w-full","p-2","flex","flex-col")
cook_time.classList.add("text-sm")
food_name.textContent=food.name
cook_time.textContent=`${food.time_taken} min`
food_price.textContent=`${food.price} Birr`

text_wrapper.appendChild(food_name)
text_wrapper.appendChild(cook_time)
text_wrapper.appendChild(food_price)
card.appendChild(food_photo)
card.appendChild(text_wrapper)
card.appendChild(book_mark)

book_mark.addEventListener("click",async function(){
  if(isloged_in===false){
    window.location.assign("/Ella_accounts")
  }
  else{
    book_mark_icon.classList.toggle("fa-regular")
    book_mark_icon.classList.toggle("fa-solid")
    book_mark_icon.classList.toggle("text-yellow-500")
    
    const like_fetch=await fetch(`/togglelike`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({is_liked:is_liked,food_id:food.id})
    })
    const like_res=await like_fetch.json()
    is_liked ? is_liked=false:is_liked=true
    
  }
})

card.addEventListener("click",(e)=>{
  
  if(!e.target.classList.contains("book_mark")){
    popup_overlay.querySelector(".name").textContent=food.name
  popup_overlay.querySelector(".price").textContent="Price: " +food.price
  popup_overlay.querySelector("img").setAttribute('src',food.image_url)
  popup_overlay.setAttribute("data-id",food.id)
  popup_overlay.classList.remove("hidden")
  setTimeout(()=>{
    popup.classList.remove("scale-70")
  },1)
  popup.setAttribute("data-price",food.price)
  popup.setAttribute("data-id",food.id)
  total_price=parseInt(food.price.split(".")[0])
  manageCenterd()
  manageCenterd()
  showSelectedTime()
  let centerdMinute=getCenteredItem(minuteContainer)
  minute_btn.forEach(btn=>{
     btn.classList.remove("bg-amber-500","text-white")
   })
  centerdMinute.classList.add("bg-amber-500","text-white")
  
  }
  
})
food_container.appendChild(card)
})


  })
  


