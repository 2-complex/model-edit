
var Editor = function Editor() {}

Editor.presentError = function(message)
{
    var errorDiv = document.getElementById('errorview');
    errorDiv.innerHTML = message;
}

Editor.refreshModel = function(code)
{
    Bindings.setString(code);
    document.getElementById("modelview").style.opacity = 1.0;
}

Editor.getTextFile = function(path)
{
    var xmlhttp = new XMLHttpRequest();
    var url = path;

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            Editor.aceEditor.getSession().setValue(xmlhttp.responseText);
            Editor.refreshModel(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

var myEditorTimeoutVar = null;

Editor.changedEventTrap = function(e)
{
    if( myEditorTimeoutVar )
    {
        window.clearTimeout(myEditorTimeoutVar);
    }
    myEditorTimeoutVar = window.setTimeout(Editor.changed, 200);
}

Editor.changed = function()
{
    var editor = ace.edit("editor");
    var annotations = editor.getSession().getAnnotations();
    if( annotations.length == 0 )
    {
        document.getElementById("modelview").style.opacity = 1.0;
        Editor.refreshModel(editor.getSession().getValue());
    }
    else
    {
        document.getElementById("modelview").style.opacity = 0.5;
    }
}

Editor.initEditor = function()
{
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/json");
    Editor.aceEditor = editor;

    Editor.getTextFile('workspace/box.model');

    editor.getSession().on("changeAnnotation", Editor.changedEventTrap);
}

