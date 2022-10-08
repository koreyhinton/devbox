// ACTIVITY SVG
svgBaseNode = {attrs:[]};
svgNodes = [];
curIds = []; // { x:-1, y:-1 };
cacheNd = {attrs:[]};
// todo: custom cursor to help w/ selection precision of lines
// todo: add in template links in footer to pre-load examples (ie: swimlanes)
                            // todo: should optionally allow reconfiguring to
                            //       have a much larger image area?
selColor = "#C0D6FC";
editColor = "#CAFFB5";

numMode = 0;
clickCnt = 0;
drawClick = { x:-1, y: -1 };
notifyTextArr = [
    "0 =&gt; Select Mode",
    "1 =&gt; Line Mode",
    "2 =&gt; Arrow Mode",
    "3 =&gt; Rect Mode",
    "4 =&gt; Rounded Rect Mode",
    "5 =&gt; Decision Node Mode",
    "6 =&gt; Initial Node Mode",
    "7 =&gt; Final Node Mode",
    "8 =&gt; Fork/Join Node Mode",
    "9 =&gt; Text Mode"
];


var svgHead=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="750" height="750" viewBox="0,0,750,750">`;
var svgEx = `
    <circle cx="375" cy="39" r="10" fill="black" stroke="black" stroke-width="1"/>
    <polyline points="375 52 375 110 365 100 375 110 385 100" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="10" ry="10" x="325" y="112" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"/>
    <text x="333" y="134" fill="black">Receive</text>
    <text x="333" y="154" fill="black">Request</text>
