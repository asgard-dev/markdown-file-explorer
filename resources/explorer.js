function collapseAll() {
    document.querySelectorAll("li.expandable > p").forEach(function (obj) {
        collapse(obj);
    })
}

function collapse(obj) {
    parent = obj.parentNode;
    parent.classList.add("explorer-collapsed");
    obj.setAttribute("onClick", "expand(this);");
}

function expand(obj) {
    parent = obj.parentNode;
    parent.classList.remove("explorer-collapsed");
    obj.setAttribute("onClick", "collapse(this);");
}

function expandSelected() {
    document.querySelectorAll("li.expandable > p.selectedParent").forEach(function (obj) {
        expand(obj);
    });
}

console.log("UI started.");
collapseAll();
expandSelected();