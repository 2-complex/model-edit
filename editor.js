
var Editor = function Editor() {}

Editor.presentError = function(message)
{
    var errorDiv = document.getElementById('errorview');
    errorDiv.innerHTML = message;
}

Editor.initEditor = function()
{
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/json");

    Editor.aceEditor = editor;
}

