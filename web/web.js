import lookup from "../api/index"
import UsernameLookupError from "../api/errors/UsernameLookupError"
import UsernameValidationError from "../api/errors/UsernameValidationError"

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import jQuery from "jquery"

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

  lookup(username).then(uid => {
    jQuery(".res").html(`User found!<br> Your ID is <b>${uid}</b>.</br>`);
  }).catch(err => {
    jQuery(".res").html(
      err instanceof UsernameValidationError ? "Invalid username." :
        err instanceof UsernameLookupError ? "Username could not be resolved. Please try again." :
          "User or domain not found. Please try again."
    )
  })
}
