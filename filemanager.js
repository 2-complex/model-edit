

function FileManager() {}

FileManager.add = function(file, target_path)
{
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function(event)
    {
        var source = this.result;
        var img = new Image();
        var filename = file.name;
        var data = event.target.result;

        w2ui['sidebar'].add(target_path, [
        {
            id: target_path + '/' + filename,
            text: filename,
            img: "icon-page"
        }]);

        img.onload = function()
        {
            $.ajax({
                type: "POST",
                url: "upload-image",
                data: {filename: filename, data: data, target_path: target_path},
                success: function() {console.log("upload image success");},
                dataType: "text"
            });
        }
        img.src = source; // triggers load
    };
}

FileManager.remove = function(path)
{
    w2ui['sidebar'].remove(path);
    FileManager.issueCommand('rm/' + path);
}

FileManager.mkdir = function(path)
{
    FileManager.issueCommand('mkdir/' + path);
}

FileManager.move = function(source_path, target_path)
{
    var components = target_path.split('/');
    var parent_path = components.slice(0, components.length-1).join('/');

    var node = w2ui['sidebar'].find({id:source_path})[0];
    var type = node.type;
    var icon = node.icon;
    var nodes = node.nodes;

    w2ui['sidebar'].remove(source_path);

    w2ui['sidebar'].add(parent_path, [
    {
        id: target_path,
        text: components.slice(components.length-1),
        type: type,
        icon: icon,
        nodes: nodes
    }]);

    FileManager.issueCommand('mv/' + source_path + ':' + target_path);
}


FileManager.rename = function(oldpath, newname)
{
    var components = oldpath.split('/');
    var dir = components.slice(0, components.length - 1).join('/');

    var source_path = oldpath
    var target_path = dir + '/' + newname;

    FileManager.issueCommand('mv/' + source_path + ':' + target_path);
}


function recursive_style_update(obj)
{
    if( obj.type == "directory" )
    {
        obj.icon = "fa fa-folder-o fa-fw";
    }
    if( obj.type == "file" )
    {
        obj.icon = "fa fa-file fa-fw";
    }

    var nodes = obj.nodes || [];
    for( var i = 0; i < nodes.length; i++ )
    {
        recursive_style_update( nodes[i] );
    }

    return obj;
}

FileManager.getCompleteList = function()
{
    var xmlhttp = new XMLHttpRequest();
    var url = "ls";

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            install_sidebar(recursive_style_update(JSON.parse(xmlhttp.responseText).nodes));
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

FileManager.issueCommand = function(command)
{
    var xmlhttp = new XMLHttpRequest();
    var url = command;

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            console.log("command issued");
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

