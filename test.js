
function getRedSoxRecord() {
  $.getJSON('http://anyorigin.com/go?url=https%3A//www.baseball-reference.com/teams/BOS/2018.shtml&callback=?.html', function(data){
    return data.contents;
  });
}

window.rawHtml = getRedSoxRecord();
/*
text = "<p>
  <strong>Record:</strong>
  86-35,
";

*/