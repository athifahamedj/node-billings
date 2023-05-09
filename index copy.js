const path = require('path')
const express = require('express')
const hbs = require('hbs') 

const app = express()
const publicPath = path.join(__dirname,'./public')
const viewpath = path.join(__dirname,'./templates/views')
const partials = path.join(__dirname,'./templates/partials')

app.use(express.static(publicPath)) 

app.set('view engine','hbs')
app.set('views',viewpath)
hbs.registerPartials(partials)

app.get('', (req,res) =>{
    // res.send('My Express')
    res.render('login')
 })
 app.get('home', (req,res) =>{
    // res.send('My Express')
    res.render('index',{
        title:'Sample HBS page',
        name:'Saravana'
    })
 })
app.listen(3000, () =>{
    console.log('3000 server is active')
})