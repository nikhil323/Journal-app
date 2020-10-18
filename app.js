const path = require('path')
const express = require('express')
const ejs = require('ejs')
const _ = require('lodash')
const { 
    Post,
    contactContent,
    aboutContent,
    homeStartingContent
} = require('./db/mongoose')

const app = express()
const port = process.env.PORT

const publicDirPath = path.join(__dirname, "/public")

app.set('view engine', 'ejs')
app.use(express.static(publicDirPath))
app.use(express.urlencoded({extended: true}))


app.get('/', async(req,res) => {
    try {
        const posts = await Post.find({})
        res.render('home', {
            text: homeStartingContent,
            posts
        })
    } catch(e) {
        console.log(e)
    }
})

app.get("/about", (req, res) => {
    res.render("about", {
        text: aboutContent
    })
})

app.get("/contact", (req, res) => {
    res.render("contact", {
        text: contactContent
    })
})

app.get("/compose", (req, res) => {
    res.render("compose")
})

app.post("/compose", async(req, res) => {
    try{
        const post = new Post ({
            title: _.capitalize(req.body.noteTitle),
            body: req.body.noteBody
        })
        await post.save()
        res.redirect("/")
    } catch(e) {
        console.log(e)
    }
})

app.get("/posts/:id", async(req, res) => {
    try {
        const _id = req.params.id
        const match = await Post.findById({_id})
        if(match) {
           return res.render("post", {
                title: match.title,
                body: match.body,
                _id: match._id
            })
        }
    } catch(e) {
        console.log(e)
    }
})

app.post("/delete/:id", async(req, res) => {
    const _id = req.params.id
    try {
        await Post.findOneAndDelete({_id})
        res.redirect("/")
    } catch(e) {
        console.log(e)
    }
})

app.listen(port, (req, res) => {
    console.log(`server is up n running in ${port}`)
})