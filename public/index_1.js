$(document).ready(function() {
  $(".last").each(function() {
    var memberID = $(this).data("id"); // get the member ID from the data attribute
    var list = $(this).data("list"); // get the list name from the data attribute
    var icon = $(this).find("i"); // get the icon element

    // check if the member is in the list
    $.ajax({
      url: "/checkid/" + list,
      type: "post",
      data: { addsub: memberID },
      success: function(data) {
        console.log(data);
        if (data.exists) {
          // member is already in the list, show the trash icon
          icon.removeClass("fa-user-plus").addClass("fa-trash");
        } else {
          // member is not in the list, show the plus icon
          icon.removeClass("fa-trash").addClass("fa-user-plus");
        }
      },
      error: function() {
        console.log("Error while checking member in the list");
      }
    });

    // Schedule the deletion after 2 minutes
    setTimeout(function() {
      // Perform the deletion operation
      $.ajax({
        url: "/deleteid/" + list,
        type: "post",
        data: { addsub: memberID },
        success: function() {
          console.log("Member removed from the list");
          // Check if the member still exists in the list
          $.ajax({
            url: "/checkid/" + list,
            type: "post",
            data: { addsub: memberID },
            success: function(data) {
              if (data.exists) {
                icon.removeClass("fa-trash").addClass("fa-user-plus");
              } else {
                icon.toggleClass("fa-user-plus fa-trash");
              }
            },
            error: function() {
              console.log("Error while checking member in the list");
            }
          });
        },
        error: function() {
          console.log("Error while removing member from the list");
        }
      });
    }, 10 * 1000); // 10 secsd in milliseconds
  });
});

function reloadPage() {
  location.reload();
}

$("body").on("click", ".last", function() {
  // your click handler code here
  var memberID = $(this).data("id"); // get the member ID from the data attribute
  var list = $(this).data("list"); // get the list name from the data attribute
  var icon = $(this).find("i"); // get the icon element

  if (icon.hasClass("fa-user-plus")) {
    $.ajax({
      url: "/addid/" + list,
      type: "post",
      data: { addsub: memberID },
      success: function() {
        icon.toggleClass("fa-user-plus fa-trash");
        console.log("Member added to the list");
        reloadPage();
      },
      error: function() {
        console.log("Error while adding member to the list");
      }
    });
  } else if (icon.hasClass("fa-trash")) {
    $.ajax({
      url: "/deleteid/" + list,
      type: "post",
      data: { addsub: memberID },
      success: function() {
        console.log("Member removed from the list");
        reloadPage();
      },
      error: function() {
        console.log("Error while removing member from the list");
      }
    });
  }
});
