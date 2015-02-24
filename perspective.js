function presentError(message)
{
    var errorDiv = document.getElementById('errorview');
    errorDiv.innerHTML = message;
}

var gCanvas;
var gl;
var effect;
var geometry;

function resizeCanvas()
{
    var canvas = gCanvas;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    if (canvas.width != width || canvas.height != height)
    {
        canvas.width = width;
        canvas.height = height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    clear(gl);
    draw(gl, effect, geometry, canvas.width / canvas.height);
}

function getWebGLContext()
{
    var canvas = document.getElementById('modelview');
    gCanvas = canvas;

    var gl;
    if (canvas.getContext)
    {
        try
        {
            gl = canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
        }
        catch(e)
        {
            presentError( "getting gl context threw exception" );
        }
    }
    else
    {
        presentError( "can't get context" );
    }

    gl = WebGLDebugUtils.makeDebugContext(gl);

    return gl;
}

function clear(gl)
{
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function makeGeometry(gl)
{
    var vertices = [];

    for (var x = -1; x < 2; x+=2)
    {
        for (var y = -1; y < 2; y+=2)
        {
            for (var z = -1; z < 2; z+=2)
            {
                vertices.push(x, y, z);
            }
        }
    }

    var indices = [
        0, 1, 3, 0, 3, 2,
        4, 5, 7, 4, 7, 6,
        0, 2, 6, 0, 6, 4,
        1, 7, 3, 1, 5, 7,
        2, 3, 7, 2, 7, 6,
        0, 5, 1, 0, 4, 5
    ];

    var array = new Float32Array(vertices);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

    var indexArray = new Uint16Array(indices);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

    return {
        buffer: buffer,
        indexBuffer: indexBuffer,
        numVertices: array.length / 3,
        numTriangles: indexArray.length / 3
    };
}

function makeShader(gl, type, code)
{
    var shader = gl.createShader(type);
    gl.shaderSource(
        shader,
        "#ifdef GL_ES\nprecision highp float;\n#endif\n" +
        code);
    gl.compileShader(shader);
    var log = gl.getShaderInfoLog(shader);
    if( log )
    {
        presentError('Shader compile failed with error log:\n' + log);
    }
    return shader;
}

function makeEffect(gl, vertexCode, fragmentCode, attributes)
{
    var program = gl.createProgram();

    var vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexCode);
    gl.attachShader(program, vertexShader);

    var fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, fragmentCode);
    gl.attachShader(program, fragmentShader);

    for (var name in attributes)
    {
        var index = attributes[name];
        gl.bindAttribLocation(program, index, name);
    }

    gl.linkProgram(program);

    var log = gl.getProgramInfoLog(program);
    if( log )
    {
        presentError('Link failed with error log:\n' + log);
    }

    return {program: program, attributes: attributes};
}

function draw(gl, effect, geometry, aspectRatio)
{
    gl.useProgram(effect.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);

    for (var name in effect.attributes)
    {
        gl.enableVertexAttribArray(effect.attributes[name]);
    }

    var projection = gl.getUniformLocation(effect.program, 'projection');
    gl.uniformMatrix4fv(projection, false,
        perspective(Math.PI / 5, aspectRatio, 0.1, 100.0) );

    var modelView = gl.getUniformLocation(effect.program, 'modelView');
    gl.uniformMatrix4fv(modelView, false, lookAt([5,4,3], [0,0,0], [0,1,0]) );

    var kFloatSize = Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(effect.attributes[name],
        3, gl.FLOAT, false, 3 * kFloatSize, 0 * kFloatSize);

    gl.drawElements(gl.TRIANGLES, 3 * geometry.numTriangles, gl.UNSIGNED_SHORT, 0);

    for (var name in effect.attributes)
    {
        gl.disableVertexAttribArray(effect.attributes[name]);
    }
}

function main()
{
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/json");

    gl = getWebGLContext();

    gl.enable(gl.DEPTH_TEST);

    geometry = makeGeometry(gl);

    var modelObject = JSON.parse(editor.getSession().getValue());

    var vertexShaderCode = modelObject["vertexCode"];
    var fragmentShaderCode = modelObject["fragmentCode"];

    var attributes = {'position' : 0};
    effect = makeEffect(gl, vertexShaderCode, fragmentShaderCode, attributes);

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
}
