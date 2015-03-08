
function endsWith(str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


function replace_filename(oldpath)
{
    var newname = document.getElementById('change_file_name_input').value;
    w2ui['sidebar'].find({id:oldpath})[0].text = newname;
    w2ui['sidebar'].refresh();

    FileManager.rename(oldpath, newname);
}

function install_sidebar(lsObject)
{
    $(function ()
    {
        $('#sidebar').w2sidebar(
        {
            name : 'sidebar',
            img : null,
            topHTML : '<div style="padding: 10px 5px; border-bottom: 1px solid #aaa;"></div>',
            bottomHTML : '<div style="padding: 10px 5px; border-top: 1px solid #aaa;"></div>',
            style : 'border: 1px solid silver',
            routeData : { id: 59, vid: '23.323.4' },
            menu: [
                { id: 1, text: 'Rename', icon: 'fa-minus' },
                { id: 3, text: 'Delete', icon: 'fa-minus' }
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
                    node.text = "<input"
                        + " id=\"change_file_name_input\" value=\"" + text + "\" "
                        + " onblur=\"replace_filename('" + path + "');\" "
                        + " onkeydown=\"if (event.keyCode == 13) {replace_filename('" + path + "');}\" "
                        + " >";
                    w2ui['sidebar'].refresh();
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
            nodes: lsObject.nodes,

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
                else
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


