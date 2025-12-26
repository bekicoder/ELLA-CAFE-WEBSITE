  const succes_massage=document.querySelector(".succes_massage")
  const popupOverlay=document.querySelector("popup_overlay")
  popup_overlay.classList.remove("hidden")
  setTimeout(()=>{
    succes_massage.classList.remove("scale-75")
  },5)
  setTimeout(()=>{
    popup_overlay.classList.add("hidden")
    succes_massage.classList.add("scale-75")
    document.querySelector('input[name="comment"]').value=""
  },255)
  
  
 

