const http = require('http');
const fs = require('fs');
const Comments = require('./js/Comments.js');
const webApp = require("./webapp.js");
const port = process.argv[process.argv.length - 1] || 8000;
let app = webApp.create();
const comments = new Comments("./database/data.json");

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

app.get("/guest.html",(req,res)=>{
  returnFileContent(req,res,"public/guest.html");
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

const server = http.createServer(app);

console.log(`Listening to ${port}`);

server.listen(port);
