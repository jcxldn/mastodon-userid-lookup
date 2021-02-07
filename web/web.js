import lookup from "../index"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import jQuery from "jquery"

const mastodonFullRegex = /^(@)[a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+)?(@)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))(.)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))/i;

jQuery("form").ready(function () {
  jQuery("form").submit(function (e) {
    console.log("SUBMIT");
    e.preventDefault();
    validate();
  });

  jQuery("button").click(function (e) {
    console.log("BTN CLICK");
    e.preventDefault();
    validate();
  });
});

function validate() {
  jQuery(".res").html("Searching...");
  console.clear();
  const username = jQuery("#username").val();

  const isValid = mastodonFullRegex.test(username);

  console.log(`is valid: jQuery{isValid}`);

  if (isValid) {
    lookup(username).then(uid => {
        console.log(`uid: ${uid}`);
        jQuery(".res").html(`User found!<br> Your ID is <b>${uid}</b>.</br>`);
    }).catch(err => {
        console.log("in err:" + err)
        console.error(err)
        jQuery(".res").html("User or domain not found. Please try again.");
    })
  } else {
    jQuery(".res").html("Invalid username.");
  }
}
