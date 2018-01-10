const http = require('http');
const fs = require('fs');
const Comments = require('./js/Comments.js');
const webApp = require("./webapp.js");
const port = process.argv[process.argv.length - 1] || 8000;
const comments = new Comments("./database/data.json");

let registered_users = [{userName:'bhanutv',name:'Bhanu Teja Verma'},{userName:'harshab',name:'Harsha Vardhana'}];

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const redirectLoggedInUserToHome = function(req,res){
  if(req.urlIsOneOf(['/login']) && req.user){
    res.redirect('/');
  }
}

const redirectLoggedOutUserToNormalGuest = function(req,res){
  if(req.urlIsOneOf(['/guest.html','/guest','/actualGuest']) && !req.user){
    res.redirect('/logedOutGuest');
  }
}

const redirectLoggedInUserToActualGuest = function(req,res){
  if(req.urlIsOneOf(['/guest.html','/guest','/logedOutGuest']) && req.user){
    res.redirect("/actualGuest");
  }
}

const contentType = {
  "html" : "text/html",
  "txt" : "text/plain",
  "css" : "text/css",
  "js" : "text/javascript",
  "jpg" : "image/jpg",
  "ico" : "image/jpg",
  "gif" : "image/gif",
  "pdf" : "application/pdf"
};

const getExtension = (filePath)=>{
  return filePath.substr(filePath.lastIndexOf('.')+1);
}

const returnFileContent = function(req,res,filePath){
  res.setHeader("Content-Type",contentType[getExtension(filePath)]);
  res.statusCode = 200;
  res.write(fs.readFileSync(filePath));
  res.end();
}

const  addComment = function(parsedComment){
  comments.addComment(parsedComment);
}

let app = webApp.create();

app.use(loadUser);

app.use(redirectLoggedInUserToHome);

app.use(redirectLoggedOutUserToNormalGuest);

app.use(redirectLoggedInUserToActualGuest);

app.get("/",(req,res)=>{
  returnFileContent(req,res,"./public/index.html");
});

app.get("/index.html",(req,res)=>{
  returnFileContent(req,res,"./public/index.html");
});

app.get("/Abeliophyllum.html",(req,res)=>{
  returnFileContent(req,res,"./public/Abeliophyllum.html");
});

app.get("/Ageratum.html",(req,res)=>{
  returnFileContent(req,res,"./public/ageratum.html");
});

app.get("/logedOutGuest",(req,res)=>{
  returnFileContent(req,res,'./public/normalGuest.html');
})

app.get("/actualGuest",(req,res)=>{
  returnFileContent(req,res,'./public/actualGuest.html');
})

app.post("/actualGuest",(req,res)=>{
  req.body.comment = req.body.comment.replace(/\+/g,' ');
  req.body.name = req.user.name;
  addComment(req.body);
  fs.writeFileSync('./public/comments.js',`var comments = ${JSON.stringify(comments.getComments(),null,'\t') }`);
  res.redirect("/actualGuest");
  res.end();
})

app.get("/style.css",(req,res)=>{
  returnFileContent(req,res,"./styles/style.css")
});

app.get("/favicon.ico",(req,res)=>{
  returnFileContent(req,res,"./pictures/favicon.ico");
});

app.get("/wateringPot.gif",(req,res)=>{
  returnFileContent(req,res,"pictures/wateringPot.gif");
});

app.get("/freshorigins.jpg",(req,res)=>{
  returnFileContent(req,res,"./pictures/freshorigins.jpg");
});

app.get("/pbase-Abeliophyllum.jpg",(req,res)=>{
  returnFileContent(req,res,"./pictures/pbase-Abeliophyllum.jpg");
});

app.get("/pbase-agerantum.jpg",(req,res)=>{
  returnFileContent(req,res,"./pictures/pbase-agerantum.jpg");
});

app.get("/abeliophyllum.pdf",(req,res)=>{
  returnFileContent(req,res,"./public/files/Abeliophyllum.pdf");
});

app.get("/ageratum.pdf",(req,res)=>{
  returnFileContent(req,res,"./public/files/Ageratum.pdf");
});

app.get("/comments.js",(req,res)=>{
  returnFileContent(req,res,"./public/comments.js");
})

app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
});

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/');
});

const server = http.createServer(app);

console.log(`Listening to ${port}`);

server.listen(port);