`;
var svgTrail = `
</svg>
`; // cy=40 -> cy=39 fix: // TDDTEST0 FIX

function notifyMsg(htmlMsg, styleBG) {
    var notifyMd = document.createElement("div");
    notifyMd.style.backgroundColor=(styleBG==null)?"rgba(0,255,0,0.6)":styleBG;
    notifyMd.style.color="white";
    notifyMd.style.position="fixed";
    notifyMd.style.right="0";
    notifyMd.style.top="0";
    notifyMd.style.fontSize="78px";
    notifyMd.innerHTML = htmlMsg;
    document.body.appendChild(notifyMd);
    setTimeout(function(){notifyMd.remove();}, 3000);
    return notifyMsg;
}

function setNumMode(num, test) {
    numMode = num;
    var active = document.getElementsByClassName("active");
    while (active.length > 0) {
        active[0].classList.remove("active");
    }
    document.getElementById("btn"+num).classList.add("active");
    if (test == null) {
        notifyMsg(notifyTextArr[num]);
    }
}

// ATTRIBUTE ACCESS FUNCTIONS
function setcolor(nd, color) {
    // console.warn(nd);
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            //attr.value = color;
            nd.attrs[i].value = color;
            break;
        }
    }
}
function getcolor(nd) {
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            return attr.value;
        }
    }
    return "#FF0000";
}

function getscal(attrs, name) {
    // returns scalar value for attribute name
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            return parseFloat(attrs[i].value);
        }
    }
    return -999;
}

function addscal(nd, name, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            nd.attrs[i].value = (parseFloat(nd.attrs[i].value)+scalar)+"";
            break;
        }
    }
}

function getscalarr(attrs, name, query) {
    // returns array of scalar value
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            var strs = attrs[i].value.split(/[ ,]+/);
            var arr = [];
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strs.length; j+=inc) {
                arr.push(parseFloat(strs[j]));
            }
            return arr;
        }
    }
    return [];
}

function addscalarr(nd, name, query, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            var strsRd = nd.attrs[i].value.split(/[ ,]+/);
            var strsWrt = nd.attrs[i].value.split(/[ ,]+/);
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strsRd.length; j+=inc) {
                strsWrt[j] = parseFloat(strsRd[j]) + scalar;
            }
            nd.attrs[i].value = strsWrt.join(' ');
            break;
        }
    }
}

// SET CLICK RECTANGLE FUNCTION
function setMouseRects(nd) {
    if (nd.tagName.toLowerCase() == "circle") {
        var cx = getscal(nd.attrs, "cx");
        var cy = getscal(nd.attrs, "cy");
        var r = getscal(nd.attrs, "r");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = cx - r - strokeWidth;
        nd.xmax = cx + r + strokeWidth;
        nd.ymin = cy - r - strokeWidth;
        nd.ymax = cy + r + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "polyline") {
        var xs = getscalarr(nd.attrs, "points", "even");
        var ys = getscalarr(nd.attrs, "points", "odd");
        for (var i=0; i<xs.length; i++) {
            var val = xs[i];
            if (nd.xmin == null) { nd.xmin = val; }
            else if (nd.xmin > val) { nd.xmin = val; }
            if (nd.xmax == null) { nd.xmax = val; }
            else if (nd.xmax < val) { nd.xmax = val; }
        }
        for (var i=0; i<ys.length; i++) {
            var val = ys[i];
            if (nd.ymin == null) { nd.ymin = val; }
            else if (nd.ymin > val) { nd.ymin = val; }
            if (nd.ymax == null) { nd.ymax = val; }
            else if (nd.ymax < val) { nd.ymax = val; }
        }
    }
    if (nd.tagName.toLowerCase() == "rect") {
        var x = getscal(nd.attrs, "x");
        var y = getscal(nd.attrs, "y");
        var width = getscal(nd.attrs, "width");
        var height = getscal(nd.attrs, "height");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = x - strokeWidth;
        nd.xmax = x + width + strokeWidth;
        nd.ymin = y - strokeWidth;
        nd.ymax = y + height + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "text") {
        var x = getscal(nd.attrs, "x");
        var y = getscal(nd.attrs, "y");
        nd.xmin = x;
        nd.xmax = x + (10*nd.text.length); // TDDTEST1 FIX
        nd.ymin = y - 10;//12;
        nd.ymax = y + 5;//12;//25;
    }
    if (nd.tagName.toLowerCase() == "line") { // TDDTEST3 FTR
        var x1 = getscal(nd.attrs, "x1");
        var y1 = getscal(nd.attrs, "y1");
        var x2 = getscal(nd.attrs, "x2");
        var y2 = getscal(nd.attrs, "y2");
        nd.xmin = x1 - 1;
        nd.xmax = x2 + 1;
        nd.ymin = y1 - 1;
        nd.ymax = y2 + 1;
    }
}

// ARRAY ALGORITHM FUNCTION
// Text nodes MUST be first in the array in order to
// ensure text in a box gets prioritized on the click
// over the surrounding rectangle
function sortSvgNodes() {
    function swimLane(nd) { // TDDTEST5 FTR
        return (
            nd.tagName.toLowerCase() == "rect" &&
            ((nd.xmax - nd.xmin) > 200) &&
            ((nd.ymax - nd.ymin) > 300)
        );
    }
    var newArray = [];
    // text nodes go first
    for (var i=0; i<svgNodes.length; i++) {
        if (svgNodes[i].tagName.toLowerCase() == "text") {
            newArray.push(svgNodes[i]);
        }
    }
    for (var i=0; i<svgNodes.length; i++) {
        if (svgNodes[i].tagName.toLowerCase() != "text") {
            if (swimLane(svgNodes[i])) { continue; } // TDDTEST5 FTR
            newArray.push(svgNodes[i]);
        }
    }
    for (var i=0; i<svgNodes.length; i++) { // TDDTEST5 FTR
        if (swimLane(svgNodes[i])) {
            newArray.push(svgNodes[i]);
        }
    }
    svgNodes = newArray;
}
// CONVERSIONS

// https://stackoverflow.com/a/17411276
function rotate(cx, cy, x, y, angle) { // TDDTEST7
    var rad = (Math.PI / 180) * angle;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var pt = {};
    pt.x = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    pt.y = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return pt;
}

function arrowPoint(pt1, pt2, deg, len, sign) {  // TDDTEST7
    var m = /*rise/run*/ (pt2.y-pt1.y)/(pt2.x-pt1.x);
    var b = pt2.y - m*pt2.x;
    var dir = 1;
    if (pt2.x > pt1.x) {
        dir = -1;
    }
    pt1.x = pt2.x;//todo:check
    pt1.x += (dir)*1;
    pt1.y = m*pt1.x + b;
    var d = Math.sqrt( (pt2.x - pt1.x)*(pt2.x - pt1.x) +
        (pt2.y - pt1.y)*(pt2.y - pt1.y));
    var maxIter = 30; var i = 0;
    while (d < len) {
        pt1.x += (dir)*1;
        pt1.y = m*pt1.x + b;
        d = Math.sqrt( (pt2.x - pt1.x)*(pt2.x - pt1.x) +
            (pt2.y - pt1.y)*(pt2.y - pt1.y));
        i += 1;
        if (i>maxIter) {console.warn("max iter"); break;}
    }
    return rotate(pt2.x,pt2.y, pt1.x, pt1.y, sign*deg);
}

function nds2xml(nds) {
    var xml = nd2xml(svgBaseNode);
    xml = xml.substring(0, xml.length -2);
    xml += ">"+`
