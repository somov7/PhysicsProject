function updateHTML() {
    let inCur = document.getElementById('inputCurrent');
    let inOption = inCur.options[inCur.selectedIndex].value;
    if (inOption === "direct")
        document.getElementById('inputFrequencyWrap').setAttribute("hidden", "hidden");
    else
        document.getElementById('inputFrequencyWrap').removeAttribute("hidden");
}

let canvasHover = false;

canv.onmouseover = function (e) {
    canvasHover = true;
};

canv.onmouseout = function (e) {
    canvasHover = false;
};