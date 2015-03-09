

var MouseController = function(canvas, program)
{
    this.canvas = canvas;
    this.isMouseDown = false;

    $(canvas).mousewheel(this.onMouseWheel.bind(this));
    canvas.onmousedown = this.onMouseDown.bind(this);
    canvas.onmouseup = this.onMouseUp.bind(this);
    canvas.onmousemove = this.onMouseMove.bind(this);
    canvas.onmouseleave = this.onMouseLeave.bind(this);
}

MouseController.prototype.getLocalCoord = function(theEvent)
{
    return { x: theEvent.clientX, y: this.canvas.height - theEvent.clientY };
}

MouseController.prototype.onMouseDown = function(theEvent)
{
    var e = this.getLocalCoord(theEvent);
    this.isMouseDown = true;
    Bindings.mouseDown(e.x, e.y);
}

MouseController.prototype.onMouseUp = function(theEvent)
{
    var e = this.getLocalCoord(theEvent);
    this.isMouseDown = false;
    Bindings.mouseUp(e.x, e.y);
}

MouseController.prototype.onMouseMove = function(theEvent)
{
    var e = this.getLocalCoord(theEvent);

    if( this.isMouseDown )
    {
        Bindings.mouseDragged(e.x, e.y);
    }
}

MouseController.prototype.onMouseLeave = function(theEvent)
{
    this.isMouseDown = false;
}

MouseController.prototype.onMouseWheel = function(theEvent)
{
    Bindings.mouseWheel(theEvent.deltaY);
}

var Bindings = function Bindings() {}

function initBindings()
{
    Bindings.init = Module.cwrap("init", "", []);
    Bindings.resize = Module.cwrap("resize", "", ["number", "number"]);
    Bindings.step = Module.cwrap("step", "", ["number"]);
    Bindings.draw = Module.cwrap("draw", "", []);

    Bindings.mouseDown = Module.cwrap("mouseDown", "", ["number", "number"]);
    Bindings.mouseDragged = Module.cwrap("mouseDragged", "", ["number", "number"]);
    Bindings.mouseUp = Module.cwrap("mouseUp", "", ["number", "number"]);

    Bindings.mouseWheel = Module.cwrap("mouseWheel", "", ["number"]);

    Bindings.setString = Module.cwrap("setString", "", ["string"]);
}

var Bank = function Bank() {}

function handleTextureLoaded(image, texture, mipmaps)
{
    var gl = GLctx;

    _glBindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if( mipmaps )
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    _glBindTexture(gl.TEXTURE_2D, 0);
}

Bank.initTextureWithPath = function(path, texture, mipmaps)
{
    var image = new Image();
    image.onload = function() { handleTextureLoaded(image, texture, mipmaps); }
    image.src = path;
}

var Program = function Program(canvas)
{
    this.canvas = canvas;
    this.translation = { originX: 0, originY: 0, zoom: 1.0 };

    this.resizeCanvas();
    Bindings.resize(canvas.width, canvas.height);

    Bindings.init();

    this.mouseController = new MouseController(canvas, this);

    this.invalidate();

    this.canvas.addEventListener('resize', this.resizeCanvas.bind(this));
}

Program.instantiate = function(canvas)
{
    Program.instance = Program.instance || new Program(canvas);
}

Program.get = function()
{
    return  Program.instance || null;
}

Program.prototype.render = function()
{
    this.resizeCanvas();

    Bindings.step((new Date).getTime() / 1000.0);
    Bindings.draw();

    this.invalidate();
}

Program.prototype.resizeCanvas = function()
{
   // only change the size of the canvas if the size it's being displayed
   // has changed.
   var width = this.canvas.clientWidth;
   var height = this.canvas.clientHeight;
   if (this.canvas.width != width ||
       this.canvas.height != height)
   {
        // Change the size of the canvas to match the size it's being displayed
        this.canvas.width = width;
        this.canvas.height = height;

        Bindings.resize(this.canvas.width, this.canvas.height);
   }
}

Program.prototype.invalidate = function()
{
    window.requestAnimationFrame(this.render.bind(this));
}


