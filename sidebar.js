

function get_ls()
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


function issueCommand(command)
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

function endsWith(str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
                { id: 3, text: 'Delete', icon: 'fa-minus' }
            ],
            onMenuClick: function( event )
            {
                console.log(event);
                var path = event.target.slice(10); // remove "workspace/"
                issueCommand('rm/' + path);
                w2ui['sidebar'].remove(event.target);
            },
            onFocus: function( event )
            {
                console.log('focus: ', this.name, event);
                // event.preventDefault();
            },
            onBlur: function( event )
            {
                console.log('blur: ', this.name, event);
                // event.preventDefault();
            },
            //onKeydown: function (event) { console.log('keyboard', event); event.preventDefault(); },
            nodes: lsObject.nodes,

            onClick: function( event )
            {
                console.log('click', event.target, event);
                if( endsWith(event.target, ".model") )
                {
                    Editor.getTextFile(event.target);
                }
            }
        });
    });
}

get_ls()
