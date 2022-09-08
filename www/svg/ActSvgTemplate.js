swim3ElXml = `

    <text x="81" y="34" fill="black">Users</text>
    <text x="312" y="34" fill="black">Web Service</text>
    <text x="549" y="34" fill="black">Developers</text>
    <line x1="3" y1="55" x2="730" y2="55" stroke="black" stroke-width="1"/>
    <rect rx="0" ry="0" x="489" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="246" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="0" ry="0" x="3" y="3" width="240" height="745" stroke="black" fill="transparent" stroke-width="1"/>

`;
addEventListener('DOMContentLoaded', (e) => {
    var template = new URL(location.href).searchParams.get("template");
    if (template == null) {
        return;
    }
    if (template == "swim3") {
        setTimeout(function() {
            document.getElementById("svgFullTextarea").value = 
                svgHead + swim3ElXml + svgTrail;
        }, 400);
    }
});
