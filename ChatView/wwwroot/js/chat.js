"use strict";
const BaseUrl = "http://localhost:57127/";
$(() => {
    GetUserDetails()
})

//Disable buttons until connection is established
document.getElementById("sendButton").disabled = true;
document.getElementById("sendGroupButton").disabled = true;
document.getElementById("groupButton").disabled = true;

let access_token = localStorage.getItem("UserToken");
let connection = new signalR.HubConnectionBuilder()
    .withUrl(BaseUrl + "chatHub",
        {
            accessTokenFactory: async () => {
                return access_token;
            }
        })
    .build();

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
    document.getElementById("sendGroupButton").disabled = false;
    document.getElementById("groupButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("Send", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = msg;
    document.getElementById("messagesList").appendChild(li);
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("sendGroupButton").addEventListener("click", function (event) {
    var groupName = document.getElementById("groupInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendGroupMessage", groupName, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("groupButton").addEventListener("click", function (event) {
    var roomName = document.getElementById("groupInput").value;
    connection.invoke("AddToGroup", roomName).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

let GetUserDetails = () => {
    let user = null;
    user = parseJwt(localStorage.getItem("UserToken"));
    if (!user) {
        $("#UserDetails").text("UnAuthorized")
    } else {
        var str = `User Id = ${user.user_id}, User Name = ${user.user_name}`
        $("#UserDetails").text(str)
    }
}

function parseJwt(token) {
    if (token == null || token == 'null') {

        return false;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
