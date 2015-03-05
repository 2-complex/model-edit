

function uploadImage(file, target_path)
{
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function(event)
    {
        var source = this.result;
        var img = new Image();
        var filename = file.name;
        var data = event.target.result;

        img.onload = function()
        {
            document.getElementById("errorview").appendChild(img);

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

function initDragon()
{
    // When the draggable p element enters the droptarget, change the DIVS's border style
    document.addEventListener("dragenter", function(event)
    {
        if ( event.target.className == "w2ui-node  " )
        {
            event.target.style.border = "3px dotted green";
        }
    });

    // By default, data/elements cannot be dropped in other elements.
    // To allow a drop, we must prevent the default handling of the element
    document.addEventListener("dragover", function(event)
    {
        event.preventDefault();

        if ( event.target.className == "w2ui-node  " )
        {
            event.target.style.border = "3px dotted green";
        }
    });

    // When the draggable p element leaves the droptarget, reset the DIVS's border style
    document.addEventListener("dragleave", function(event)
    {
        if ( event.target.className == "w2ui-node  " )
        {
            event.target.style.border = "0px";
        }
    });

    document.addEventListener("drop", function(e)
    {
        e.preventDefault(); // (Which is to open it)

        if ( event.target.className == "w2ui-node  " )
        {
            event.target.style.border = "0px";
        }

        uploadImage(e.dataTransfer.files[0], event.target.id.slice(5));
    });

}

