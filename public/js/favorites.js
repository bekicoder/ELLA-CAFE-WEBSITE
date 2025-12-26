  document.addEventListener("DOMContentLoaded",async()=>{
   // Get current year and insert into the span
  document.getElementById('currentYear').textContent = new Date().getFullYear();
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
  
  if(isloged_in===true){
 
  let liked_foods=await fetch("/getLikedfoods")
 let liked_res=await liked_foods.json()
 
  liked_res.forEach(async(food)=>{
    let is_liked=true;
    const food_info=foods.find(liked_food=>{
      return liked_food.id==food.liked_foodid
    })
    const card=document.createElement("div")
     const imageContainer=document.createElement("div")
     const text_wraper=document.createElement("div")
     const book_mark=document.createElement("button")
     const cook_time=document.createElement("span")
     const book_mark_icon=document.createElement("i")
     const name=document.createElement("strong")
     const price=document.createElement("strong")
     const date_display=document.createElement("small")
     card.classList.add("border","border-gray-300","flex","flex-col","rounded-xl","gap-2","min-w-[200px]","w-full","pb-7","max-w-[400px]","relative")
     imageContainer.classList.add(`bg-[url(${food_info.image_url})]`,"w-full","rounded-t-xl","bg-center","bg-cover","aspect-[16/9]","bg-no-repeat")
     book_mark.classList.add("rounded-full","bg-black/70","text-white","absolute","text-2xl","top-2","right-2","w-10","h-10","aspect-square","favorite_btn")
     book_mark_icon.classList.add("fa-regular","fa-bookmark")
     text_wraper.classList.add("w-full","flex","flex-col","px-3")
     name.classList.add("text-xl","mb-2")
     cook_time.textContent=`${food_info.time_taken} min`
    if(is_liked==true){
  book_mark_icon.classList.remove("fa-regular")
    book_mark_icon.classList.add("fa-solid")
    book_mark_icon.classList.add("text-yellow-500")
} 
    book_mark.addEventListener("click",async function(){
  
    book_mark_icon.classList.toggle("fa-regular")
    book_mark_icon.classList.toggle("fa-solid")
    book_mark_icon.classList.toggle("text-yellow-500")
    
    const like_fetch=await fetch(`/togglelike`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({is_liked:is_liked,food_id:food_info.id})
    })
    is_liked && card.remove()
    const like_res=await like_fetch.json()
    is_liked ? is_liked=false:is_liked=true
    
  
})
    name.textContent=food_info.name
    price.textContent=food_info.price+" Birr"
card.appendChild(imageContainer)
card.appendChild(book_mark)
card.appendChild(text_wraper)
text_wraper.appendChild(name)
text_wraper.appendChild(price)
text_wraper.appendChild(cook_time)
book_mark.appendChild(book_mark_icon)

const dateString =food.date;
const date = new Date(dateString);

const options = {
  weekday: "short", // "Mon", "Tue", etc.
  month: "short",   // "Jan", "Feb", "Mar", etc.
  day: "numeric"    // "1", "2", ..., "31"
};

const formatted = date.toLocaleDateString("en-US", options);
date_display.textContent=formatted
text_wraper.appendChild(date_display)
  document.querySelector(".favorites_container").appendChild(card)
     })
  }
   
  })
  
  
  const favorite_btn=document.querySelectorAll(".favorite_btn")
  favorite_btn.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const i=btn.querySelector("i")
      i.classList.toggle("fa-solid")
      i.classList.toggle("text-amber-400")
    })
  })
