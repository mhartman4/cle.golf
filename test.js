
function getRedSoxRecord() {
  $.getJSON('baseballref.html', function(data){
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