const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const Comments = require('./js/Comments.js');
const port = 8000;
let comments = new Comments("./database/data.json");

let contentType = {
  "html" : "text/html",
  "txt" : "text/plain",
  "css" : "text/css",
  "js" : "text/javascript",
  "jpg" : "image/jpg",
  "ico" : "image/jpg",
  "gif" : "image/gif"
};

let folder = {
  "js" : "/js",
  "html" : "/public",
  "htm" : "/public",
  "css" : "/styles",
  "jpg" : "/pictures",
  "gif" : "/pictures",
  "ico" : "/pictures"
}

let specialPages = ["/public/submit","/public/guest"];

let isSpecial = function(pageName){
  return specialPages.includes(pageName);
}

let createRow = function(comment){
  let row = "<tr>";
  for (var key in comment) {
    row += "<td>"+comment[key]+"</td>";
  }
  return row+"</tr>"
}

let getRows = function(){
  return comments.map(createRow).join("\n");
}

let extractUserEnteredData = function(fileLocation){
  let enteredDetails = fileLocation.split('?')[1];
  return querystring.parse(enteredDetails);
}

let addComment = function(parsedComment){
  comments.addComment(parsedComment);
}

let getExtension = function(fileName){
  let startIndex = fileName.lastIndexOf('.')+1;
  return fileName.substr(startIndex,4);
}

let insertRows = function(fileName,rows){
  try {
    let file = fs.readFileSync(fileName);
    let startingPart = file.slice(0,file.indexOf('</table>'));
    let endingPart = file.slice(file.indexOf('</table>'));
    return startingPart +rows+ endingPart;
  } catch (e) {
    console.log(fileName+" not found");
  }
}

let getFileInfo = function(fileLocation){
  let fileInfo = {};
  let date = new Date();
  let currentTime = date.toLocaleTimeString();
  let currentDate = date.toLocaleDateString();
  try {
    fileInfo.logFile = "./logs/log.txt";
    fileInfo.message = `Requested for ${fileLocation} on ${currentDate} at ${currentTime}`;
    fileInfo.fileContent = fs.readFileSync('.'+fileLocation);
    fileInfo.contentType = contentType[getExtension(fileLocation)]
    fileInfo.statusCode = 200;
  } catch (e){
    fileInfo.logFile = "./logs/errors.txt";
    fileInfo.message = `${fileLocation} is not found. Requested on ${currentDate} at ${currentTime}`;
    fileInfo.fileContent = fs.readFileSync('./public/fileNotFound.html');
    fileInfo.contentType = contentType["html"];
    fileInfo.statusCode = 404;
  }
  return fileInfo;
}

let logIntoFile = function(logFile,logMessage){
  fs.appendFileSync(logFile,logMessage+"\n");
}

let handleSubmitRequest = function(req,res,fileLocation){
  let parsedComment = extractUserEnteredData(fileLocation);
  addComment(parsedComment);
  res.writeHead(302,{"Location":"/guest.html"});
  res.end();
}

let handleGuestRequest = function(req,res){
  let guestPageWithComments = insertRows("./public/guest.html",getRows());
  res.write(guestPageWithComments);
  res.end();
}

let handleFileRequest = function(req,res,fileLocation){
  fileInfo = getFileInfo(fileLocation);
  logIntoFile(fileInfo.logFile,fileInfo.message);
  res.setHeader("Content-Type",fileInfo.contentType);
  res.statusCode = fileInfo.statusCode;
  res.write(fileInfo.fileContent);
  res.end();
}

let requestHandlers = {
  "/public/submit" : handleSubmitRequest,
  "/public/guest" : handleGuestRequest,
  "normal" : handleFileRequest
}

let handleRequest = function(req,res){
  let date = new Date();
  let currentTime = date.toLocaleTimeString();
  let currentDate = date.toLocaleDateString();
  let url = (req.url == "/") ? "/index.html" : req.url;
  let fileLocation = folder[getExtension(url)] + url;
  console.log(`Requested for ${fileLocation} on ${currentDate} at ${currentTime}`);
  console.log(`Method : ${req.method}`);
  console.log("-------------------------------------------------");
  let pageName = fileLocation.substr(0,fileLocation.indexOf("."));
  pageName = isSpecial(pageName) ? pageName : "normal";
  requestHandlers[pageName](req,res,fileLocation);
}

let server = http.createServer(handleRequest);

console.log(`Listening to ${port}`);

server.listen(port);
