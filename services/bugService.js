
var bugs = require('../data/bugs.json')
const loadash = require('lodash')
const fs = require('fs')
const PAGE_SIZE = 3
module.exports = {
    query,
    save,
    get,
    remove,
}

function query(filterBy) {
    let fillteredBugs = bugs
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        fillteredBugs = fillteredBugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    }
    if (filterBy.severity) {
        fillteredBugs = fillteredBugs.filter(bug => bug.severity <= +filterBy.severity)
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        fillteredBugs = fillteredBugs.slice(startIdx, PAGE_SIZE + startIdx)
    }
    if (filterBy.labels) {
        const labels = filterBy.labels.split(',')
        fillteredBugs = fillteredBugs.filter(bug => {
            return labels.every(label => bug.labels.includes(label))
        })
    }
    if (filterBy.sortBy) {
        fillteredBugs = loadash.orderBy(fillteredBugs, [filterBy.sortBy], [filterBy.desc])
    }

    return Promise.resolve(fillteredBugs)
}

function save(bug, loggedinUser) {
    console.log('bug', bug)
    //edit

    if (bug._id) {
        if (bug.creator._id !== loggedinUser._id) return Promise.reject('Not allowed to edit bug')
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = bug.severity
        bugToUpdate.createdAt = bug.createdAt
        bugToUpdate.labels = bug.labels


    } else {
        //create new bug
        bug._id = _makeId()
        bug.createdAt = new Date().getTime()
        bug.creator = {
            _id: loggedinUser._id,
            fullname: loggedinUser.fullname,
        }
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        })
    })
}

//lodash.uniqueId('bug');
function _makeId(length = 3) {
    // let text = ''
    // const char='b'
    // let possible = '0123456789'
    // for (let i = 0; i < length; i++) {
    //     text += possible.charAt((Math.random() * possible.length))
    // }
    // console.log('text', text)
    // return char + text;

    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function remove(bugId, loggedinUser) {
    const idx  = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Bug not found')
    const bug = bugs[idx]
    if (bug.creator._id !== loggedinUser._id) return Promise.reject('Not allowed to edit bug')
    bugs.splice(idx, 1)
    return _writeBugsToFile()
}