`;
    for (var i=0; i<svgNodes.length; i++) {
        xml += "    "+nd2xml(svgNodes[i])+`
`;
    }
    xml += "</svg>";
    return xml;
}

function nd2xml(nd, colorOverride) {
    var xml = "<" + nd.tagName;
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        // this is tricky: in the 1 case where a component gets loaded from
        // the active selected node that stroke color (selColor) should not
        // be included in the edit. So use cacheColor instead.
        var textOverride = (
            nd.tagName.toLowerCase() == "text" &&
            attr.name == "fill" &&
            colorOverride != null
        );
        var strokeOverride = (
            !textOverride &&
            (colorOverride != null && nd.attrs[i].name == "stroke")
        );
        if (strokeOverride || textOverride) {
            //for (var j=0; j<nd.attrs.length; j++) {
                //if (nd.attrs[j].name == "stroke") {
                    nd.attrs[i].value = colorOverride;
                    console.log("OVERRIDE", colorOverride);
                //}
            //}
        }
        xml += (" "+ attr.name + "=" + `"` + attr.value + `"`);
    }
    if (nd.tagName.toLowerCase() == "text") {
        xml += (">" + nd.text + "</text>");
    } else {
        xml += "/>";
    }
    return xml;
}

function xy2nd(x, y) {
    var nd = null;
    for (var i=0; i<svgNodes.length; i++) {
        var svgNd = svgNodes[i];
        // console.log(x,y,svgNd.xmin, svgNd.ymin, svgNd.xmax, svgNd.ymax);
        if ((x >= svgNd.xmin)
        && (x <= svgNd.xmax)
        && (y >= svgNd.ymin)
        && (y <= svgNd.ymax)) {
            nd = svgNd;
            break;
        }
    }    
    return nd;
}

function xdom2nd(xdomNd, nd) {
    var push = false;
    if (nd.attrs == null) { console.log("push"); nd.attrs = []; push = true;} // var nd = {attrs:[]}
    for (var i=0; i<xdomNd.attributes.length; i++) {
        if (!push) {
            push = true;
            for (var j=0; j<nd.attrs.length; j++) {
                if (nd.attrs[j].name == xdomNd.attributes[i].nodeName) {
                    push = false;
                    nd.attrs[j].value = xdomNd.attributes[i].nodeValue;
                    break;
                }
            }
        }
        if (push) {
            nd.attrs.push({
                name: xdomNd.attributes[i].nodeName,
                value: xdomNd.attributes[i].nodeValue
            });
        }
    }
    nd.tagName = xdomNd.tagName;
    if (nd.tagName == "text") {
        nd.text = xdomNd.innerHTML;
    }
    //nd.cacheColor = cacheColor;
    return nd;
}

// This function requires an updateFrames call in order to
// get this new node to show up in the left code pane and
// the right display frame.
function xml2nd(xml, tagName) {  // TDDTEST2 FTR
    console.log(xml);
    var nd = {attrs:[]};
    svgNodes.push(nd);
    var dp = new DOMParser();
    var xmlDocument = dp.parseFromString(xml, 'text/xml');
    var xdomNd = xmlDocument.getElementsByTagName(tagName)[0];
    var nd = xdom2nd(xdomNd, nd);
    sortSvgNodes();
}

// DIFFERENCES
function diffscal(ndV1, ndV2, name) {
    return getscal(ndV2.attrs, name) - getscal(ndV1.attrs, name);
}

function diffscalarr(ndV1, ndV2, name, query) {

    var i1=0;
    var i2=0;


    var ndV2Strs = [];
    for (var i=0; i<ndV2.attrs.length; i++) {
        if (ndV2.attrs[i].name == name) {
            i2=i;
            //
            break;
        }
    }

    for (var i=0; i<ndV1.attrs.length; i++) {
        if (ndV1.attrs[i].name == name) {
            i1=i;
            break;
        }
    }
    ndV1Strs = ndV1.attrs[i1].value.split(/[ ,]+/);
    ndV2Strs = ndV2.attrs[i2].value.split(/[ ,]+/);
    if (ndV1Strs.length != ndV2Strs.length) { return 0; }
    if (ndV1Strs.length == 0) { return 0; }
    if (ndV2Strs.length == 0) { return 0; }

    if (query == "odd") {
        return parseFloat(ndV2Strs[1]) - parseFloat(ndV1Strs[1]);
    }
    else if (query == "even") {
        return parseFloat(ndV2Strs[0]) - parseFloat(ndV1Strs[0]);
    }
    return 0;
}

// MAPPINGS
function forceMap(src, dest) {
    dest.tagName = src.tagName;
    if (src.tagName == "text") {
        dest.text = src.text;
    }
    dest.attrs = [];
    dest.cacheColor = src.cacheColor;
    for (var i=0; i<src.attrs.length; i++) {
        var attr = src.attrs[i];
        dest.attrs.push({name: attr.name, value: attr.value});
    }
}

function smartMap(src, dest) {
    var mapDescriptor = src.tagName.toLowerCase() +
        " -> " +
        dest.tagName.toLowerCase();
    switch (mapDescriptor) {

        // MAPPINGS - RECT
        case "rect -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"x"));
            addscal(dest, "cy", diffscal(cacheNd,src,"y"));
            break;
        }
        case "circle -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"cx"));
            addscal(dest, "y", diffscal(cacheNd,src,"cy"));
            break;
        }

        case "rect -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y"));
            break;
        }
        case "polyline -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "y", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "rect -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"x");
            var diffY = diffscal(cacheNd,src,"y");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> rect": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"x1"));
            addscal(dest, "y", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "rect -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"x")); // TDDTEST0 FIX
            addscal(dest, "y", diffscal(cacheNd,src,"y")); // TDDTEST0 FIX
            break;
        }
        case "text -> rect": {
            addscal(dest, "x", diffscal(cacheNd,src,"x"));
            addscal(dest, "y", diffscal(cacheNd,src,"y"));
            break;
        }

        case "rect -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"x")); // TDDTEST9 9
            addscal(dest, "y", diffscal(cacheNd,src,"y")); // TDDTEST9 9
            break;
        }

        // MAPPINGS - (EXCL RECT) POLYLINE

        case "circle -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"cx"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"cy"));
            break;
        }
        case "polyline -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "cy", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "text -> polyline": {
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y"));
            break;
        }
        case "polyline -> text": {
            addscal(dest, "x", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "y", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "polyline -> line": { // TDDTEST4 FIX
            var diffX = diffscalarr(cacheNd,src,"points","even");
            var diffY = diffscalarr(cacheNd,src,"points","odd");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> polyline": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x1"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "polyline -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscalarr(cacheNd,src,"points","even"));
            addscalarr(dest, "points", "odd", diffscalarr(cacheNd,src,"points","even"));
            break;
        }


        // MAPPINGS - (EXCL RECT,POLYLINE) CIRCLE

        case "circle -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"cx"));
            addscal(dest, "y", diffscal(cacheNd,src,"cy"));
            break;
        }
        case "text -> circle": {
            addscal(dest, "cx", diffscal(cacheNd,src,"x"));
            addscal(dest, "cy", diffscal(cacheNd,src,"y"));
            break;
        }

        case "circle -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"cx");
            var diffY = diffscal(cacheNd,src,"cy");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX); // TDDTEST15 FIX
            addscal(dest, "x2", diffX); // TDDTEST15 FIX
            addscal(dest, "y1", diffY); // TDDTEST15 FIX
            addscal(dest, "y2", diffY); // TDDTEST15 FIX
            break;
        }
        case "line -> circle": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"x1")); // TDDTEST16 FIX
            addscal(dest, "cy", diffscal(cacheNd,src,"y1")); // TDDTEST16 FIX
            break;
        }

        case "circle -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"cx"));
            addscal(dest, "cy", diffscal(cacheNd,src,"cy"));
            break;
        }

        // MAPPING (EXCL RECT,POLYLINE,CIRCLE) TEXT

        case "text -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"x");
            var diffY = diffscal(cacheNd,src,"y");
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> text": { // TDDTEST4 FIX
            addscal(dest, "x", diffscal(cacheNd,src,"x1"));
            addscal(dest, "y", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "text -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"x"));
            addscal(dest, "y", diffscal(cacheNd,src,"y"));
            break;
        }

        // MAPPINGS (EXCL RECT,POLYLINE,CIRCLE,TEXT) LINE
        case "line -> line": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffscal(cacheNd,src,"x1"));
            addscal(dest, "x2", diffscal(cacheNd,src,"x2"));
            addscal(dest, "y1", diffscal(cacheNd,src,"y1"));
            addscal(dest, "y2", diffscal(cacheNd,src,"y2"));
            break;
        }

        default: ()=>{};
    }
}

// ETC

// updateFrames MUST be called after issueClick since updateFrames
// depends on curId that gets modified by track/untrack functions
function updateFrames(selNd) {
    for (var i=0; i<svgNodes.length; i++) { setMouseRects(svgNodes[i]); }

    document
        .getElementById("editModalBG")
        .style
        .visibility = (curIds.length == 0) ? "hidden" : "visible";
    /*if (curIds.length == 0) {
        document.getElementById("editModalBG").style.visibility = "hidden";
    }
    else {
        //if (selNd == null) {
        //    selNd = xy2nd(curIds[curIds.length-1].x, curIds[curIds.length-1].y);
        //}
        document.getElementById("editModalBG").style.visibility = "visible";
        //document.getElementById("svgPartTextarea").value = nd2xml(selNd);
        //    prepareAndGetMultiEdit(selNd);
    }*/
    document.getElementById("svgId").remove();
    var svg = document.createElement("div");
    svg.id = "svgId";
    var xml = nds2xml(svgNodes);
    svg.innerHTML = xml;
    document.getElementById("svgFullTextarea").value = xml;
    document.getElementById("pageDisplayFrame").appendChild(svg);

    if (curIds.length == 0) return;
    var editNd = xy2nd(curIds[curIds.length-1].x, curIds[curIds.length-1].y);

    document
        .getElementById("svgPartTextarea")
        .value = nd2xml(editNd, editNd.cacheColor); console.log("tag", editNd.tagName);
    cacheNd = {attrs:[]};
    forceMap(editNd, cacheNd);
}

const trackNd = (x, y) => curIds.push({x: x, y: y});

function untrackNd(nd) {
    var j=-1;
    for (var i=0; i<curIds.length; i++) {
        var testNd = xy2nd(curIds[i].x, curIds[i].y);
        if (testNd === nd) { j=i; break; }
    }
    if (curIds.length == 1) {
        curIds.shift();
        return;
    }
    if (j>-1) { curIds.splice(j, 1); }
    else { console.warn("unable to untrack"); }
}

// EVENTS - PROGRAMMATIC - ISSUE SELECTION

function issueSelection(nd) {
    var selType = "select";
    var color = getcolor(nd);
    if (color.toUpperCase() == selColor || color.toUpperCase() == editColor
        || nd.cacheColor != null // TDDTEST6 FTR
    ) {
        // setcolor(nd, nd.cacheColor);
        selType = "deselect";
        untrackNd(nd);
    }
    else {
        trackNd(nd.xmin,nd.ymin);
        nd.cacheColor = color; 
        console.warn(color.toUpperCase());
        // setcolor(nd, selColor);
    }
    // if (curIds.length == 0) { return selType; }
    if (selType == "select") {
        setcolor(
            /*nd=*/ nd,
            /*color=*/ editColor
        );
        var prevLastNd = (curIds.length>1) ?
            xy2nd(curIds[curIds.length-2].x,curIds[curIds.length-2].y) : null;
        if (prevLastNd != null) {
            setcolor(
                /*nd=*/ prevLastNd,
                /*color=*/ selColor
            );
        }
    }
    else if (selType == "deselect") {
        if (nd.cacheColor == null) {
            console.warn("WARNING: "+nd.tagName+" is too close to another element" );
        }
        setcolor(
            /*nd=*/ nd,
            /*color=*/ nd.cacheColor
        );
        nd.cacheColor=null; // TDDTEST6 FTR
    }
    return selType;
}

// EVENTS - PROGRAMMATIC - ISSUE DRAW

function issueDraw(xml, tagName) {
    xml2nd(xml, tagName);
    updateFrames();
}

// EVENTS - PROGRAMMATIC - ISSUE CLICK

function issueClick(x, y) {
    if (numMode == 1) {  // TDDTEST2 FTR
        if (clickCnt == 1) {
            issueDraw(`<line x1="`
                +drawClick.x+`" y1="`
                +drawClick.y+`" x2="`
                +x+`" y2="`
                +y+`" stroke="black" stroke-width="1"/>`, 'line');
            clickCnt = 0;  drawClick = {x:-1,y:-1};
        }
        else {
            clickCnt += 1;
            drawClick.x = x; drawClick.y = y;
        }
        return;
    }
    if (numMode == 2) { // TDDTEST7 FTR
        if (clickCnt == 1) {
            var iter = 0;
            var x1 = drawClick.x;
            var x2 = x;
            var s = (x2>x1) ? -1 : 1;

            var pt1={};
            var pt2={};

            if (Math.abs(drawClick.x - x) < 11) { x = drawClick.x; }
            if (Math.abs(drawClick.y - y) < 11) { y = drawClick.y; }
            if (drawClick.x == x) {
                pt1.x = x-10;
                pt2.x = x+10;
                pt1.y = y + (y>drawClick.y?-1:1)*10;
                pt2.y = y + (y>drawClick.y?-1:1)*10;
            } else if (drawClick.y == y) {
                pt1.y = y - 10;
                pt2.y = y + 10;
                pt1.x = x + (x>drawClick.x?-1:1)*10;
                pt2.x = x + (x>drawClick.x?-1:1)*10;
            } else {
                var pt1in = {x: drawClick.x, y: drawClick.y};
                var pt2in = {x: x, y: y};
                pt1 = arrowPoint(pt1in, pt2in, 45, 10, -1);
                pt2 = arrowPoint(pt1in, pt2in, 45, 10, 1);
            }

            issueDraw(`<polyline points="`
                +drawClick.x+` `
                +drawClick.y+` `
                +x+` `
                +y+` `
                +pt1.x+` `
                +pt1.y+` `
                +x+` `
                +y+` `
                +pt2.x+` `
                +pt2.y+`" `
                +` stroke="black" fill="transparent" stroke-width="1"/>`, 'polyline');
            clickCnt = 0;  drawClick = {x:-1,y:-1};
        }
        else {
            clickCnt += 1;
            drawClick.x = x; drawClick.y = y;
        }
        return;
    }
    if (numMode == 3) { // TDDTEST5 FTR
        if (clickCnt == 1) {
            issueDraw(`<rect rx="0" ry="0" x="`
                +drawClick.x+`" y="`
                +drawClick.y+`" width="`
                +(x-drawClick.x)+`" height="`
                +(y-drawClick.y)+`" stroke="black" fill="transparent" stroke-width="1"/>`, 'rect');
            clickCnt = 0;  drawClick = {x:-1,y:-1};
        }
        else {
            clickCnt += 1;
            drawClick.x = x; drawClick.y = y;
        }
        return;
    }
    if (numMode == 4) { // TDDTEST8 FTR
        if (clickCnt == 1) {
            issueDraw(`<rect rx="10" ry="10" x="`
                +drawClick.x+`" y="`
                +drawClick.y+`" width="`
                +(x-drawClick.x)+`" height="`
                +(y-drawClick.y)+`" stroke="black" fill="transparent" stroke-width="1"/>`, 'rect');
            clickCnt = 0;  drawClick = {x:-1,y:-1};
        }
        else {
            clickCnt += 1;
            drawClick.x = x; drawClick.y = y;
        }
        return;
    }
    if (numMode == 5) { // TDDTEST10 FTR
        var segLen = 7;
        var x1=x-segLen,        y1=y,
            x2=x,               y2=y-segLen,
            x3=x+segLen,        y3=y,
            x4=x,               y4=y+segLen,
            x5=x-segLen,        y5=y;
        issueDraw(`<polyline points="${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4} ${x5} ${y5}" stroke="black" fill="transparent" stroke-width="1"/>`, 'polyline');
        drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 6) { // TDDTEST11 FTR
        issueDraw(`<circle cx="${x}" cy="${y}" r="10" fill="black" stroke="black" stroke-width="1"/>`, 'circle');
        drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 7) { // TDDTEST12 FTR
        // smaller circle must precede larger in order to allow
        // clicking and selecting both
        issueDraw(`<circle cx="${x}" cy="${y}" r="6" fill="black" stroke="black" stroke-width="1"/>`, 'circle');
        issueDraw(`<circle cx="${x}" cy="${y}" r="10" fill="transparent" stroke="black" stroke-width="1"/>`, 'circle');
        drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 8) { // TDDTEST13 FTR
        if (clickCnt == 1) {
            issueDraw(`<line x1="${drawClick.x}" y1="${drawClick.y}" x2="${x}" y2="${y}" stroke="black" stroke-width="3"/>`, 'line');
            clickCnt = 0;  drawClick = {x:-1,y:-1};
        }
        else {
            clickCnt += 1;
            drawClick.x = x; drawClick.y = y;
        }
        return;
    }
    if (numMode == 9) { // TDDTEST14 FTR
        var adjY = y +3;
        var adjX = x -7;
        var elStr = `<text x="${adjX}" y="${adjY}" fill="black">?</text>`;
        issueDraw(elStr, 'text');
        issueKeyNum(0, {});
        issueClick(adjX, adjY);    updateFrames();
        document.getElementById("svgPartTextarea").focus();
        document.getElementById("svgPartTextarea").setSelectionRange(
            elStr.indexOf("?"),
            elStr.indexOf("?")+1
        );
        drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    clickCnt = 0; drawClick = {x:-1,y:-1};
    var clickedNd = xy2nd(x, y);
    if (clickedNd == null) { return; }
    setMouseRects(clickedNd);//todo: does this work?
    var selType = issueSelection(clickedNd);
/////         if (curIds.length == 0) { if (removeTracking) {untrackNd(clickedNd);}
/////     
/////         //var removeTracking = false;
/////         ///// 
/////             //console.log("--");
/////             //console.log(clickedNd.attrs[3]?.value, clickedNd.cacheColor);
/////             
/////             //console.log(clickedNd.attrs[3]?.value, clickedNd.cacheColor);
/////             //clickedNd.attrs[i].value = clickedNd.cacheColor; //"black";
/////             // remove the de-selected node from cur IDs
/////             //removeTracking = true;
/////             //untrackNd(clickedNd);
/////             //clickedNd = null; // this is important to unset since the
/////             //           the node got de-selected
/////         ////}
/////         ////else {
/////                     //clickedNd.attrs[i].value;
/////              // clickedNd.attrs[i].value = selColor;
/////         ////}
/////     
/////         //// return clickedNd; }
/////     
/////         ////if (curIds.length == 1) { if (removeTracking) {untrackNd(clickedNd);} return clickedNd; }
/////     
/////         // fix the previous last select to not be the active click
/////     //     setcolor(
/////     //         /*nd=*/ xy2nd(curIds[curIds.length-2].x,curIds[curIds.length-2].y),
/////     //         /*color=*/ selColor
/////     //     );
/////     
/////     //     for (var i=0; i<clickedNd.attrs.length; i++) {
/////     //         if (clickedNd.attrs[i].name == "stroke") {
/////     //     
/////     //             break;
/////     //         }
/////     //     }
/////     
/////     //     if (removeTracking) {untrackNd(clickedNd);} return clickedNd;
}
// EVENTS - PROGRAMMATIC - ISSUE KEY NUM

