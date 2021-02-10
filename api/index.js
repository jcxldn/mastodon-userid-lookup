const fetch = require("node-fetch")
const parser = require("fast-xml-parser");

const UsernameValidationError = require("./errors/UsernameValidationError")
const UsernameLookupError = require("./errors/UsernameLookupError");

// Regex for a valid mastodon username
const mastodonFullRegex = /^(@)[a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+)?(@)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))(.)([a-z0-9_]+([a-z0-9_\.]+[a-z0-9_]+))/i;


/**
 * Gets the user ID from a Mastodon Username
 * 
 * @param {String} username eg. \@unarist\@mstdn.maud.io
 * @returns {Promise<String>} User ID as a string
 */
const getUserId = async username => {
    // Test the username provided against a regex
    const isValid = mastodonFullRegex.test(username);

    if (!isValid) throw new UsernameValidationError();

    const user = username.split("@")[1];
    const hostname = username.split("@")[2];

    console.log(`hostname: ${hostname}`);

    const rss = await fetch(`https://${hostname}/@${user}.rss`).then(res => res.text());

    if (!parser.validate(rss)) throw new UsernameLookupError("Recieved RSS not valid!");

    // rss is valid
    const rssJson = parser.parse(rss);

    const imageCdnUrl = rssJson.rss.channel.image.url;
    const webfeedsIconCdnUrl = rssJson.rss.channel.image.url;

    // Grab the user id from two sources
    const uid_a = getUidFromCdnUrl(imageCdnUrl);
    const uid_b = getUidFromCdnUrl(webfeedsIconCdnUrl);
    // console.log(rssJson.rss.channel["webfeeds:cover"]); no longer works

    console.log(`Found UIDs: "${uid_a}", "${uid_b}"`);

    // Check that two two user ids match or something has gone wrong
    if (uid_a != uid_b) throw new UsernameLookupError("Found mismatching user ids!");

    // Both of them match so it doesn't matter which one we return.
    return uid_a;
}

const getUidFromCdnUrl = url => {
    return url
        .split("/avatars/")[1]  // returns 'XXX/XXX/XXX/original/XXXXXX.png
        .split("/original/")[0] // returns 'XXX/XXX/XXX'
        .replace(/\//g, ""); // returns XXXXXXXXX
    
}

module.exports = getUserId;