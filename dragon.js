

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

    document.addEventListener("dragstart", function(e)
    {
        e.dataTransfer.setData("Text", e.target.id);
        //e.target.style.opacity = "0.4";
    });

    // When the draggable element enters the droptarget, change the DIVS's border style
    document.addEventListener("dragenter", function(e)
    {
        if ( e.target.className.contains("w2ui-node") )
        {
            var info = getDraggableSidebarInfo(e);
            if( info )
            {
                info.highlight.style.border = "1px dotted green";
            }
        }
    });

    // By default, data/elements cannot be dropped in other elements.
    // To allow a drop, we must prevent the default handling of the element
    document.addEventListener("dragover", function(e)
    {
        e.preventDefault();

        var info = getDraggableSidebarInfo(e);
        if( info )
        {
            info.highlight.style.border = "1px dotted green";
        }
    });

    // When the draggable p element leaves the droptarget, reset the DIVS's border style
    document.addEventListener("dragleave", function(e)
    {
        var info = getDraggableSidebarInfo(e);
        if( info )
        {
            info.highlight.style.border = "1px solid transparent";
        }
    });

    document.addEventListener("drop", function(e)
    {
        e.preventDefault(); // (Which is to open it)

        var info = getDraggableSidebarInfo(e);
        if( info )
        {
            info.highlight.style.border = "1px solid transparent";

            var data = e.dataTransfer.getData("Text");
            if( data )
            {
                var comp = data.slice(5).split('/');
                var filename = comp.slice(comp-1);
                FileManager.move(data.slice(5), info.path + '/' + filename);
            }
            else
            {
                for( var i = 0; i < e.dataTransfer.files.length; i++ )
                {
                    FileManager.add(e.dataTransfer.files[i], info.path);
                }
            }
        }
    });

}