function issueKeyNum(num, test) {
    setNumMode(num, test);
}

// EVENTS - UI

function keydown(e) {
    if (document.activeElement && document.activeElement.tagName.toLowerCase() != "body") { return; }
    e = e || window.event;
    if ("1234567890".indexOf(e.key) > -1) {
        issueKeyNum(parseInt(e.key));
        e.view.event.preventDefault();
    }
}

function mousedown(e) {
    if (document.activeElement && document.activeElement.tagName.toLowerCase() != "body") { return; }
    e = e || window.event;
    var x = e.clientX - 750;
    var y = e.clientY - 88;
    console.log(x,y);
    if (isNaN(x) || isNaN(y)) { return; }
    // curIds.push({x: x, y: y});
    // curId.x = x;
    // curId.y = y;
    updateFrames( /*selNd=*/ issueClick(x, y) );
}

addEventListener('DOMContentLoaded', (e) => {
    document.getElementById("svgFullTextarea").value =
        svgHead
        + svgEx
        + svgTrail;
});

function onDone() {
    var i=0;
    var j=curIds.length;
    var limit =10000;
    while (j > -1) {
        setcolor(xy2nd(curIds[0].x, curIds[0].y), selColor); // This is a temp.
            // workaround because somewhere else the color is resetting to cache
            // value and shouldn't be
        issueClick(curIds[0].x, curIds[0].y);
        i += 1;
        if (i > limit) {console.warn("max num iterations"); break;}
        j = curIds.length;
        if (j ==0) j--;
    }
    updateFrames();
/////         var ids = [];
/////         for (var i=0; i<curIds.length; i++) {
/////             ids.push({x: curIds[i].x, y: curIds[i].y});
/////         }
/////         for (var i=0; i<ids.length; i++) {
/////             // issueClick will modify length of curIds
/////             // so this is done iterating a different
/////             // array
/////             console.log(i);
/////             issueClick(ids[i].x, ids[i].y); // de-selects all nodes
/////             // untrackNd(xy2nd(ids[i].x, ids[i].y));
/////             console.log("IS IT EMPTY?: ", curIds.length);
/////         }    /*curIds = [];*/    updateFrames();
}

