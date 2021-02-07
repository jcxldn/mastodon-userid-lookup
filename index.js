const fetch = require("node-fetch")
const parser = require("fast-xml-parser");

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

    console.log(`uid a: "${uid_a}"`)
    console.log(`uid b: "${uid_b}"`);

    // Check that two two user ids match or something has gone wrong
    if (uid_a != uid_b) {
        console.error("Parsed User Ids do not match!");
        return null;
    }

    console.log("uids match!, returning")

    // Both of them match so it does not matter which one we return.
    return uid_a;
}

const getUidFromCdnUrl = url => {
  return url
    .split("/avatars/")[1]  // returns 'XXX/XXX/XXX/original/XXXXXX.png
    .split("/original/")[0] // returns 'XXX/XXX/XXX'
    .replace(/\//g, "") // returns XXXXXXXXX
    
}

//getUserId("@unarist@mstdn.maud.io");
//getUserId("@Kelwing@awoo.chat");

module.exports = getUserId;