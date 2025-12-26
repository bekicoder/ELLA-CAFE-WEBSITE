const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { formidable } = require("formidable");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Pool } = require("pg");

// PostgreSQL connection
const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "mydb@pass",
  database: "ella_cafe",
  port: 5432,
});

// Serve static files
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/Ella_home", express.static(path.join(__dirname, "views/index.html")));
app.use("/Ella_orders", express.static(path.join(__dirname, "views/orders.html")));
app.use("/Ella_waiter", express.static(path.join(__dirname, "views/waiter.html")));
app.use("/Ella_favorites", express.static(path.join(__dirname, "views/favorites.html")));
app.get("/getInto_Manager",(req,res)=>{
res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
   <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
</head>
<body>
    <form id="autanticate" action="/Ella_manager" method="post" enctype="application/json" class="h-screen w-screen bg-white fixed top-0 left-0 z-10000 flex justify-center items-center text-white">
    <div class="w-80 h-50 bg-gray-800 border border-gray-300 rounded-xl flex justify-center py-4 flex-col px-3">
   <div>
    <div class="flex flex-col w-full relative bg-amber-00">

        <i class="fas fa-key text-gray-400 absolute bottom-4 ml-2"></i>
        <button type="button" class="fas fa-eye-slash togglepassword text-gray-400 hover:text-gray-600 absolute bottom-4 right-0 mr-2"></button>
      <input type="password" id="laname" class="border border-gray-50  px-2 py-2.5 w-full rounded-lg flex-1 px-10 text-white" placeholder="••••••••" name="password" autocomplete="off" required>
      </div>
  <button type="button" class="p-2">Forget password?</button>    
     
   </div>   
   
   <button type="submit" class="py-3 px-5 bg-gray-200 mt-4 rounded-2xl text-lg text-black">Get In</button>
    </div>
  </form>
  
   <script>
     const pass = document.querySelector('input[name="password"')
     document.querySelector('.togglepassword').addEventListener("click",function(e){
       ishidden=pass.type==="password"
       pass.type= ishidden ? "text" : "password"
       this.classList.toggle("fa-eye-slash")
       this.classList.toggle("fa-eye")
     })
    const form=document.getElementById("autanticate") 
    
  /* form.addEventListener("submit",async(e)=>{
     e.preventDefault()
     const fd=new FormData(e.target)
     const data=Object.fromEntries(fd.entries())
     const response= await fetch("/getIntoManagers",{
       method:"POST",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify(data)
     })
     const parsedRes=await response.json()
     alert(JSON.stringify(parsedRes))
      
   })  */
   </script>
</body>
</html>
`);
}) 

app.use("/Ella_accounts", express.static(path.join(__dirname, "views/account.html")));
app.use("/Ella_developer_Bereket_Girma", express.static(path.join(__dirname, "views/developer.html")));
app.use(express.static(__dirname));

app.use(cookieParser("mysecretkey"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = path.join(__dirname, "cloude_store");
const form = formidable({
  multiples: false,
  allowEmptyFiles: true,
  uploadDir: store,
  minFileSize: 0,
  keepExtensions: true,
});

// --- Helper functions ---
function sqlError(err, res) {
  if (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

// --- Authentication middleware ---
async function auth(req, res, next) {
  try {
    const session_id = req.signedCookies.session_id || req.headers["x-session-id"];
    if (!session_id) return res.status(401).json({ message: "no session id" });

    const result = await db.query("SELECT * FROM sessions WHERE session_id=$1", [session_id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "invalid session" });
    }
    req.user_id = result.rows[0].user_id;
    next();
  } catch (err) {
    sqlError(err, res);
  }
}

// --- Add new food ---
app.post("/addNewFood", (req, res) => {
  const form = formidable({
    multiples: false,
    allowEmptyFiles: true,
    uploadDir: store,
    minFileSize: 0,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return sqlError(err, res);
    try {
      const { name, price, time_taken } = fields;
      const image_url = `/cloude_store/${files.photo[0].newFilename}`;
      const sql = `INSERT INTO foods (name, price, time_taken, image_url)
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
      const result = await db.query(sql, [name[0], price[0], time_taken[0], image_url]);
      res.status(200).json({ message: "successful", info: result.rows[0] });
    } catch (e) {
      sqlError(e, res);
    }
  });
});

