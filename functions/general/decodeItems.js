
// IMPORTING ALL NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');


const decodeItems = (items) => {
    let decoded = [];
    for (let key of Object.keys(items)) {
        let current = items[key];
        decoded.push({
            id: current.key,
            item_seller_id: current.item_seller_id,
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

const decodeItem = (object) => {
    let objectReturn = {};
    for (let key of Object.keys(object)) {
        objectReturn[key] = JSON.parse('"'+htmlencode.htmlDecode(object[key])+'"')
    }
    return objectReturn
}

module.exports = { decodeItems, decodeItem }