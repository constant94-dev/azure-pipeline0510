var focusedElement;
var focusedElementCenterX;
var focusedElementCenterY;
var x1;
var x2;
var y1;
var y2;
var similarDistance;
var closestElementName;
var closestElement;
var values = [];
var d;
var topPos;
var bottomPos;
var leftPos;
var rightPos;
var centerXPos;
var centerYPos;
var focusedElementTopPos;
var focusedElementBottomPos;
var focusedElementLeftPos;
var focusedElementRightPos;
var focusedElementClass;
var focusedElementIndex;

var refs = document.querySelectorAll('a, button, [tabindex="1"]');
function focusedFunction() {
    focusedElement = document.activeElement;
    var focusedElementClassList = document.activeElement.classList;
    var focusedElementClasses;
    for (var i = 0; i < focusedElementClassList.length; i++) {
        focusedElementClasses = focusedElementClassList[i];
        if (focusedElementClasses.slice(0, 13) == 'focus-element') {
            focusedElementClass = focusedElementClasses.toString();
        }
    }
    focusedElementIndex = focusedElementClass.slice(14);
    focusedElementCenterX = values[focusedElementIndex][1];
    focusedElementCenterY = values[focusedElementIndex][2];
    focusedElementTopPos = values[focusedElementIndex][3];
    focusedElementBottomPos = values[focusedElementIndex][4];
    focusedElementLeftPos = values[focusedElementIndex][5];
    focusedElementRightPos = values[focusedElementIndex][6];
}
function keydownEvent(e) {
    if(keydownChecker){
        keydownChecker = false;
        var distanceArray = [];
        var result = [];
        switch (e.keyCode) {
            case 37:
                result = values.filter(function (value) {
                    return value[1] < focusedElementCenterX && value[2] > focusedElementTopPos && value[2] < focusedElementBottomPos;
                });
                break
            case 38:
                result = values.filter(function (value) {
                    return value[2] < focusedElementCenterY && value[1] > focusedElementLeftPos && value[1] < focusedElementRightPos;
                });
                break
            case 39:
                result = values.filter(function (value) {
                    return value[1] > focusedElementCenterX && value[2] > focusedElementTopPos && value[2] < focusedElementBottomPos;
                });
                break
            case 40:
                result = values.filter(function (value) {
                    return value[2] > focusedElementCenterY && value[1] > focusedElementLeftPos && value[1] < focusedElementRightPos;
                });
                break
        }
        if (result.length > 0) {
            x1 = focusedElementCenterX;
            y1 = focusedElementCenterY;
            for (var j = 0; j < result.length; j++) {
                x2 = parseInt(result[j][1]);
                y2 = parseInt(result[j][2]);
                similarDistance = ((x1 - x2)*(x1 - x2))+((y1 - y2)*(y1 - y2));
                distanceArray[j] = [result[j][0], similarDistance];
            }
            distanceArray = distanceArray.filter(function (a){
                return a[0] != focusedElementClass;
            });
            distanceArray = distanceArray.sort(function (a,b){
                return a[1]-b[1];
            });
            closestElementName = distanceArray[0][0];
            closestElement = document.querySelector('.' + closestElementName);
            closestElement.focus();
            keydownChecker = true;
        } else {
            keydownChecker = true;
        }

    }
}
for (var i = 0; i < refs.length; i++) {
    refs[i].classList.add('focus-element-'+i);
    d = document.querySelector('.focus-element-' + i).getBoundingClientRect();
    topPos = d.top;
    bottomPos = d.bottom;
    leftPos = d.left;
    rightPos = d.right;
    centerXPos = (leftPos + rightPos)/2;
    centerYPos = (topPos + bottomPos)/2;
    values[i] = ['focus-element-' + i, centerXPos, centerYPos, topPos, bottomPos, leftPos, rightPos];
    if(i == refs.length-1){
        focusedFunction();
    }
}
document.addEventListener('keydown',keydownEvent);
document.addEventListener('focus',focusedFunction,true);