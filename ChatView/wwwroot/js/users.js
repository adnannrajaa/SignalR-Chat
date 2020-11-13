const BaseUrl = "http://localhost:57127/";
$(() => {
    loadAllUsers();
})
let loadAllUsers =()=> {
    $.ajax({
        url: BaseUrl + "api/UserAccount",
        type: "GET",
        timeout: 0,
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + localStorage.getItem("UserToken"));
        },
        success: function (response) {
            if (response.length > 0) {
                mapUserData(response)
            }
        }

    });
}

let clearUserList = () => {
    $("#UserList").empty()
}
let mapUserData = (arg_data) => {
    clearUserList()
    arg_data.map((row, index) => {
        var str = '';
        str = `<li>${index + 1} : ${row.user_name}</li>`
        $("#UserList").append(str);
    })

}
$("#loadButton").on("click", () => {
    loadAllUsers();
})
$("#sendButton").on("click", () => {
    var obj = {
        user_name: $("#userInput").val(),
        password: $("#passwordInput").val()
    }
    $.ajax({
        url: BaseUrl + "api/UserAccount",
        type: "Post",
        contentType: 'application/json; charset=utf-8',
        dataType : "json",
        data: JSON.stringify(obj),
        success: function (response) {
            alert("User Added Successfully.");
        }

    });
})

$("#loginButton").on("click", () => {
    var obj = {
        user_name: $("#userInput").val(),
        password: $("#passwordInput").val()
    }
    $.ajax({
        url: BaseUrl + "api/UserAccount/authenticate",
        type: "Post",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
        success: function (response) {
            console.log(response)
            if (response.token != null) {
                localStorage.setItem("UserToken", response.token)
                alert("User Login Successfully.");
            }
        }

    });
})