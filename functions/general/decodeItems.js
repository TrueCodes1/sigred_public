
const decodeItems = (items) => {
    let decoded = [];
    for (let key of Object.keys(items)) {
        let current = items[key];
        decoded.push({
            item_desc: JSON.parse('"'+htmlencode.htmlDecode(current.item_desc)+'"'),
            item_location: JSON.parse('"'+htmlencode.htmlDecode(current.item_location)+'"'),
            item_name: JSON.parse('"'+htmlencode.htmlDecode(current.item_name)+'"'),
            item_price: JSON.parse('"'+htmlencode.htmlDecode(current.item_price)+'"'),
            item_seller: JSON.parse('"'+htmlencode.htmlDecode(current.item_seller)+'"'),
            video_link: current.video_link,
            video_name: JSON.parse('"'+htmlencode.htmlDecode(current.video_name)+'"')
        })
    }
    return decoded
}

module.exports = { decodeItems }