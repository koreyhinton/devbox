class MoveTester {
    constructor({mover,movee}) {
        this.moved = false;
        this.mover = mover;
        this.moveeTagName = movee.tagName;

        this.moverX=0;this.moverY=0;
        this.moveeX=0;this.moveeY=0;
        this.moverNewX=0;this.moverNewY=0;

        if (this.mover.tagName == 'rect' || this.mover.tagName == 'text') {
            this.moverX = parseInt(this.mover.getAttribute("x"));
            this.moverY = parseInt(this.mover.getAttribute("y"));
        } else if (this.mover.tagName == 'circle') {
            this.moverX = parseInt(this.mover.getAttribute("cx"));
            this.moverY = parseInt(this.mover.getAttribute("cy"));
        } else if (this.mover.tagName == 'line') {
            this.moverX = parseInt(this.mover.getAttribute("x1"));
            this.moverY = parseInt(this.mover.getAttribute("y1"));
            this.moverX2 = parseInt(this.mover.getAttribute("x2"));
            this.moverY2 = parseInt(this.mover.getAttribute("y2"));
        }

        if (movee.tagName == 'rect' || movee.tagName == 'text') {
            this.moveeX = parseInt(movee.getAttribute("x"));
            this.moveeY = parseInt(movee.getAttribute("y"));
        } else if (movee.tagName == 'line') {
            this.moveeX = parseInt(movee.getAttribute("x1"));
            this.moveeY = parseInt(movee.getAttribute("y1"));
            this.moveeX2 = parseInt(movee.getAttribute("x2"));
            this.moveeY2 = parseInt(movee.getAttribute("y2"));
        } else if (movee.tagName == 'circle') {
            this.moveeX = parseInt(movee.getAttribute("cx"));
            this.moveeY = parseInt(movee.getAttribute("cy"));
        }
    }
    moveBy(x, y) {
        this.moverNewX=(this.moverX+x);this.moverNewY=(this.moverY+y);
        var ta = document.getElementById("svgPartTextarea");
        console.log('before edit:', ta.value);
        this.moved = true;
        if (this.mover.tagName == 'rect' || this.mover.tagName == 'text') {
            ta.value = ta.value.replace(
                `x="${this.moverX}"`,`x="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `y="${this.moverY}"`,`y="${this.moverNewY}"`);
        } else if (this.mover.tagName == 'circle') {
            ta.value = ta.value.replace(
                `cx="${this.moverX}"`,`cx="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `cy="${this.moverY}"`,`cy="${this.moverNewY}"`);
        } else if (this.mover.tagName == 'line') {
            ta.value = ta.value.replace(
                `x1="${this.moverX}"`,`x1="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `y1="${this.moverY}"`,`y1="${this.moverNewY}"`);
            this.moverNewX2=this.moverX2+x;this.moverNewY2=this.moverY2+y;
            ta.value = ta.value.replace(
                `x2="${this.moverX2}"`,`x2="${this.moverNewX2}"`);
            ta.value = ta.value.replace(
                `y2="${this.moverY2}"`,`y2="${this.moverNewY2}"`);
        } else {
            console.warn("WARNING: MoveTester implementation missing");
            this.moved = false; // ensure test won't pass for a tag
                                // type that hasn't been implemented in this
                                // Tester yet
        }
        console.log('after edit:', ta.value);
        onApplyEdits();
    }
    test() {

        // general sanity check that no attributes have undefined or null
        var undefinedAttr = (   
            (document.getElementById("svgFullTextarea")
                .value
                .indexOf("undefined")
            )
            > -1
        );
        var nullAttr = (   
            (document.getElementById("svgFullTextarea")
                .value
                .indexOf("null")
            )
            > -1
        );
        var foundMove = false;

        var calcX = this.moveeX + (this.moverNewX - this.moverX);
        var calcY = this.moveeY + (this.moverNewY - this.moverY);
        console.log('mover',
            `${this.moverX},${this.moverY} -> ${this.moverNewX},${this.moverNewY}`);
        console.log('movee',
            `${this.moveeX},${this.moveeY} -> ${calcX},${calcY}`);

        if (this.moveeTagName == 'text' || this.moveeTagName == 'rect') {
            foundMove = null != document.querySelector(
                this.moveeTagName + `[x="${calcX}"][y="${calcY}"]`
            );
        } else if (this.moveeTagName == 'line') {
            var calcX2 = this.moveeX2 + (this.moverNewX - this.moverX);
            var calcY2 = this.moveeY2 + (this.moverNewY - this.moverY);
            foundMove = (null != document.querySelector(
                this.moveeTagName + `[x1="${calcX}"][y1="${calcY}"]`)) &&
                (null != document.querySelector(
                    this.moveeTagName + `[x2="${calcX2}"][y2="${calcY2}"]`));
        } else if (this.moveeTagName == 'circle') {
            var calcX2 = this.moveeX2 + (this.moverNewX - this.moverX);
            var calcY2 = this.moveeY2 + (this.moverNewY - this.moverY);
            foundMove = null != document.querySelector(
                this.moveeTagName + `[cx="${calcX}"][cy="${calcY}"]`);
        }
        console.log(
            "moved? "+this.moved,
            "undefinedAttr? "+undefinedAttr,
            "nullAttr? "+nullAttr,
            "foundMove? "+foundMove
        );
        return this.moved && !undefinedAttr && !nullAttr && foundMove;
    }
}
