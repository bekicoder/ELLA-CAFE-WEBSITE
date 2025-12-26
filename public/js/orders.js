
  let isloged_in;
  document.addEventListener("DOMContentLoaded",async()=>{
// ==== cheack isloged_in === //
 isloged_in=false
    const response=await fetch("/isloged_in")
    const isloged_in_status=await response.json()
    if(isloged_in_status.message !=="no session id" && isloged_in_status.message !=="not loged in"){
      isloged_in=true;
      
    }
    else{
       isloged_in=false
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
// ===== display orders === // 
  if(isloged_in){
    const getOrders=await fetch("/getAllOrders")
    const orders=await getOrders.json()
    if(orders.length !== 0){
      
      orders.forEach(order=>{
   const card=document.createElement("div")
   const img=document.createElement("img")
   const infoContainer=document.createElement("div")
   const name=document.createElement("strong")
   const time=document.createElement("small")
   const timeTaken=document.createElement("small")
   const amount=document.createElement("small")
   const price=document.createElement("small")
   const QRbtn=document.createElement("button")
   const QRicon=document.createElement("i")
   const status=document.createElement("small")
   
  card.classList.add("border","border-gray-300","ml-2","flex","rounded-xl","gap-2","min-w-[300px]","max-h-30") 
  img.classList.add("w-28","rounded-l-xl")
  infoContainer.classList.add("flex","flex-col","mr-7","overflow-auto")
  QRbtn.classList.add("ml-auto","mr-3","flex","flex-col",'my-auto',"h-full","block","justify-center")
  QRicon.classList.add("fa-solid","fa-qrcode","text-3xl","mt-3","mt-[55%]","flex-1")
  name.textContent=order.name
 time.textContent=`Time: ${order.hour}:${order.minute} ${order.period=="PM"?"ቀን" :"ማታ"}`
 timeTaken.textContent="Time taken: "+order.time_taken
 amount.textContent=`Amount: ${order.amount}`
 price.textContent=`Total price: ${order.total_price} Birr`
 img.setAttribute("src",order.image_url)
 card.appendChild(img)
 infoContainer.appendChild(name)
 infoContainer.appendChild(time)
 infoContainer.appendChild(timeTaken)
 infoContainer.appendChild(price)
 infoContainer.appendChild(amount)
 infoContainer.appendChild(amount)
 card.appendChild(infoContainer)
 card.appendChild(QRbtn)
 QRbtn.appendChild(QRicon)
 if(order.status==="false"){
   status.textContent="Pending..."
 }
 else if(order.status==="true"){
   status.textContent="Delivered"
 }
 QRbtn.appendChild(status)
 
 QRbtn.addEventListener("click",()=>{
   
  let QRinfo={user_id:order.user_id,food_id:order.food_id,hour:order.hour,minute:order.minute,period:order.period,amount:order.amount,total_price:order.total_price} 
   
    // Clear previous QR code if exists
  document.querySelector(".qr_popup").classList.remove("hidden")  
    document.getElementById("qrcode").innerHTML = "";

    // Generate QR code
    new QRCode(document.getElementById("qrcode"), {
        text: QRinfo,
        width: 200,
        height: 200
    });
 })
 
 document.querySelector(".ordersContainer").appendChild(card)
   }) 
    }
   
  }

  document.querySelector(".qr_popup").addEventListener("click",function(e){
      
    if(e.target.id !=="qrcode"){
      this.classList.add("hidden")
    }
  })
  })
