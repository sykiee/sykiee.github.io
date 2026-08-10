$(function () {

    $("#status").draggable({
        containment: "window"
    });


    $("#resetStatus").click(function () {

        $("#status").css({
            left: "55%",
            top: "30%"
        });

    });

});