function onStart(test) {
    var svg = document.createElement("div");
    svg.id = "svgId";
    svg.innerHTML = (svgHead + svgEx + svgTrail);
    document.getElementById("pageDisplayFrame").appendChild(svg);

    document.getElementById("tools1").style.visibility = "hidden";
    document.getElementById("tools2").style.visibility = "visible";

    document.getElementById("pageCodeFrame").classList.add("disabled");
    document.getElementById("svgFullTextarea").disabled="disabled";

    document.onkeydown = keydown;
    setTimeout(function(){document.onclick = mousedown;}, 800);// skip first click

    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(document.getElementById("svgFullTextarea").value, "text/xml");
    var elements = xmlDocument.getElementsByTagName('*');
    var sni = -1; //svg nodes index
    for (var i=0; i<elements.length; i++) {
        var nd = elements[i];
        if (nd.tagName.toLowerCase() == "svg") {
            //svgBaseNode = xdom2nd(nd,null);
            xdom2nd(nd,svgBaseNode);
            /*svgBaseNode.tagName = nd.tagName;
            for (var j=0; j<nd.attributes.length; j++) {
                svgBaseNode["attrs"].push({
                    name: nd.attributes[j].nodeName,
                    value: nd.attributes[j].nodeValue
                });
            }*/
            continue;
        }
        sni += 1; svgNodes.push({}); // svgNodes.push({attrs:[]});
        //svgNodes[sni] = xdom2nd(nd,null);
        xdom2nd(nd, svgNodes[sni]);
        setMouseRects(svgNodes[sni]);
        /*
        for (var j=0; j<nd.attributes.length; j++) {
            svgNodes[sni].attrs.push({
                name: nd.attributes[j].nodeName,
                value: nd.attributes[j].nodeValue
            });
            svgNodes[sni].tagName = nd.tagName;
            setMouseRects(svgNodes[sni]);
        }*/
    }
    sortSvgNodes();
    issueKeyNum(0, test);
    updateFrames();
}

