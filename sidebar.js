
function endsWith(str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


function replace_filename(oldpath)
{
    var newname = document.getElementById('change_file_name_input').value;
    var components = oldpath.split('/');
    var parent = components.slice(0, components.length-1).join('/');
    w2ui['sidebar'].set(oldpath, {id: parent + '/' + newname, text : newname});

    FileManager.rename(oldpath, newname);
}

function make_new_folder(oldpath)
{
    var newname = document.getElementById('change_file_name_input').value;
    w2ui['sidebar'].set(oldpath, {text : newname});

    // FileManager.mkdir(oldpath, newname);
}

function newEditNodeHtml(text, path, function_name)
{
    var replacer_text = "<input"
        + " id=\"change_file_name_input\" value=\"" + text + "\" "
        + " onblur=\"" + function_name + "('" + path + "');\" "
        + " onkeydown=\"if (event.keyCode == 13) {" + function_name + "('" + path + "');}\" "
        + " >";

    w2ui['sidebar'].set(path, {text : replacer_text});
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

                    newEditNodeHtml("newfolder", "workspace/newfolder", "make_new_folder");
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


