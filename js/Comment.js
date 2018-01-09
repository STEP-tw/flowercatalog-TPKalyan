
let getCurrentDate = function(){
  let dateElements = new Date().toLocaleDateString().split("/");
  let month = dateElements[0];
  dateElements[0] = dateElements[1];
  dateElements[1] = month;
  return dateElements.join("/");
}

let getCurrentTime = function(){
  return new Date().toLocaleTimeString()
}

let Comment = function(name,comment){
  this.date = getCurrentDate();
  this.time = getCurrentTime();
  this.name = name;
  this.comment = comment;
}

module.exports = Comment;
