var canvas_container;
var canvas;
var options;
var inner_container;
var ctx;
var image = new Image();

var heading_div;
var f_label_div;
var delbtn_div;
var savebtn_div;
var skipbtn_div;

var mouseDown = false;
var drag = false;
var mouseMove_X;
var mouseMove_Y;
var mouseDown_X;
var mouseDown_Y;
var initial_time;
var final_time;

var scale;
var boxId;
var region;
var createBox = false;
var activeBox = -1;
var resize = false;
var boxCount = 0;
var timer_started = false

image.init = init;
image.getDimensions = getDimensions;
image.render = render;
image.changeCursor = changeCursor;
image.resizeBox = resizeBox;
image.dragBox = dragBox;
image.popBox = popBox;
image.pushBox = pushBox;
image.drawBox = drawBox;
image.makeBox = makeBox;
image.getIndex = getIndex;
image.labelBox = labelBox;
image.loadMenu = loadMenu;
image.editMenu = editMenu;
image.save = save;

window.onload = function() {

	//initializing objects, rendering image for the first time
	canvas_container = document.getElementById("canvas_container");
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	options = document.getElementById("options");
	inner_container = document.getElementById("inner_container");

	heading_div = document.getElementById("heading_div");
	f_label_div = document.getElementById("f_label_div");
    delbtn_div = document.getElementById("delbtn_div");
    savebtn_div = document.getElementById("savebtn_div");
    skipbtn_div = document.getElementById("skipbtn_div");

    image.init();

	delbtn_div.onclick = function() {
		delBox();
	}

	skipbtn_div.onclick = function() {

		image.init();
	}

	savebtn_div.onclick = function() {


		if(image.boxes.length == 0)
			alert("Please draw the box(es) before trying to save.\nIf you wish to skip, click the Skip Image button.");

		else {

			image.save();
			image.init();
		}
	}

	canvas.onclick = function() {

		var retval = image.changeCursor();
		activeBox = retval[0];

		image.render();
	}

	canvas.onmousedown = function(event) {

		mouseDown = true;
		mouseDown_X = event.pageX - canvas.offsetLeft;
		mouseDown_Y	= event.pageY - canvas.offsetTop;

		if(!resize) {

			var retval = image.changeCursor();
			activeBox = retval[0];

			image.render();
		}

		if(!timer_started) {

		    timer_started = true;
		    initial_time = new Date().getTime();
		}
	}

	canvas.onmouseup = function(event) {

		mouseDown = false;
		drag = false;

		if(!resize) {

			var retval = image.changeCursor();
			activeBox = retval[0];

			image.render();
		}

		resize = false;

		if(createBox) {

			createBox = false;
			image.makeBox(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		}
	}

	canvas.onmousemove = function(event) {

		var deltaX = event.pageX - canvas.offsetLeft - mouseMove_X;
		var deltaY = event.pageY - canvas.offsetTop - mouseMove_Y;

		mouseMove_X = event.pageX - canvas.offsetLeft;
		mouseMove_Y = event.pageY - canvas.offsetTop;

		var retval = image.changeCursor();

		var current_boxId = retval[0];
		var current_region = retval[1];

		if(current_boxId > -1 && mouseDown) {

			drag = true;
			boxId = current_boxId;
			region = current_region;
		}

		if(mouseDown && current_region == 0)
			createBox = true;

		if(createBox)
			image.drawBox();

		if(drag && region < 5) {

			image.resizeBox(boxId, region);
			createBox = false;
			resize = true;

			if(region == 1 || region == 3)
				canvas.style.cursor = "nwse-resize";

			else if(region == 2 || region == 4)
				canvas.style.cursor = "nesw-resize";
		}

		if(drag && region == 5 && !resize) {

			image.dragBox(boxId, deltaX, deltaY);
			createBox = false;
		}
	}
}

window.onresize = function() {
	image.render();
}

function save() {

    var boxes = this.boxes;

    var src = this.src.slice(56, this.src.length - 4)

    var jsonstring = '{"boxes":['

    for(var i = 0; i < boxes.length; i ++) {

        box = boxes[i];

        if(i != boxes.length - 1)
            jsonstring += '{"x":' + box.x + ',"y":' + box.y + ',"w":' + box.w + ',"h":' + box.h + '},';

        else
            jsonstring += '{"x":' + box.x + ',"y":' + box.y + ',"w":' + box.w + ',"h":' + box.h + '}';
    }

    final_time = new Date().getTime();
    var delta_time = (final_time - initial_time) / 1000.0;
    timer_started = false;

    jsonstring += '],"id":' + src;
    jsonstring += ',"time":' + delta_time;
    jsonstring += '}';

    data = JSON.stringify(jsonstring);

    //console.log("time : " + delta_time)

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange=function() {

        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            console.log(xmlhttp.responseText);
    }

    xmlhttp.open("POST", "save_data_hpu", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(data);
}

function init() {

    activeBox = -1;

	var xmlhttp;
	xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", "new_image_hpu", false);
	xmlhttp.send();

	var id = xmlhttp.responseText;

	this.src = "/static/images/test-" + id +".jpg"

	this.boxes = new Array();
	this.num_boxes = 0;
	boxCount = 0;

	this.onload = function() {
		this.render();
	}
}

function getDimensions() {

	var container_height = canvas_container.clientHeight;
	var container_width = canvas_container.clientWidth;

	var width = this.width;
	var height = this.height;
	var ratio = width / height;

    height = 0.8 * container_height;
	width = height * ratio;

	if(width > 0.8 * container_width) {

		width = 0.8 * container_width;
		height = width / ratio;
	}

	return [width, height];
}

function loadMenu(height) {

	var h = 0.2 * height + "px";
	var font_h = 0.33 * 0.2 * height + "px";

	heading_div.style.height = h;
	f_label_div.style.height = h;
	delbtn_div.style.height = h;
	savebtn_div.style.height = h;
	skipbtn_div.style.height = h;

	heading_div.style.fontSize = font_h;
	f_label_div.style.fontSize = font_h;
	delbtn_div.style.fontSize = font_h;
	savebtn_div.style.fontSize = font_h;
	skipbtn_div.style.fontSize = font_h;
	input.style.fontSize = font_h;
}

function editMenu() {

	var index = this.getIndex(activeBox);
	var box = this.boxes[index];

	if(activeBox != -1)
		delbtn_div.style.visibility = "visible";

	else {

		heading_div.style.color = "#ffffff";
		f_label_div.style.visibility = "hidden";
		delbtn_div.style.visibility = "hidden";
	}

	heading_div.innerHTML = "<p> Image " + (parseInt(this.src.slice(56, this.src.length - 4)) + 1) + " </p>";
}

function delBox() {

	image.popBox(activeBox);
	activeBox = -1;
	image.render();
}

function render() {

	var dimensions = this.getDimensions();
	var width = dimensions[0];
	var height = dimensions[1];

	this.loadMenu(height);
	this.editMenu();

	ctx.canvas.width = width;
	ctx.canvas.height = height;

	inner_container.style.width = 1.36 * width + "px";
	inner_container.style.height = height + "px";

	options.style.width = 0.33 * width + "px";
	options.style.height = height + "px";

	scale = ctx.canvas.width / this.width;

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(this, 0, 0, width, height);

	if(activeBox != -1) {

		var index = this.getIndex(activeBox);
		var box = this.boxes[index];

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, ctx.canvas.width, box.y * scale);
		ctx.fillRect(0, box.y * scale, box.x * scale, ctx.canvas.height);
		ctx.fillRect((box.x + box.w) * scale, box.y * scale, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(box.x * scale, (box.y + box.h) * scale, box.w * scale, ctx.canvas.height);
		input.focus();
	}

	if(this.num_boxes > 0) {

		for(i = 0; i < this.num_boxes; i++) {
			this.boxes[i].draw(height);
		}
	}
}

function changeCursor() {

	var boxId = -1;
	var region = 0;

	if(this.num_boxes > 0) {

		var cursor_style = "auto";

		for(var i = 0; i < this.num_boxes; i++) {

			var x = Math.floor(this.boxes[i].x * scale);
			var y = Math.floor(this.boxes[i].y * scale);
			var w = Math.floor(this.boxes[i].w * scale);
			var h = Math.floor(this.boxes[i].h * scale);

			if(createBox && !drag) {

				cursor_style = "cell";
				break;
			}

			if(mouseMove_X > x - 6 && mouseMove_X < x + 6 && mouseMove_Y > y - 6 && mouseMove_Y < y + 6) {

				cursor_style = "nwse-resize";
				boxId = this.boxes[i].id;
				region = 1;
				break;
			}

			if(mouseMove_X > x + w - 6 && mouseMove_X < x + w + 6 && mouseMove_Y > y - 6 && mouseMove_Y < y + 6) {

				cursor_style = "nesw-resize";
				boxId = this.boxes[i].id;
				region = 2;
				break;
			}

			if(mouseMove_X > x + w - 6 && mouseMove_X < x + w + 6 && mouseMove_Y > y + h - 6 && mouseMove_Y < y + h + 6) {

				cursor_style = "nwse-resize";
				boxId = this.boxes[i].id;
				region = 3;
				break;
			}

			if(mouseMove_X > x - 6 && mouseMove_X < x + 6 && mouseMove_Y > y + h - 6 && mouseMove_Y < y + h + 6) {

				cursor_style = "nesw-resize";
				boxId = this.boxes[i].id;
				region = 4;
				break;
			}

			if(mouseMove_X > x + 5 && mouseMove_X < x + w - 5 && mouseMove_Y > y + 5 && mouseMove_Y < y + h - 5) {

				if(resize)
					cursor_style = "not-allowed";

				else
					cursor_style = "move";

				boxId = this.boxes[i].id;
				region = 5;
				continue;
			}
		}
	}

	if(createBox && !drag)
		cursor_style = "cell";

	canvas.style.cursor = cursor_style;
	return [boxId, region];
}

function popBox(boxId) {

	var index = this.getIndex(boxId);

	if(index == this.num_boxes - 1) {
		this.boxes = this.boxes.slice(0, index);
	}

	else {

		arr1 = this.boxes.slice(0, index);
		arr2 = this.boxes.slice(index + 1, this.num_boxes);
		this.boxes = arr1.concat(arr2);
	}

	this.num_boxes--;
}

function pushBox(box) {

	this.boxes.push(box);
	this.num_boxes++;
	boxCount++;
}

function drawBox() {

	this.render();

	var x = mouseDown_X;
	var y = mouseDown_Y;
	var w = mouseMove_X - x;
	var h = mouseMove_Y - y;

	ctx.strokeStyle = "#0000ff";
	ctx.lineWidth = 3;
	ctx.strokeRect(x, y, w, h);
}

function makeBox(W, H) {

	x = mouseDown_X / scale;
	y = mouseDown_Y /scale;
	w = W / scale - x;
	h = H / scale - y;

	if(w < 0) {

		x = x + w;
		w = w * -1;
	}

	if(h < 0) {

		y = y + h;
		h = h * -1;
	}

	if(w > 10 && h > 10) {

		tempBox = new Box(boxCount, x, y, w ,h, this);
		this.pushBox(tempBox);
	}

	activeBox = boxCount - 1;
	this.render();
}

function resizeBox(boxId, region) {

	var index = this.getIndex(boxId);

	var box = this.boxes[index];

	activeBox = boxId;

	if(region == 1) {

		var deltaX = box.x - mouseMove_X / scale;
		var deltaY = box.y - mouseMove_Y / scale;

		var x1 = box.x + box.w;
		var y1 = box.y + box.h;

		box.w = box.w + deltaX;
		box.h = box.h + deltaY;

		box.x = x1 - box.w;
		box.y = y1 - box.h;

		this.render();
	}

	if(region == 2) {

		var deltaX = mouseMove_X / scale - box.x - box.w;
		var deltaY = box.y - mouseMove_Y / scale;

		var y1 = box.y + box.h;

		box.w = box.w + deltaX;
		box.h = box.h + deltaY;

		box.y = y1 - box.h;

		this.render();
	}

	if(region == 3) {

		var deltaX = mouseMove_X / scale - box.x - box.w;
		var deltaY = mouseMove_Y / scale - box.y - box.h;

		box.w = box.w + deltaX;
		box.h = box.h + deltaY;

		this.render();
	}

	if(region == 4) {

		var deltaX = box.x - mouseMove_X / scale;
		var deltaY = mouseMove_Y / scale - box.y - box.h;

		var x1 = box.x + box.w;

		box.w = box.w + deltaX;
		box.h = box.h + deltaY;

		box.x = x1 - box.w;

		this.render();
	}
}

function dragBox(boxId, deltaX, deltaY) {

	var index = this.getIndex(boxId);

	var box = this.boxes[index];

	activeBox = boxId;

	box.x = box.x + deltaX / scale;
	box.y = box.y + deltaY / scale;

	this.render();
}

function labelBox(label) {

	var index = this.getIndex(activeBox);
	this.boxes[index].label = label;

	this.render();
}

function Box(id, x, y, w, h, image){

	//Box class
	//attributes
	this.id = id;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.image = image;
	this.label = "";

	//methods
	this.draw = draw;
}

function draw(height) {

	x = Math.floor(this.x * scale);
	y = Math.floor(this.y * scale);
	w = Math.floor(this.w * scale);
	h = Math.floor(this.h * scale);


	ctx.lineWidth = 3;

	if(this.id == activeBox)
		ctx.strokeStyle = "#00ff00";

	else
		ctx.strokeStyle = "#ffff00";

	ctx.strokeRect(x, y, w ,h);
}

function getIndex(boxId) {

	var index = -1;

	for(var i = 0; i < this.num_boxes; i++) {

		if(this.boxes[i].id == boxId) {

			index = i;
			break;
		}
	}

	return index;
}