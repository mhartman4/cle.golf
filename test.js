
function getRedSoxRecord() {
  $.getJSON('http://anyorigin.com/go?url=https%3A//www.baseball-reference.com/teams/BOS/2018.shtml&callback=?', function(data){
    console.log(data.contents);
  });
}

getRedSoxRecord();