function onNum(obj) {
    var num = parseInt(obj.innerHTML[obj.innerHTML.length-1]);
    issueKeyNum(num);
}

function onApplyEdits() {
    var text = document
        .getElementById("svgPartTextarea")
        .value;
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(text, "text/xml");
    var failed = xmlDocument.getElementsByTagName("parsererror").length > 0;

    if (failed) { return; }
    var elements = xmlDocument.getElementsByTagName('*');
    failed = elements.length != 1;
    if (failed) { return; }

    var xdomNd = elements[0];
    var nd = xy2nd(curIds[curIds.length-1].x, curIds[curIds.length-1].y);
    // {
        // must happen all together
        //forceMap(xdom2nd(xdomNd, nd.cacheColor), nd);
        //forceMap(xdom2nd(xdomNd, nd), nd);
        xdom2nd(xdomNd, nd);
        setMouseRects(nd);
        curIds[curIds.length-1].x = nd.xmin;
        curIds[curIds.length-1].y = nd.ymin; 
    // }
    var i=curIds.length-2;
    while (i > -1) {
        var passiveSelNd = xy2nd(curIds[i].x, curIds[i].y);
        // {
            // must happen all together
            smartMap(nd, passiveSelNd);
            setMouseRects(passiveSelNd);
            curIds[i].x = passiveSelNd.xmin;
            curIds[i].y = passiveSelNd.ymin;
        // }
        i-=1;
    }
    console.log("IMPORTANT", curIds.length);
    onDone();
    console.log("IMPORTANT", curIds.length);
    //updateFrames();
}
