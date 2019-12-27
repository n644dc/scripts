var bombId = 0;
var basePosition;


var crosshair = {};
crosshair.left = 0;
crosshair.top = 0;

$(function () {
    basePosition = $("#baseStation").offset();
});

$(document).mousemove(function (e) {
    crosshair.left = e.pageX;
    crosshair.top = e.pageY;
});

$(document).click(function () {
    bombId++;
    fireMissile(bombId+"bomb");
});

createMissile = function (bombId) {
    $("body").append("<div id='" + bombId + "' class='missile'></div>");
    var o = {
        left: basePosition.left,
        top: basePosition.top
    };

    $("#" + bombId).offset(o);
}

fireMissile = function (bombId) {

    var x = basePosition.left;
    var y = basePosition.top;
    var m = (crosshair.top - basePosition.top) / (crosshair.left - basePosition.left);
    var b = (y - (m * x));
    var targetY = crosshair.top;
    createMissile(bombId);

    var missileTimer = setInterval(function () {
        var o = { left: (y - b) / m, top: y };

        $("#" + bombId).offset(o);

        if (hit("#" + bombId)) {
            clearInterval(missileTimer);
            $("#" + bombId).remove();
            $("#target1").css("backgroundColor", "blue");
        } else {
           // $("#target1").css("backgroundColor", "red");
            console.log("naj"); //$("#target1")
        }
        
        if (y <= targetY) {
            //clearInterval(missileTimer);
            //Target Miss
            $("#target1").css("backgroundColor", "blue");
            $("#" + bombId).remove();
        }
        y = y - 4;
    }, 30);
}

hit = function (m) {
    var missile = $(m).offset();
    var targetPos = $("#target1").offset();
    targetPos.height = $("#target1").height();
    targetPos.width = $("#target1").width();

    if ((missile.top >= targetPos.top && missile.top <= (targetPos.top + targetPos.height)) &&
             (missile.left >= targetPos.left && missile.left <= (targetPos.left + targetPos.width))) {
        return true;
    } else {
        return false;
    }
}