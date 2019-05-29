var items = [];
function drawInstruction() {
    $("#" + currentID).append("<!-- Draggable DIV -->"+
        "<div class='ins' id='ins" + currentID + "'>"+
            "<div class='insheader' id='insheader" + currentID + "'>"+
                '<button type="button" class="btn btn-light btn-sm insback" id="insback'+ currentID + '"> < </button>' +
                '<button type="button" class="btn btn-light btn-sm insclose" id="insclose'+ currentID + '"> X </button>' +
            "</div>"+
        "</div>"+
        '<button type="button" class="btn btn-primary btn-lg insbut" id="insbut' + currentID + '">Node Detail</button>'
    )
    $("#ins" + currentID).draggable({containment: "parent"});
    $("#insbut" + currentID).draggable({containment: "parent", cancel:false});

    $("#ins" + currentID).position({
        my: "left top",
        at: "left+50 top+50",
        of: "#" + currentID
    });

    $("#insbut" + currentID).position({
        my: "left top",
        at: "left top",
        of: "#ins" + currentID
    });


    $.getJSON( "src/data/ins.json", function( data ) {
        items = []
        $.each( data, function( i , row ) {
            if(row["count"] == 1) {
                items.push( "<li value=" + i + " class='list-group-item disabled' style='background-color:" + hexToRGB(color(row["level"]), 0.4) + " '>" + row["name"] + " (" + row["count"] + ")" + "</li>" );
            } else {
                items.push( "<li value=" + i + " class='list-group-item' style='background-color:" + hexToRGB(color(row["level"]), 0.4) + " '>" + row["name"] + " (" + row["count"] + ")" + "</li>" );
            }
        });
        $( "<ul/>", {
            "class": "list-group",
            "id": "list" + currentID,
            html: items.join( "" )
        }).appendTo( "#ins" + currentID );
    });

    instDict[currentID] = {"close": false, "clicked": false};
}

$(document).on('click', '.insbut', function(){
    $("#ins" + currentID).position({
        my: "left top",
        at: "left top",
        of: "#insbut" + currentID
    });
    $("#insbut"+currentID).css("visibility", "hidden");
    $("#ins"+currentID).css("visibility", "visible");
    if(instDict[currentID]["clicked"]) {
        $("#insback"+currentID).css("visibility", "visible");
    }
    instDict[currentID]["close"] = false;
})

$(document).on('click', '.insback', function(){
    instDict[currentID]["clicked"] = false;
    $("#insback"+currentID).css("visibility", "hidden");

    $("#list"+currentID).remove();

    $( "<ul/>", {
        "class": "list-group",
        "id": "list" + currentID,
        html: items.join( "" )
    }).appendTo( "#ins" + currentID );
});

$(document).on('click', '.insclose', function(){
    $("#ins"+currentID).css("visibility", "hidden");
    $("#insback"+currentID).css("visibility", "hidden");
    $("#insbut"+currentID).css("visibility", "visible");
    instDict[currentID]["close"] = true;
    $("#insbut" + currentID).position({
        my: "left top",
        at: "left top",
        of: "#ins" + currentID
    });
});

$(document).on('click', '.list-group-item', function(){

    if($(this).hasClass("disabled")){
        return;
    }
    if(!instDict[currentID]["clicked"]){

        var current = instData[$(this).attr('value')]
        var detail = current["data"];
        $("#list"+currentID).remove();
        var tmp = []
        $.each( detail, function( i, row ) {
            tmp.push( "<li class='list-group-item' style='background-color:" + hexToRGB(color(current["level"]), 0.4) + " '>" + row + "</li>" );
        });
        $( "<ul/>", {
            "class": "list-group",
            "id": "list" + currentID,
            html: tmp.join( "" )
        }).appendTo( "#ins" + currentID );
        $("#insback"+currentID).css("visibility", "visible");
        instDict[currentID]["clicked"] = true;
    } else {
        var current = $(this).text()
        d3.selectAll(".node" + currentID).style("opacity", 0.2);
        d3.selectAll("." + currentID + current).style("opacity", 1);
    }

});
