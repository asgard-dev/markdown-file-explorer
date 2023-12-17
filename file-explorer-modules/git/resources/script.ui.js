function refresh() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // We dont need any data from it...
            location.reload();
        }
    };
    xhttp.open("GET", "/git_reload/", true);
    xhttp.send();
}