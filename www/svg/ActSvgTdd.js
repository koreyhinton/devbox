// TDD TESTS
// Important Note: if a new test unexpectedly fails
//     Then try moving the node further away from the other nodes
//     (nodes should never overlap)
// Another error: (if this happens then likely you used the wrong function;
// addscalarr should only be utilized on a src multi-data attribute like points)
//     Uncaught TypeError: Cannot read properties of null (reading 'attrs')
//     at setcolor
//     at onDone
//     at onApplyEdits
tddTests = [
    // TDD TEST 0 - RECT MOVE X SHOULD MOVE SUBSELECTED TEXT
    function test0() {
        onStart({});
        var x = parseInt(document.getElementsByTagName("text")[0].getAttribute("x"));
        issueClick(378, 41);    updateFrames();
        issueClick(376, 92);    updateFrames();
        issueClick(364, 129);    updateFrames();
        issueClick(364, 151);    updateFrames();
        issueClick(412, 113);    updateFrames();
        var ta = document.getElementById("svgPartTextarea");
        var oldX = 325;
        var newX = 25;
        ta.value = ta.value.replace(""+oldX, ""+newX);
        onApplyEdits();
        // console.log(document.getElementById("svgId"));
        var affectedX = parseInt(document.getElementsByTagName("text")[0].getAttribute("x"));
        return (oldX - newX) == (x - affectedX);
    },
    // TDD TEST 1 - CLICK WHITESPACE BEYOND TEXT SHOULD SELECT SURROUNDING RECT
    function test1() {
        onStart({});
        var x = parseInt(document.getElementsByTagName("text")[0].getAttribute("x"));
        issueClick(411, 129);    updateFrames();
        var rectStrokeColor = document.getElementsByTagName("rect")[0].getAttribute("stroke");
        // rect should be highlighted not the text
        return rectStrokeColor.toUpperCase() == editColor;
    },
    // TDD TEST 2 - MODE TWO CLICK TWICE CREATES LINE
    function test2() {
        onStart({});
        var yExpect = 519;
        var x = parseInt(document.getElementsByTagName("text")[0].getAttribute("x"));
        issueKeyNum(1, {});
        issueClick(25, 25);    updateFrames();
        issueClick(25, yExpect);    updateFrames();
        var y2 = parseFloat(document.getElementsByTagName("line")[0].getAttribute("y2"));
        var xml = document.getElementById("svgFullTextarea").value;
        return y2==yExpect && (xml.indexOf(`y2="${yExpect}"`) >-1);
    },
    // TDD TEST 3 - MODE 0 CAN CLICK TO SELECT LINE
    function test3() {
        onStart({});
        issueKeyNum(1, {});
        issueClick(25, 25);    updateFrames();
        issueClick(250, 25);    updateFrames();
        issueKeyNum(0, {});
        issueClick(50, 25);    updateFrames();
        var lineStrokeColor = document
            .getElementsByTagName("line")[0]
            .getAttribute("stroke");
        return lineStrokeColor.toUpperCase() == editColor;
    },
    // TDD TEST 4 - MODE 0 CAN MOVE LINE SUBSELECTION
    function test4() {
        var yStart = 164;
        var yMove = -33;
        var yExpect = yStart + yMove;
        onStart({});
        issueKeyNum(1, {});
        issueClick(250, yStart);    updateFrames();
        issueClick(500, yStart);    updateFrames();
        issueKeyNum(0, {});
        issueClick(270, yStart);    updateFrames();  // propagatee

        function nonTestSel() {
            // these selections are only done for it to make sense visually.
            // visually everything should look to be connected together,
            // moved up to be located at frame-top
            issueClick(333, 134);    updateFrames();
            issueClick(333, 154);    updateFrames();
            issueClick(375, 52);    updateFrames();
            issueClick(375, 40);    updateFrames();
        }
        nonTestSel();

        issueClick(325, 112);    updateFrames(); // propagator

        var ta = document.getElementById("svgPartTextarea");
        ta.value = ta.value.replace("112", (112+yMove)+"");

        onApplyEdits();

        var y2 = parseFloat(
            document
                .getElementsByTagName("line")[0]
                .getAttribute("y2")
        );
        return y2 == yExpect;
    },
    // TDD TEST 5 - SWIMLANE SELECT DO NOT PRIORITIZED OVER INNER COMPONENTS
    function test5() {
        onStart({});
        issueKeyNum(3, {}); // Rect Mode
        issueClick(10,10);    updateFrames();
        issueClick(300,500);    updateFrames();
        issueKeyNum(1, {}); // Line Mode
        issueClick(15,15);    updateFrames();
        issueClick(295,15);    updateFrames();
        issueKeyNum(0, {}); // Select Mode
        issueClick(20,15);     updateFrames(); // click on line
        var lineStrokeColor = document.getElementsByTagName("line")[0].getAttribute("stroke");
        // line should be highlighted not the swimlane rect
        console.log(lineStrokeColor);
        return lineStrokeColor.toUpperCase() == editColor;
    },
    // TDD TEST 6 - DE-SELECTING ALL NODES SHOULD HIDE THE (SINGLE-NODE) EDITOR
    function test6() {
        onStart({});
        issueClick(378, 41);    updateFrames(); // sel initial node
        issueClick(377, 70);    updateFrames(); // sel arrow
        issueClick(377, 70);    updateFrames(); // de-sel arrow
        issueClick(378, 41);    updateFrames(); // de-sel initial node
        return window.getComputedStyle(
            document.getElementById("svgPartTextarea")
        ).visibility == "hidden";
    },
    // TDD TEST 7 - MODE TWO CLICK TWICE CREATES ARROW
    function test7() {
        var expectedP1 = {x:15, y:15};
        var inputP2 = {x:18, y:100}; // slight offset gets corrected 18->15
        var expectedP2 = {x:15, y:100};
        var expectedP3 = {x: expectedP2.x-10, y: expectedP2.y-10};
        var expectedP4 = expectedP2;
        var expectedP5 = {x: expectedP2.x+10, y: expectedP2.y-10};;
        var expectedPoints = `${expectedP1.x} ${expectedP1.y} ${expectedP2.x} ${expectedP2.y} ${expectedP3.x} ${expectedP3.y} ${expectedP4.x} ${expectedP4.y} ${expectedP5.x} ${expectedP5.y}`;
        onStart({});
        issueKeyNum(2, {}); // Arrow Mode
        issueClick(expectedP1.x, expectedP1.y);    updateFrames();
        issueClick(inputP2.x, inputP2.y);    updateFrames();
        
        var found = false;
        var pls = document.getElementsByTagName("polyline");
        var pl = null;
        for (var i=0; i<pls.length; i++) {
            if (pls[i].getAttribute("points").indexOf(expectedPoints)>-1) {
                found = true;
                pl = pls[i];
            }
        }
        found &&= (document
            .getElementById("svgFullTextarea")
            .value
            .indexOf(expectedPoints) >-1);
        return found;
    },
];

function tddTestMsg(pass) {
    var pad = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var el = notifyMsg(
        pass?pad+"PASS"+pad:pad+"FAIL"+pad,
        pass?null:"rgba(255,0,0,0.6)"
    );
}

// RUN TDD
addEventListener('DOMContentLoaded', (e) => {
    var testNo = new URL(location.href).searchParams.get("tdd");
    var freeze = false;
    if (testNo == null) {
        testNo = new URL(location.href).searchParams.get("tddf");
        if (testNo == null) return;
        freeze = true;
    }
    testNo = parseInt(testNo);
    if (testNo >= tddTests.length) { return; }
    setTimeout(function() {
        // RUN TDD - CURRENT TEST
        var pass = tddTests[testNo]()
        tddTestMsg(pass);
        if (freeze || !pass) {return;}
        setTimeout(function() {
            var newUrl = location.href.replace("?tdd="+testNo,"?tdd="+(testNo+1));
            location.href = newUrl;
        }, 700);
    }, 200);
});