// --- Update food ---
app.post("/updateFood", (req, res) => {
  const form = formidable({
    multiples: false,
    allowEmptyFiles: true,
    uploadDir: store,
    minFileSize: 0,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    console.log(fields)
    console.log(files)
    if (err) return sqlError(err, res);
    try {
      // 🧠 Fix: Convert values properly
      const name = fields.name[0] ? fields.name[0] : '';
      const price = fields.price[0] ? Number(fields.price[0]) || null : null;
      const time_taken = fields.time_taken[0] ? Number(fields.time_taken[0]) || null : null;
      const id = Number(fields.id[0]);
 
      let image_url = '';
      if (files.photo[0].originalFilename) {
        image_url = `/cloude_store/${files.photo[0].newFilename}`;
       
      await fs.promises.unlink(path.join(__dirname, fields.img_name[0]));
      console.log('File deleted successfully');
      }
      
    const sql = `
        UPDATE foods SET
          name = COALESCE(NULLIF($1, ''), name),
          price = COALESCE($2, price),
          time_taken = COALESCE($3, time_taken),
          image_url = COALESCE(NULLIF($4, ''), image_url)
        WHERE id = $5
        RETURNING *;`;

      // 🧠 Notice: no '' strings for numeric fields
      const params = [name, price, time_taken, image_url, id];

      const result = await db.query(sql, params);
      console.log(result)
      res.status(200).json({ message: "successful",info:result.rows[0]});  
      
    } catch (e) {
      sqlError(e, res);
    }
  });
});

