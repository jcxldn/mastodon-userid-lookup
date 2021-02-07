import lookup from "../index"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import jQuery from "jquery"

const mastodonFullRegex = /^(@)[a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+)?(@)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))(.)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))/i;

jQuery(() => {
  jQuery("form").on("submit", e => {
    console.log("Submit event (enter button pressed)");
    e.preventDefault();
    validate();
  })

  jQuery("button").on("click", e => {
    console.log("Click event (Lookup button clicked)");
    e.preventDefault();
    validate();
  })
})

const validate = () => {
  jQuery(".res").html("Searching...");

  const username = jQuery("#username").val();

  const isValid = mastodonFullRegex.test(username);

  if (isValid) {
    lookup(username).then(uid => {
        jQuery(".res").html(`User found!<br> Your ID is <b>${uid}</b>.</br>`);
    }).catch(err => {
        console.error(err)
        jQuery(".res").html("User or domain not found. Please try again.");
    })
  } else {
    jQuery(".res").html("Invalid username.");
  }
}
