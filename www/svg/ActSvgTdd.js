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
    // TDD TEST 0 - RECT MOVE X,Y SHOULD MOVE SUBSELECTED TEXT
    function test0() {

        onStart({});

        var mt = new MoveTester({
            mover: document.getElementsByTagName("rect")[0],
            movee: document.getElementsByTagName("text")[0]
        });

        issueClick(378, 41);    updateFrames();
        issueClick(376, 92);    updateFrames();
        issueClick(364, 129);    updateFrames();
        issueClick(364, 151);    updateFrames();
        issueClick(412, 113);    updateFrames();  // rect selected last

        mt.moveBy(-300, 1);

        return mt.test();
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
        onStart({});
        issueKeyNum(1, {});
        issueClick(250, yStart);    updateFrames();
        issueClick(500, yStart);    updateFrames();
        issueKeyNum(0, {});
        issueClick(270, yStart);    updateFrames();  // propagatee

        var mt = new MoveTester({
            mover: document.getElementsByTagName("rect")[0],
            movee: document.getElementsByTagName("line")[0],
        });

        issueClick(325, 112);    updateFrames(); // rect propagator

        mt.moveBy(3, yMove);

        return mt.test();
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
    // TDD TEST 8 - MODE FOUR CLICK TWICE CREATES ROUNDED RECT
    function test8() {
        var hExpect = 66;
        var y1 = 30;
        onStart({});
        issueKeyNum(4, {}); // Rounded Rect Mode
        issueClick(30, y1);    updateFrames();
        issueClick(90, hExpect + y1);    updateFrames();

        var rects = document.getElementsByTagName("rect");
        var rect = null;
        for (var i=0; i<rects.length; i++) {
            if (rects[i].getAttribute("height") == ""+hExpect) {
                rect = rects[i];
            }
        }

        var foundXml = (document
            .getElementById("svgFullTextarea")
            .value
            .indexOf(`height="${hExpect}"`)
            >-1);
        return rect != null && foundXml;
    },
    // TDD TEST 9 - RECT MOVE X SHOULD MOVE SUBSELECTED RECT
    function test9() {
        var rect1X = 325;
        var rect2X = 30;
        var mvX = 44;
        var expectX = rect1X + mvX;
        onStart({});
        issueKeyNum(4, {}); // Rounded Rect Mode
        issueClick(rect2X, 30);    updateFrames();
        issueClick(90, 90);    updateFrames();

        issueKeyNum(0, {}); // Select Mode
        issueClick(rect1X, 112);    updateFrames();
        issueClick(rect2X, 30);    updateFrames();

        var mt = new MoveTester({
            mover: document.querySelector(`rect[x="${rect2X}"]`),
            movee: document.querySelector(`rect[x="325"]`)
        });

        mt.moveBy(mvX, 11);
        return mt.test();
    },
    // TDD TEST 10 - MODE FIVE CLICK ONCE PLACES DECISION NODE
    function test10() {
        var segLen = 7;
        var expectedP1 = {x:26, y:31};
        var expectedPoints = `${expectedP1.x} ${expectedP1.y} `;
        onStart({});
        issueKeyNum(5, {}); // Decision Mode
        issueClick(expectedP1.x+segLen, expectedP1.y);    updateFrames();

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
    // TDD TEST 11 - MODE SIX CLICK ONCE PLACES INITIAL NODE
    function test11() {
        var expectedcx = 139;
        onStart({});
        issueKeyNum(6, {}); // Decision Mode
        issueClick(expectedcx, 40);    updateFrames();

        var found = false;
        var pls = document.getElementsByTagName("circle");
        var pl = null;
        for (var i=0; i<pls.length; i++) {
            if (pls[i].getAttribute("cx").indexOf(expectedcx+"")>-1) {
                found = true;
                pl = pls[i];
            }
        }

        found &&= (document
            .getElementById("svgFullTextarea")
            .value
            .indexOf(expectedcx+"") >-1);
        return found;
    },
    // TDD TEST 12 - MODE SEVEN CLICK ONCE PLACES FINAL NODE
    function test12() {
        var expectedFill = "transparent";
        onStart({});
        issueKeyNum(7, {}); // Decision Mode
        issueClick(80, 400);    updateFrames();

        var found = false;
        var pls = document.getElementsByTagName("circle");
        var pl = null;
        for (var i=0; i<pls.length; i++) {
            if (pls[i].getAttribute("fill").indexOf(expectedFill)>-1) {
                found = true;
                pl = pls[i];
            }
        }

        found &&= (document
            .getElementById("svgFullTextarea")
            .value
            .indexOf(`r="10" fill="${expectedFill}"`) >-1);
        return found;
    },
    // TDD TEST 13 - MODE EIGHT CLICK TWICE PLACES JOIN/FORK NODE
    function test13() {
        var expectedStrokeWidth = 3;
        onStart({});
        issueKeyNum(8, {}); // Decision Mode
        issueClick(80, 400);    updateFrames();
        issueClick(150, 400);    updateFrames();

        var found = false;
        var pls = document.getElementsByTagName("line");
        var pl = null;
        for (var i=0; i<pls.length; i++) {
            if (pls[i].getAttribute("stroke-width").indexOf(expectedStrokeWidth+"")>-1) {
                found = true;
                pl = pls[i];
            }
        }

        found &&= (document
            .getElementById("svgFullTextarea")
            .value
            .indexOf(`stroke-width="${expectedStrokeWidth}"`) >-1);
        return found;
    },
    // TDD TEST 14 - MODE NINE CLICK OPENS (SINGLE-NODE) EDITOR
    function test14() {
        onStart({});
        issueKeyNum(9, {});  // text mode
        issueClick(400, 80);    updateFrames(); // sel initial node
        return window.getComputedStyle(
            document.getElementById("svgPartTextarea")
        ).visibility == "visible";
    },
    // TDD TEST 15 - CIRC MOVE X,Y SHOULD MOVE SUBSELECTED LINE
    // WITHOUT UNDEFINED ATTRIBUTES
    function test15() {
        var cX = 375;
        var lineX = 30;
        var mvX = 44;
        var expectX = lineX + mvX;
        onStart({});
        issueKeyNum(1, {}); // Line Mode
        issueClick(lineX, 30);    updateFrames();
        issueClick(lineX, 90);    updateFrames();

        issueKeyNum(0, {}); // Select Mode
        issueClick(lineX, 45);    updateFrames();
        issueClick(375, 40);    updateFrames();//initial node

        var mt = new MoveTester({
            mover: document.getElementsByTagName("circle")[0],
            movee: document.getElementsByTagName("line")[0]
        });

        mt.moveBy(mvX, -11);

        return mt.test();
    },
    // TDD TEST 16 - LINE MOVE X,Y SHOULD MOVE SUBSELECTED CIRC
    // WITHOUT UNDEFINED ATTRIBUTES
    function test16() {

        var cX = 375;
        var lineX = 33;
        var mvX = 44;
        var expectX = cX + mvX;
        onStart({});
        issueKeyNum(1, {}); // Line Mode
        issueClick(lineX, 30);    updateFrames();
        issueClick(lineX, 90);    updateFrames();

        issueKeyNum(0, {}); // Select Mode
        issueClick(cX, 40);    updateFrames();//select line
        issueClick(lineX, 45);    updateFrames();

        var mt = new MoveTester({
            mover: document.getElementsByTagName("line")[0],
            movee: document.getElementsByTagName("circle")[0]
        });

        mt.moveBy(lineX + mvX, -13);
        return mt.test();
    },
    // TDD TEST 17 - RECT MOVE X,Y TWICE SHOULD MOVE SUBSELECTED ARROW
    // WITHOUT ARROW DISAPPEARING
    function test17() {
        onStart({}); // select mode is the default mode
        issueClick(375, 52);    updateFrames();  // click polyline
        issueClick(325, 112);    updateFrames(); // click rect

        var mt = new MoveTester({
            mover: document.getElementsByTagName("rect")[0],
            movee: document.getElementsByTagName("polyline")[0]
        });

        mt.moveBy(500-325, 500-112);
        var test1 = mt.test();

        issueClick(375+(500-325), 52+(500-112));    updateFrames();  // click polyline
        issueClick(500, 500);    updateFrames(); // click rect

        var mt2 = new MoveTester({
            mover: document.getElementsByTagName("rect")[0],
            movee: document.getElementsByTagName("polyline")[0]
        });

        mt2.moveBy(400-500, 400-500);
        return test1 && mt2.test();
    },
    // TDD TEST 18 - SELECTIONS MOVE BY ARROW KEYS
    function test18() {
        onStart({});
        issueKeyNum(0, {}); // Select Mode
        var mt = new MoveTester({
            mover: document.getElementsByTagName("rect")[0],
            movee: document.getElementsByTagName("text")[0]
        });
        issueClick(378, 41);    updateFrames();
        issueClick(376, 92);    updateFrames();
        issueClick(364, 129);    updateFrames();
        issueClick(364, 151);    updateFrames();
        issueClick(412, 113);    updateFrames();  // rect selected last

        mt.expectBy(-1, -1);
        issueKeyName("left");
        issueKeyName("up");
        issueKeyName("enter");
        mt.moved = true;

        return mt.test();
    }

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
