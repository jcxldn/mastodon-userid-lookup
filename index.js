const fetch = require("node-fetch")
const parser = require("fast-xml-parser");

/**
 * Gets the user ID from a Mastodon Username
 * 
 * @param {String} username eg. \@unarist\@mstdn.maud.io
 * @returns {Promise<String>} User ID as a string
 */
const getUserId = async username => {
    const user = username.split("@")[1];
    const hostname = username.split("@")[2];

    console.log(`hostname: ${hostname}`);

    const rss = await fetch(`https://${hostname}/@${user}.rss`).then(res => res.text())

    if (!parser.validate(rss)) {
        console.error("Recieved RSS not valid!")
        return null;
    }

    // rss is valid
    const rssJson = parser.parse(rss)

    const imageCdnUrl = rssJson.rss.channel.image.url;
    const webfeedsIconCdnUrl = rssJson.rss.channel.image.url;

    // Grab the user id from two sources
    const uid_a = getUidFromCdnUrl(imageCdnUrl);
    const uid_b = getUidFromCdnUrl(webfeedsIconCdnUrl);
    // console.log(rssJson.rss.channel["webfeeds:cover"]); no longer works

    console.log(`Found UIDs: "${uid_a}", "${uid_b}`)

    // Check that two two user ids match or something has gone wrong
    if (uid_a != uid_b) {
        console.error("Parsed User Ids do not match!");
        return null;
    }

    // Both of them match so it doesn't matter which one we return.
    return uid_a;
}

const getUidFromCdnUrl = url => {
  return url
    .split("/avatars/")[1]  // returns 'XXX/XXX/XXX/original/XXXXXX.png
    .split("/original/")[0] // returns 'XXX/XXX/XXX'
    .replace(/\//g, "") // returns XXXXXXXXX
    
}

module.exports = getUserId;