function getElement(name) {
    return document.getElementById(name);
}

function elementIsClass(element, className) {
    var elementClasses = element.className.split(' ');

    for (var i = 0; i < elementClasses.length; i++)
        if (elementClasses[i] == className)
            return true;

    return false;
}