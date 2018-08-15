
function getRedSoxRecord() {
  $.getJSON('http://anyorigin.com/go?url=https%3A//www.baseball-reference.com/teams/BOS/2018.shtml&callback=?', function(data){
    
    blob = data.contents.substring(data.contents.search("<strong>Record:</strong>"), data.contents.search("<strong>Record:</strong>")+50);
    blob = blob.substring(0, blob.search(","));
    blob = blob.replace("<strong>Record:</strong>", "").trim()
    return blob;
  });
}

window.rawHtml = getRedSoxRecord();
/*
text = "<p>
  <strong>Record:</strong>
  86-35,
";

*/