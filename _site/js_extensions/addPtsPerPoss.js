function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateUrlParameter(url, param, value){
    var regex = new RegExp('('+param+'=)[^\&]+');
    return url.replace( regex , '$1' + value);
}


columns = JSON.parse(getParameterByName("cols",window.location.href));
if (columns.indexOf("ptsPerPoss") === -1) {
	columns.unshift("ptsPerPoss");
	currentUrl = window.location.href;
	newUrl = updateUrlParameter(currentUrl, "cols", encodeURIComponent(JSON.stringify(columns)));
	window.location.href = newUrl;
}




