function loadHtmlSync(url, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();

    return (xmlhttp.readyState == 4 || xmlhttp.status == 200) ? xmlhttp.responseText : '';
}

function includeModule(container, url) {
    container.innerHTML = loadHtmlSync(url);
}