const bugService = require('./services/bugService.js')
const userService = require('./services/userService.js')
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const COOKIE_AGE = 1000 * 60 * 30
const IS_PREMIUM = false
const PORT = 3000

app.get('/', (req, res) => res.send('Hello!'))

app.get('/api/bug', (req, res) => {

    const filterBy = req.query
    bugService.query(filterBy).then((bugs) => {
        res.send(bugs)
    })
})

// Create (and save) a new bug 
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Login first')

    let bug = req.body
    // console.log('bug', bug)
    bugService.save(bug, loggedinUser).then((savedbugs) => {
        res.send(savedbugs)
    })
})

//update a bug
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('not authorized to update bug')
    const bug = req.body
    bugService.save(bug, loggedinUser).then((savedBug) => {
        res.send(savedBug)
    })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('not authorized to update bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('not authorized to delete the bug')
    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser).then(() => {
        res.send({ msg: 'Bug removed successfully', bugId })
    })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('not authorized to delete the bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3 && !IS_PREMIUM) {
            return res.status(401).send('Wait for a bit')
        }
        visitedBugs.push(bugId)
    }
    bugService.get(bugId).then((bug) => {
        res.cookie('visitedBugs', visitedBugs, { maxAge: COOKIE_AGE })
        res.send(bug)
    })
})


//user routes
app.post('/api/auth/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password }).then((user) => {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')

        })
})


app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password }).then((user) => {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { maxAge: COOKIE_AGE })
        res.send(user)
    })
})


app.post('/api/auth/logout', (req, res) => {

    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })

})





// app.listen(3030, () => console.log('Server ready at port 3000!'))
app.listen(PORT, () => console.log(`Server ready at port ${PORT}!`))
