
var Editor = function Editor() {}

Editor.presentError = function(message)
{
    var errorDiv = document.getElementById('errorview');
    errorDiv.innerHTML = message;
}

Editor.getTextFile = function(path)
{
    var xmlhttp = new XMLHttpRequest();
    var url = path;

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            myFunction(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(s)
    {
        Editor.aceEditor.getSession().setValue(s);
    }
}

Editor.initEditor = function()
{
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/json");
    Editor.aceEditor = editor;

    Editor.getTextFile('workspace/box.model')
}

