// TDD TESTS

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
        var xml = document.getElementById("svgPartTextarea").value;
        return y2==yExpect && xml.indexOf(`y2="`+yExpect+`"`);
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
