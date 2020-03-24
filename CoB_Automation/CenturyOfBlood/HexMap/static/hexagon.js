function HexagonGrid(canvasId, radius) {
    this.radius = radius;

    this.height = Math.sqrt(1) * radius;
    this.width = 1 * radius;
    this.side = (1.5 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;

    this.hexList = [];
    
    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
};

HexagonGrid.prototype.draw7kMap = function (objectArray) {

    let deepWater = "#284355";
    let shallowWater = "#37B5F5";
    let field = "#8DBC42";
    let forest = "#597F31";
    let hill = "#AB9C42";
    let mountain = "#9D7857";
    let impassableMountain = "#5E5447";

    for (count=0; count < objectArray.length; count++)
    {
        hexFor = new HexObject(objectArray[count].fields.hexId, objectArray[count].fields.col, objectArray[count].fields.row, objectArray[count].fields.tileType, objectArray[count].fields.topBorderType,
            objectArray[count].fields.topRightBorderType, objectArray[count].fields.rightBorderType, objectArray[count].fields.bottomRightBorderType, objectArray[count].fields.bottomBorderType,
             objectArray[count].fields.bottomLeftBorderType, objectArray[count].fields.leftBorderType, objectArray[count].fields.topleftBorderType);
        //#region Tile Type Set
        if (hexFor.tileType == "Deep Water") 
        {
            hexFor.tileType = "#284355";
        }
        //#endregion Tile Type Set
        this.hexList.push(hexFor);
    }
    
    this.hexList.forEach(element => {
        this.drawHexObject(element);
    });
    
};

HexagonGrid.prototype.drawHexObject = function(HexObject) {
    var drawy = HexObject.col % 2 == 0 ? (HexObject.row * this.height) + this.canvasOriginY : (HexObject.row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (HexObject.col * this.side) + this.canvasOriginX;

    this.drawHex(drawx, drawy, HexObject.tileType, "");
};

HexagonGrid.prototype.drawHex = function(x0, y0, tileType, debugText) {
    this.context.strokeStyle = "#000";
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));

    if (tileType) {
        this.context.fillStyle = tileType;
        this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();
};

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
	var x = 0, y = 0;
	var layoutElement = this.canvas;
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);
        
        return { x: x, y: y };
    }
}

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to acuratly determin correct hex
HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY) {

	var offSet = this.getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    var column = Math.floor((mouseX) / this.side);
    var row = Math.floor(
        column % 2 == 0
            ? Math.floor((mouseY) / this.height)
            : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);


    //Test if on left side of frame            
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {


        //Now test which of the two triangles we are in 
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0
            ? row * this.height
            : (row * this.height) + (this.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        var p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        var p4 = new Object();
        p4 = p2;

        var p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        var p6 = new Object();
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }

    return  { row: row, column: column };
};


HexagonGrid.prototype.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1, b2, b3;

    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
};

HexagonGrid.prototype.clickEvent = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;

    var tile = this.getSelectedTile(localX, localY);
    var index;
    for (index = 0; index < this.hexList.length; index++) {
        if(this.hexList[index].col == tile.column && this.hexList[index].row == tile.row)
        {
            var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var drawx = (tile.column * this.side) + this.canvasOriginX;

            this.drawHex(drawx, drawy - 6, "rgba(110,110,70,0.3)", "");
            index = this.hexList.length;
        };
    } 
};

function HexObject(hexId, col, row, tileType, topBorder, topRightBorder, rightBorder, bottomRightBorder, bottomBorder, bottomLeftBorder, leftBorder, topleftBorder){
    this.hexId = hexId;
    this.col = col;
    this.row = row;
    this.tileType = tileType;
    this.topBorderType = topBorder;
    this.topRightBorderType = topRightBorder;
    this.rightBorderType = rightBorder;
    this.bottomRightBorderType = bottomRightBorder;
    this.bottomBorderType = bottomBorder;
    this.bottomLeftBorderType = bottomLeftBorder;
    this.leftBorderType = leftBorder;
    this.topleftBorderType = topleftBorder;
    
};