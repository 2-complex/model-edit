

function addFile(file, target_path)
{
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function(event)
    {
        var source = this.result;
        var img = new Image();
        var filename = file.name;
        var data = event.target.result;

        w2ui['sidebar'].add(target_path, [{
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
        img.src = source; // triggers the load
    };
}

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

if(typeof(String.prototype.contains) === "undefined")
{
    String.prototype.contains = function(s)
    {
        return String(this).indexOf(s) > -1;
    };
}

function initDragon()
{

    function getDraggableSidebarInfo(e)
    {
        if( e.target.className.contains("w2ui-node") )
        {
            var path = event.target.id.slice(5);
            var nodes = w2ui['sidebar'].find({id:path});
            if( nodes.length > 0 )
            {
                var node = nodes[0];
                if( node.type == "directory" )
                {
                    return { path: node.id, highlight: e.target };
                }
                else
                {
                    return { path: node.parent.id, highlight: e.target.parentElement };
                }
            }
        }

        return null;
    }

    document.addEventListener("dragstart", function(event)
    {
        event.dataTransfer.setData("Text", event.target.id);
        //event.target.style.opacity = "0.4";
    });

    // When the draggable element enters the droptarget, change the DIVS's border style
    document.addEventListener("dragenter", function(event)
    {
        if ( event.target.className.contains("w2ui-node") )
        {
            var info = getDraggableSidebarInfo(event);
            if( info )
            {
                info.highlight.style.border = "1px dotted green";
            }
        }
    });

    // By default, data/elements cannot be dropped in other elements.
    // To allow a drop, we must prevent the default handling of the element
    document.addEventListener("dragover", function(event)
    {
        event.preventDefault();

        var info = getDraggableSidebarInfo(event);
        if( info )
        {
            info.highlight.style.border = "1px dotted green";
        }
    });

    // When the draggable p element leaves the droptarget, reset the DIVS's border style
    document.addEventListener("dragleave", function(event)
    {
        var info = getDraggableSidebarInfo(event);
        if( info )
        {
            info.highlight.style.border = "1px";
        }
    });

    document.addEventListener("drop", function(e)
    {
        e.preventDefault(); // (Which is to open it)

        var info = getDraggableSidebarInfo(event);
        if( info )
        {
            info.highlight.style.border = "1px";
        }

        for(var i = 0; i < e.dataTransfer.files.length; i++)
        {
            addFile(e.dataTransfer.files[i], info.path);
        }
    });

}

