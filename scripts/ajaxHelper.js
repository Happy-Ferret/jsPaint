function loadHtmlSync(url, callback) {
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    }

    request.open("GET", url, false);
    request.send();

    return (request.readyState == 4 || request.status == 200) ? request.responseText : '';
}

function includeModule(container, url) {
    container.innerHTML = loadHtmlSync(url);
}