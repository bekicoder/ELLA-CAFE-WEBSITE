   const form_container=document.querySelector(".form_container")
    const signUp_form=document.querySelector(".signUp_form")
    const signIn_form=document.querySelector(".signIn_form")
    const signUp_btn=document.querySelectorAll(".signUp_btn")
    const signIn_btn=document.querySelectorAll(".signIn_btn")
    const active_line=document.getElementById("active_line")
    const signInBtn=document.getElementById("signInBtn")
    const signUpBtn=document.getElementById("signUpBtn")
   const confirm_alert=document.querySelectorAll(".confirm_alert")
    const togglepassword=document.querySelectorAll(".togglepassword")
    
    signUp_btn.forEach(btn=>{
    btn.addEventListener("click",()=>{
      form_container.classList.remove("w-xl")
      signUp_form.classList.remove("hidden")
      signIn_form.classList.add("hidden")
     active_line.classList.remove("translate-x-[50%]") 
     active_line.classList.add("translate-x-[-50%]")
     btn.classList.add("text-blue-600")
     btn.classList.remove("text-gray-500")
     signIn_btn[0].classList.remove("text-blue-600")
     signIn_btn[0].classList.add("text-gray-500")
    })
      
    })
    
    signIn_btn.forEach(btn=>{
    btn.addEventListener("click",()=>{
      
      form_container.classList.add("w-xl")
      signUp_form.classList.add("hidden")
      signIn_form.classList.remove("hidden")
     active_line.classList.add("translate-x-[50%]") 
     active_line.classList.remove("translate-x-[-50%]")
     signUp_btn[0].classList.remove("text-blue-600")
     signUp_btn[0].classList.add("text-gray-500")
     btn.classList.add("text-blue-600")
     btn.classList.remove("text-gray-500") 
    
    })
      
    })
    
    signUp_form.addEventListener("submit",async(e)=>{
      e.preventDefault()
   const fd=new FormData(e.target)  
   const data=Object.fromEntries(fd.entries())
   
   if(data.coPassword!==data.password){
     confirm_alert[0].textContent="Password don't match"
    confirm_alert[0].classList.add("text-red-600") 
    setTimeout(()=>{
      confirm_alert[0].classList.add("animate_alert")
    },2)
    setTimeout(()=>{
      confirm_alert[0].classList.remove("animate_alert")
    },1000)
    return;
   }
   const response=await fetch("/signUp",{
     method:"POST",
     headers:{"Content-Type": "application/json"},
     body :JSON.stringify(data)
   }) 
   const result=await response.json()
   if(result.message==="user allready exists"){
     confirm_alert[0].textContent="Allready have an account Sign In insteady"
    confirm_alert[0].classList.remove("hidden") 
    setTimeout(()=>{
      confirm_alert.classList.add("animate_alert")
    },2)
    setTimeout(()=>{
      confirm_alert.classList.remove("animate_alert")
    },1000)
    return;
   }
   if(result.message==="successful"){
     window.location.replace("/")
   }
    })
    
    
    signIn_form.addEventListener("submit",async(e)=>{
      e.preventDefault()
   const fd=new FormData(e.target)  
   const data=Object.fromEntries(fd.entries())
   const response=await fetch("/signIn",{
     method:"POST",
     headers:{"Content-Type": "application/json"},
     body :JSON.stringify(data)
   }) 
   const result=await response.json()
   if(result.message==="don't have an account"){
     confirm_alert[1].textContent="don't have an account. Sign Up "
    confirm_alert[1].classList.remove("hidden") 
    setTimeout(()=>{
      confirm_alert[1].classList.add("animate_alert")
    },2)
    setTimeout(()=>{
      confirm_alert[1].classList.remove("animate_alert")
    },1000)
    return;
   }
   if(result.message==="password don't match"){
     
     confirm_alert[1].textContent="Password don't match"
    confirm_alert[1].classList.remove("hidden") 
    setTimeout(()=>{
      confirm_alert[1].classList.add("animate_alert")
    },2)
    setTimeout(()=>{
      confirm_alert[1].classList.remove("animate_alert")
    },1000)
    return;
   }
   window.location.replace("/")
   
    })
    
    togglepassword.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const parent=btn.parentElement
      const input=parent.querySelector("input")
      const ishidden=input.type==="password"
      input.type=ishidden ?"text":"password"
      btn.classList.toggle("fa-eye-slash")
      btn.classList.toggle("fa-eye")
    })
      
    })
    
  