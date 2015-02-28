

function get_ls()
{
    var xmlhttp = new XMLHttpRequest();
    var url = "ls";

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            myFunction(JSON.parse(xmlhttp.responseText));
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr)
    {
        install_sidebar(arr);
    }
}


function install_sidebar(lsObject)
{
    $(function () {
        $('#sidebar').w2sidebar({
            name : 'sidebar',
            img : null,
            topHTML : '<div style="padding: 10px 5px; border-bottom: 1px solid #aaa;"></div>',
            bottomHTML : '<div style="padding: 10px 5px; border-top: 1px solid #aaa;"></div>',
            style : 'border: 1px solid silver',
            routeData : { id: 59, vid: '23.323.4' },
            menu: [
                { id: 1, text: 'Select Item', icon: 'fa-star' },
                { id: 2, text: 'View Item', icon: 'fa-camera' },
                { id: 4, text: 'Delete Item', icon: 'fa-minus' }
            ],
            onMenuClick: function (event)
            {
                console.log(event);
            },
            onFocus: function (event)
            {
                console.log('focus: ', this.name, event);
                // event.preventDefault();
            },
            onBlur: function (event)
            {
                console.log('blur: ', this.name, event);
                // event.preventDefault();
            },
            //onKeydown: function (event) { console.log('keyboard', event); event.preventDefault(); },
            nodes: lsObject.nodes,

            onClick: function (event) {
                console.log('click', event.target, event);
            }
        });
    });
}

get_ls()
