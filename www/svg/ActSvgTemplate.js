templateXml = {'swim3': `

    <text x="81" y="34" fill="black">Users</text>
    <text x="312" y="34" fill="black">Web Service</text>
    <text x="549" y="34" fill="black">Developers</text>
    <line x1="3" y1="55" x2="730" y2="55" stroke="black" stroke-width="1"/>
    <rect rx="0" ry="0" x="489" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="246" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="3" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>

`,'pins': `

        <text x="129" y="134" fill="black">Get User</text>
    <text x="129" y="154" fill="black">Input</text>
    <text x="222" y="111" fill="black">type</text>
    <text x="222" y="181" fill="black">input</text>
    <text x="328" y="123" fill="black">Format</text>
    <text x="327" y="142" fill="black">Input</text>
    <text x="545" y="124" fill="black">Format</text>
    <text x="544" y="142" fill="black">Output</text>
    <circle cx="50" cy="139" r="10" fill="black" stroke="black" stroke-width="1"/>
    <rect rx="10" ry="10" x="118" y="115" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="65 139 114 139 104 129 114 139 104 149" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="223" y="120" width="15" height="15" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="223" y="145" width="15" height="15" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="245 128 311 128 301 118 311 128 301 138" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="249 155 311 155 301 145 311 155 301 165" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="10" ry="10" x="321" y="104" width="95" height="57" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="423 134 531 134 521 124 531 134 521 144" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="459" y="112" width="15" height="15" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="10" ry="10" x="539" y="103" width="95" height="55" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="641 132 677 132 667 122 677 132 667 142" stroke="black" fill="transparent" stroke-width="1"/>
    <circle cx="696" cy="131" r="6" fill="black" stroke="black" stroke-width="1"/>
    <circle cx="696" cy="131" r="10" fill="transparent" stroke="black" stroke-width="1"/>

`,'connectors': `

    <text x="15" y="334" fill="black">How to create (Wireless) Connector:</text>
    <text x="25" y="364" fill="black">[6] Initial Node (set attrs to: r="12" fill="transparent")</text>
    <text x="25" y="394" fill="black">[9] Text node (set tag content to letter, ie: A)</text>
    <text x="126" y="134" fill="black">Fill</text>
    <text x="124" y="153" fill="black">Order</text>
    <text x="316" y="228" fill="black">Ship</text>
    <text x="314" y="246" fill="black">Order</text>
    <text x="283" y="146" fill="black">A</text>
    <text x="206" y="237" fill="black">A</text>
    <polyline points="65 139 114 139 104 129 114 139 104 149" stroke="black" fill="transparent" stroke-width="1"/>
    <circle cx="50" cy="139" r="10" fill="black" stroke="black" stroke-width="1"/>
    <rect rx="10" ry="10" x="118" y="115" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="226 141 267 141 257 131 267 141 257 151" stroke="black" fill="transparent" stroke-width="1"/>
    <circle cx="288" cy="141" r="12" fill="transparent" stroke="black" stroke-width="1"/>
    <circle cx="211" cy="232" r="12" fill="transparent" stroke="black" stroke-width="1"/>
    <polyline points="230 231 296 231 286 221 296 231 286 241" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="10" ry="10" x="303" y="207" width="104" height="50" stroke="black" fill="transparent" stroke-width="1"/>
    <polyline points="417 231 486 231 476 221 486 231 476 241" stroke="black" fill="transparent" stroke-width="1"/>
    <circle cx="503" cy="231" r="6" fill="black" stroke="black" stroke-width="1"/>
    <circle cx="503" cy="231" r="10" fill="transparent" stroke="black" stroke-width="1"/>

`

};
addEventListener('DOMContentLoaded', (e) => {
    var template = new URL(location.href).searchParams.get("template");
    if (template == null) {
        return;
    }
    if ("swim3|pins|connectors".indexOf(template) > -1) {
        setTimeout(function() {
            document.getElementById("svgFullTextarea").value = 
                svgHead + templateXml[template] + svgTrail;
        }, 400);
    }
});