// --- Get all foods ---
app.get("/getAllfoods", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM foods;");
    res.json(result.rows);
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Get liked foods ---
app.get("/getLikedfoods", auth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM liked_foods WHERE user_id=$1 order by id desc;", [req.user_id]);
    res.json(result.rows);
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Delete food ---
app.post("/deleteFood", async (req, res) => {
  const { id, image_url } = req.body;
  
  try {
    await db.query("DELETE FROM foods WHERE id=$1;", [id]);
    fs.unlink(path.join(__dirname, image_url), (err) => {
      if (err) console.error("File delete error:", err);
      res.json({ message: "successful" });
    });
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Sign Up ---
app.post("/signUp", async (req, res) => {
  try {
      const profileColors = [
  "#0388D2", "#00579B", "#0098A7", "#00897B", "#004D40",
  "#68A039", "#EF6C00", "#F6511E", "#C1175C", "#AA47BD",
  "#7B1FA2", "#512DA7", "#455A65",
  "#D32F2F", "#388E3C", "#303F9F", "#FBC02D", "#5D4037"
];


const randomIndex = Math.floor(Math.random() * profileColors.length);

// Select the random color
const randomColor = profileColors[randomIndex];

    const { fname, lname, email, phone_number, password } = req.body;
    const name = `${fname} ${lname}`;
    const exists = await db.query("SELECT * FROM customers WHERE email=$1;", [email]);
    if (exists.rows.length !== 0) return res.json({ message: "user already exists" });

    const insertUser = await db.query(
      "INSERT INTO customers (name, email, password, phone_number,profile_color) VALUES ($1, $2, $3, $4,$5) RETURNING id;",
      [name, email, password, phone_number,randomColor]
    );

    const user_id = insertUser.rows[0].id;
    const session_id = crypto.randomBytes(16).toString("hex");
    await db.query("INSERT INTO sessions (session_id, user_id) VALUES ($1, $2);", [session_id, user_id]);

    res.cookie("session_id", session_id, {
      httpOnly: true,
      signed: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "successful" });
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Sign In ---
app.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query("SELECT * FROM customers WHERE email=$1;", [email]);
    if (result.rows.length === 0) return res.json({ message: "don't have an account" });

    const user = result.rows[0];
    if (user.password !== password) return res.json({ message: "password don't match" });

    const session_id = crypto.randomBytes(16).toString("hex");
    await db.query("INSERT INTO sessions (session_id, user_id) VALUES ($1, $2);", [session_id, user.id]);

    res.cookie("session_id", session_id, {
      httpOnly: true,
      signed: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "successful" });
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Check login ---
app.get("/isloged_in",auth,async (req, res) => {
  const session_id = req.signedCookies.session_id || req.headers["x-session-id"];
  if (!session_id) return res.json({ message: "no session id" });

  try {
    const result = await db.query("SELECT * FROM sessions WHERE session_id=$1;", [session_id]);
    if (result.rows.length === 0) res.json({ message: "not logged in" });
    else{
    db.query("SELECT * from customers where id = $1 ;",[req.user_id],(err,data)=>{
      if(err){
        console.log(err)
        return res.json({message:"Internal Server Error"})
        
      }
     delete data.rows[0].id
     delete data.rows[0].password
      res.json({ message: "user logged in",info:data .rows});
    })  
    
      
    } 
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Logout ---
app.get("/logout", async (req, res) => {
  const session_id = req.signedCookies.session_id || req.headers["x-session-id"];
  if (!session_id) return res.status(401).json({ message: "no session id" });
  try {
    await db.query("DELETE FROM sessions WHERE session_id=$1;", [session_id]);
    res.clearCookie("session_id", { httpOnly: true, signed: true, path: "/" });
    res.set("Cache-Control", "no-store");
    res.redirect("/");
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Comments ---
app.post("/comments", async (req, res) => {
  try {
    const session_id = req.signedCookies.session_id || req.headers["x-session-id"];
    const comment = req.body.comment;
    if (!session_id || !comment) return res.json({ message: "Error" });

    const session = await db.query("SELECT * FROM sessions WHERE session_id=$1;", [session_id]);
    if (session.rows.length === 0) return res.json({ message: "Error" });

    await db.query("INSERT INTO comments (comment, user_id) VALUES ($1, $2);", [
      comment,
      session.rows[0].user_id,
    ]);
    res.json({ message: "successful" });
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Toggle Like ---
app.post("/togglelike", auth, async (req, res) => {
  const { is_liked, food_id } = req.body;
  try {
    if (is_liked) {
      await db.query("DELETE FROM liked_foods WHERE liked_foodId=$1;", [food_id]);
      res.status(200).json({ message: "successfully unliked" });
    } else {
      await db.query("INSERT INTO liked_foods (user_id, liked_foodId) VALUES ($1, $2);", [
        req.user_id,
        food_id,
      ]);
      res.status(200).json({ message: "successfully liked" });
    }
  } catch (err) {
    sqlError(err, res);
  }
});

// --- Get liked food info ---
app.post("/getLikedfood_info", auth, async (req, res) => {
  if (!req.body.food_id) return res.status(401).json({ message: "Error no food id" });
  try {
    const result = await db.query("SELECT * FROM foods WHERE id=$1;", [req.body.food_id]);
    res.json(result.rows);
  } catch (err) {
    sqlError(err, res);
  }
});

app.post("/order_food",auth,(req,res)=>{
  const info=JSON.parse(req.body.info)
  db.query("insert into orders(user_id,food_id,hour,minute,period,amount,total_price) VALUES($1,$2,$3,$4,$5,$6,$7)",[req.user_id,info.food_id,info.hour,info.minute,info.period,info.amount,info.total_price],(err,results)=>{
    if(err) return(res.json({errir:"Internal databses Error try again later"+err}))
    else{
      res.status(200).redirect("/")
    }
  })
  
  
})

app.get("/getAllOrders", auth, async (req, res) => {
  try {
    const ordersResult = await db.query("SELECT * FROM orders WHERE user_id=$1 order by id desc", [req.user_id]);

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const foodResult = await db.query("SELECT * FROM foods WHERE id=$1", [parseInt(order.food_id)]);
        return { ...order, ...foodResult.rows[0] };
      })
    );

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/getActiveOrders", async (req, res) => {
  try {
    const results = await db.query(`SELECT * FROM orders WHERE status = 'false' order by id desc`);

    const orders = await Promise.all(
      results.rows.map(async (order) => {
        // Get food info
        const foodResult = await db.query("SELECT * FROM foods WHERE id = $1", [order.food_id]);
        const foodInfo = foodResult.rows[0];
  
        // Get customer info
        const customerResult = await db.query("SELECT * FROM customers WHERE id = $1", [order.user_id]);
        const customer = customerResult.rows[0];
    
        // Remove sensitive or redundant data
        const { password, id, ...safeCustomer } = customer;
        const { user_id, ...safeOrder } = order;
        // Combine everything
        return {
          ...safeOrder,
          ...safeCustomer,
          food: foodInfo,};
      })
    );

    res.json(orders);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all comments
app.get("/getAllcomments",async(req,res)=>{
  const comments = await db.query("select * from comments order by id desc;")
  const commentInfo = await Promise.all(comments.rows.map(async (comment)=>{
  const fullInfo = await db.query(`select * from customers where id=$1`,[comment.user_id]) 
  const feedback=comment.comment
  const name=fullInfo.rows[0].name
  const color=fullInfo.rows[0].profile_color
  
  return {name,feedback,color}
  }))
  
  
 res.json(commentInfo) 
 console.log(commentInfo)
})


app.post("/Ella_manager",async(req,res)=>{
  const {password}=req.body
  
  db.query("select * from managers where id = 1",async(err,results)=>{
    if(err){
      res.json({message:err})
      return console.log(err)
    }
  const isMatched=password ? await bcrypt.compare(password,results.rows[0].password) :''
  if(isMatched){
    res.sendFile(path.join(__dirname,"views/cms.html"))
  }  
  else if(!isMatched){
    res.send(`
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
   <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
</head>
<body>
    <form id="autanticate" action="/Ella_manager" method="post" enctype="application/json" class="h-screen w-screen bg-white fixed top-0 left-0 z-10000 flex justify-center items-center text-white">
    <div class="w-80 h-50 bg-gray-800 border border-gray-300 rounded-xl flex justify-center py-4 flex-col px-3">
   <div>
    <div class="flex flex-col w-full relative bg-amber-00">

        <i class="fas fa-key text-gray-400 absolute bottom-4 ml-2"></i>
        <button type="button" class="fas fa-eye-slash togglepassword text-gray-400 hover:text-gray-600 absolute bottom-4 right-0 mr-2"></button>
      <input type="password" id="laname" class="border border-gray-50  px-2 py-2.5 w-full rounded-lg flex-1 px-10 text-white" placeholder="••••••••" name="password" autocomplete="off" required>
      </div>
  <button type="button" class="py-2">Forget password?</button>
  <p class="text-red-500">Password don't match.</p>
     
   </div>   
   
   <button type="submit" class="py-3 px-5 bg-gray-100 mt-4 rounded-2xl text-lg text-black">Get In</button>
    </div>
  </form>
  
   <script>
     const pass = document.querySelector('input[name="password"')
     document.querySelector('.togglepassword').addEventListener("click",function(e){
       ishidden=pass.type==="password"
       pass.type= ishidden ? "text" : "password"
       this.classList.toggle("fa-eye-slash")
       this.classList.toggle("fa-eye")
     })
    const form=document.getElementById("autanticate") 
    document.querySelector('[id="laname"]').value=""
    document.querySelector('[id="laname"]').value="${password}"

   </script>
</body>
</html> 
    `)
  }
  })
})

app.post("/changeSecret",async(req,res)=>{
  const {password,recoveryEmail}=req.body  
  const hashedPass=password ? await bcrypt.hash(password,10) :''
  
  db.query(`update managers set password=COALESCE(NULLIF($1,''),password),recovery_email=COALESCE(NULLIF($2,''),recovery_email) RETURNING *;`,[hashedPass,recoveryEmail],async(err,results)=>{
   if(err){
      res.json({message:err})
      return console.log(err)
    } 
    console.log(hashedPass+recoveryEmail)
   res.json({message:"successful"})
  })
})

app.listen(3000,"0.0.0.0", () => console.log("Server running on http://localhost:3000"));