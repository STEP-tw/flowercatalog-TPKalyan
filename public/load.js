let writeComments = function(){
  let table = document.getElementById("comments");
  comments.forEach(function(comment){
    let row = document.createElement('tr');
    let keys = Object.keys(comment);
    keys.forEach(function(key){
      let data = document.createTextNode(comment[key]);
      let td = document.createElement('td');
      td.appendChild(data)
      row.appendChild(td);
    });
    table.appendChild(row);
  });
}
