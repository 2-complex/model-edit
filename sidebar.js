
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

function popup()
{
    $(function () {
        $().w2form({
            name: 'git-init-form',

            fields: [
                { type: 'text', required: true, name: 'Url' },
                { type: 'text', required: true, name: 'Branch' },
                { type: 'text', required: true, name: 'Token' } ],

            actions:
            {
                Sync: function (target, data)
                {
                    console.log('sync', this.fields, target, data);

                    $.ajax({
                        type: "POST",
                        url: "git-init",
                        data: {
                            git_url: this.get('Url').el.value,
                            git_branch: this.get('Branch').el.value,
                            git_token: this.get('Token').el.value },
                        success: function()
                        {
                            FileManager.getCompleteList();
                        },
                        dataType: "text"
                    });


                    this.get('Branch').el.value
                    this.get('Token').el.value
                }
            }
        });
    })

    w2popup.open({
        title   : 'Sync to git',
        width   : 700,
        height  : 500,
        showMax : true,
        body    : '<div id="form" style="position: absolute; left: 10px; right: 10px; bottom: 10px; height: 100%;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #form').w2render('git-init-form');
            }
        }
    })
}

function install_sidebar(lsObject)
{
    $(function ()
    {
        if( w2ui['sidebar'] )
            w2ui['sidebar'].destroy();

        $('#sidebar').w2sidebar(
        {
            name : 'sidebar',
            style : 'border: 1px solid silver',

            topHTML : '<button style="padding: 10px 5px; border-bottom: 1px solid #aaa;" onclick="popup()">Sync to git repo</button>',

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
            },
            onBlur: function( e )
            {
            },
            //onKeydown: function (event) { console.log('keyboard', event); event.preventDefault(); },
            nodes: lsObject,

            onClick: function( event )
            {
                var canvas = document.getElementById("modelview");
                var img = document.getElementById("imageview");

                if( endsWith(event.target, ".model") ||
                    endsWith(event.target, ".mesh") )
                {
                    w2ui['layout'].show('right');
                    w2ui['layout'].show('preview');
                    w2ui['layout'].show('main');
                    Editor.getTextFile(event.target, "ace/mode/json");

                    canvas.hidden = false;
                    img.hidden = true;
                }
                if( endsWith(event.target, ".cpp") ||
                    endsWith(event.target, ".h") )
                {
                    w2ui['layout'].show('right');
                    w2ui['layout'].hide('preview');
                    w2ui['layout'].hide('main');
                    Editor.getTextFile(event.target, "ace/mode/c_cpp");

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
                    w2ui['layout'].show('main');
                    var canvas = document.getElementById("modelview");
                    canvas.hidden = true;
                    img.hidden = false;
                    img.src = event.target;
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


