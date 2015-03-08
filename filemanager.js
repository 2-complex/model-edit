

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


FileManager.move = function(source_path, target_path)
{
    var components = target_path.split('/');
    var parent_path = components.slice(0, components.length-1).join('/');

    w2ui['sidebar'].remove(source_path);

    w2ui['sidebar'].add(parent_path, [
        {
            id: target_path,
            text: components.slice(components.length-1),
            img: "icon-page"
        }]);

    FileManager.issueCommand('mv/' + source_path + ':' + target_path);
}


FileManager.rename = function(oldpath, newname)
{
    var components = oldpath.split('/');
    var dir = components.slice(0, components.length - 1).join('/');

    FileManager.move(oldpath, dir + '/' + newname);
}

FileManager.getCompleteList = function()
{
    var xmlhttp = new XMLHttpRequest();
    var url = "ls";

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            install_sidebar(JSON.parse(xmlhttp.responseText));
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

