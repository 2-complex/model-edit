
function endsWith(str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var fileReplacerCounter = 0;

function adjust_children(oldpath, newpath)
{
    console.log(oldpath + " " + newpath);
    var node = w2ui['sidebar'].find({id:oldpath})[0];

    var components = newpath.split('/');
    var newname = components.slice(components.length-1).join('');

    var nodes = node.nodes || [];
    for( var i = 0; i < nodes.length; i++ )
    {
        adjust_children(
            oldpath + '/' + nodes[i].text,
            newpath + '/' + nodes[i].text );
    }

    node.id = newpath;
    node.text = newname;
}

function replace_filename(oldpath)
{
    if( fileReplacerCounter )
    {
        fileReplacerCounter = 0;

        var newname = document.getElementById('change_file_name_input').value;
        var components = oldpath.split('/');
        var parent = components.slice(0, components.length-1).join('/');
        var node = w2ui['sidebar'].find({id:oldpath})[0];
        var nodes = node.nodes;
        var newpath = parent + '/' + newname;

        adjust_children(oldpath, newpath)

        w2ui['sidebar'].refresh();

        FileManager.rename(oldpath, newname);
    }
}

function newEditNodeHtml(text, path, function_name)
{
    var replacer_text = "<input"
        + " id=\"change_file_name_input\" value=\"" + text + "\" "
        + " onblur=\"" + function_name + "('" + path + "');\" "
        + " onkeydown=\"if (event.keyCode == 13) {" + function_name + "('" + path + "');}\" "
        + " >";

    var nodes = w2ui['sidebar'].find({id:path})[0].nodes;
    w2ui['sidebar'].set(path, {text : replacer_text, nodes : nodes});

    fileReplacerCounter = 1;
}

function install_sidebar(lsObject)
{
    $(function ()
    {
        $('#sidebar').w2sidebar(
        {
            name : 'sidebar',
            style : 'border: 1px solid silver',
            routeData : { id: 59, vid: '23.323.4' },
            menu: [
                { text: 'Rename', icon: 'fa fa-pencil fa-fw' },
                { text: 'New Folder', icon: 'fa fa-plus fa-fw' },
                { text: 'New Model', icon: 'fa fa-plus fa-fw' },
                { text: 'Delete', icon: 'fa fa-trash-o' }
            ],
            onMenuClick: function( e )
            {
                var path = e.target;

                if ( e.menuItem.text == "Delete" )
                {
                    FileManager.remove(path);
                }
                else if ( e.menuItem.text == "Rename" )
                {
                    var node = w2ui['sidebar'].find({id:path})[0];
                    var text = node.text;
                    newEditNodeHtml(text, path, "replace_filename");
                    document.getElementById('change_file_name_input').focus();
                }
                else if ( e.menuItem.text == "New Folder" )
                {
                    var node = w2ui['sidebar'].add("workspace",
                        { id: "workspace/newfolder", text: "newfolder", type: "directory", icon: "fa fa-folder-o fa-fw" } );

                    FileManager.mkdir("workspace/newfolder");

                    newEditNodeHtml("newfolder", "workspace/newfolder", "replace_filename");
                    document.getElementById('change_file_name_input').focus();
                }
            },
            onFocus: function( e )
            {
                console.log('focus: ', this.name, e);
                // event.preventDefault();
            },
            onBlur: function( e )
            {
                console.log('blur: ', this.name, e);
                // event.preventDefault();
            },
            //onKeydown: function (event) { console.log('keyboard', event); event.preventDefault(); },
            nodes: lsObject,

            onClick: function( event )
            {
                var canvas = document.getElementById("modelview");
                var img = document.getElementById("imageview");

                if( endsWith(event.target, ".model") )
                {
                    w2ui['layout'].show('right');
                    w2ui['layout'].show('preview');
                    Editor.getTextFile(event.target);

                    canvas.hidden = false;
                    img.hidden = true;
                }
                else if (
                    endsWith(event.target, ".jpg") ||
                    endsWith(event.target, ".jpeg") ||
                    endsWith(event.target, ".png") )
                {
                    w2ui['layout'].hide('right');
                    w2ui['layout'].hide('preview');
                    var canvas = document.getElementById("modelview");
                    canvas.hidden = true;
                    img.hidden = false;
                    img.src = event.target.slice(10);
                }
            },

            onRefresh: function( event )
            {
                var nodes = $(".w2ui-node");
                for( var i = 0; i < nodes.length; i++ )
                {
                    nodes[i].draggable = true;
                }
            }
        });
    });
}


