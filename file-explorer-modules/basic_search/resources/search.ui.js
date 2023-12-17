function prepareSearchForm() {
    document.querySelector("#searchbutton").setAttribute("onClick", "postSearch();");
    document.querySelector("#searchquery").onkeydown = function (e) {
        e = e || window.event;
        switch (e.which || e.keyCode) {
              case 13 : // (13 is ascii code for 'ENTER')
                  postSearch();
        }
    }

    var query = /search\/(.*)/.exec(window.location.href);

    if(query !== null) {
        document.querySelector("#searchquery").value = query[1];
    }
}

function postSearch() {
    var query = document.querySelector("#searchquery").value;
    window.location.href = "/search/" + query;
}

prepareSearchForm();