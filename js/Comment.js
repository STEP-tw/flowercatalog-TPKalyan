
let getCurrentDate = function(){
  return new Date().toDateString();
}

let getCurrentTime = function(){
  return new Date().toLocaleTimeString();
}

let Comment = function(name,comment){
  this.date = getCurrentDate();
  this.time = getCurrentTime();
  this.name = name;
  this.comment = comment;
}

module.exports = Comment;
