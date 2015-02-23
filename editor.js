
function presentError(message)
{
    var errorDiv = document.getElementById('errorview');
    errorDiv.innerHTML = message;
}

function initEditor()
{
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/json");
}

