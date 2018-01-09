const fs = require('fs');
const Comment = require('./Comment.js');

let writeIntoFile = function(filePath,data){
  fs.writeFileSync(filePath,JSON.stringify(data,null,'\t'));
}

let Comments = function(dataFilePath){
  this.filePath = dataFilePath;
  this.allComments = JSON.parse(fs.readFileSync(dataFilePath,'utf8'));
}

Comments.prototype.addComment = function (parsedData) {
  let comment = new Comment(parsedData.name,parsedData.comment);
  this.allComments.unshift(comment);
  writeIntoFile(this.filePath,this.allComments);
};

Comments.prototype.map = function (mapper) {
  return this.allComments.map(mapper);
};

module.exports = Comments;
