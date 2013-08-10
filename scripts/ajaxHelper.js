function loadXMLDoc(url, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (callback) {
                callback(xmlhttp.responseText);
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function loadModule(container, url, callback) {
    loadXMLDoc(url, function (data) {
        container.innerHTML = data;
        if (callback) {
            callback();
        }
    });
}