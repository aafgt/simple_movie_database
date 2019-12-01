const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
const fs = require('fs')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )
app.use(bodyParser.urlencoded({ extended: false }))

var session = require('express-session')
app.use(session({secret: "Shh, its a secret!"}));

// var cookieParser = require('cookie-parser')
// app.use(cookieParser())

// 'use strict';
// var sessionstorage = require('sessionstorage');

//var cookie = require('cookie');

let loadUsers = function(){
  try {
      let bufferedData = fs.readFileSync('users.json')
      let dataString = bufferedData.toString()
      let users = JSON.parse(dataString)
      return users
  } catch (error) {
      return []
  }
}

let addUser = function(username, password){
  //let new_user = {'username' : username, 'password' : password}
  let new_user = {'username' : username, 'password' : password, 'watchlist' : []}
  let users = loadUsers()
  users.push(new_user)
  fs.writeFileSync('users.json', JSON.stringify(users))
}

let isEqual = function(a, b){
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
        return false;
    }
  }
  return true;
}

let uniqueUser = function(username, password){
  let new_user = {'username' : username, 'password' : password}
  let users = loadUsers()
  for(let i=0; i<users.length; i++){
    if(isEqual(users[i].username, new_user.username)){
      return false
    }
  }
  return true
}

let isUser = function(username, password){
  let user = {'username' : username, 'password' : password}
  //let user = getUserByUsername(username) 
  let users = loadUsers()
  for(let i=0; i<users.length; i++){
    if(isEqual(users[i].username, user.username) && isEqual(users[i].password, user.password)){
      return true
    }
  }
  return false
}

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log('server is running')
})
 
app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/registration', function (req, res) {
  res.render('registration')
})

app.get('/home', function (req, res) {
  res.render('home')
})

app.get('/action', function (req, res) {
  res.render('action')
})

app.get('/conjuring', function (req, res) {
  res.render('conjuring')
})

app.get('/darkknight', function (req, res) {
  res.render('darkknight')
})

app.get('/drama', function (req, res) {
  res.render('drama')
})

app.get('/fightclub', function (req, res) {
  res.render('fightclub')
})

app.get('/godfather', function (req, res) {
  res.render('godfather')
})

app.get('/godfather2', function (req, res) {
  res.render('godfather2')
})

app.get('/horror', function (req, res) {
  res.render('horror')
})

app.get('/scream', function (req, res) {
  res.render('scream')
})

app.get('/searchresults', function (req, res) {
  //console.log("searchresults GET")
  //res.render('searchresults')
  res.render('searchresults', {
    results: mov,
    results2: movPages
 })
})

app.get('/watchlist', function (req, res) {
  //res.render('watchlist')
  // res.render('watchlist', {
  //   watchlist: getUserWatchlist(currentUser)
  // })
//  console.log(sessionstorage.getItem("username"))
//  res.render('watchlist', {
//    watchlist: getUserWatchlist(sessionstorage.getItem("username"))
//   })
  // console.log(req.session.user)
  // console.log(req.sessionID)
  // res.render('watchlist', {
  //   watchlist: getUserWatchlist(req.session.user)
  // })
  currUser = getUser_id(req.sessionID)
  res.render('watchlist', {
    watchlist: getUserWatchlist(currUser)
  })
})

app.get('/loginunsuccessful', function (req, res) {
  res.render('loginunsuccessful')
})

app.get('/registrationunsuccessful', function (req, res) {
  res.render('registrationunsuccessful')
})

app.get('/registrationsuccessful', function (req, res) {
  res.render('registrationsuccessful')
})

app.post('/register', function(req,res){
  if(uniqueUser(req.body.username, req.body.password)){
    addUser(req.body.username, req.body.password)
    //console.log("Registration successful")          //alert
    //res.redirect('/login')
    res.redirect('/registrationsuccessful')
    //res.send("Registration successful")
  }
  else{
    //console.log("Username already taken")         //alert
    //res.redirect('/registration')
    res.redirect('/registrationunsuccessful')
    //res.send("Username already taken")
  }
})

app.post('/login', function(req,res){
  if(isUser(req.body.username, req.body.password)){
    res.redirect('/home')
    //currentUser = req.body.username
    // sessionstorage.setItem("username",req.body.username)
    // console.log(sessionstorage.getItem("username"))
    //req.session.user = req.body.username
    //req.session.save()
    //console.log(req.session.user)
    //console.log(req.sessionID)
    //user++
    let currUser = {'username':req.body.username,'sessionID':req.sessionID}
    
    
    for(let i=0; i<diffUser.length; i++){
      if(isEqual(diffUser[i].sessionID,req.sessionID)){
        diffUser.splice(i, 1);
      }
    }
    diffUser.push(currUser)

  }
  else{
    //console.log("Please register first")         //alert
    //res.redirect('/login')
    res.redirect('/loginunsuccessful')
    //res.send("Please register first")
  }
})

app.post('/godfather', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'godfather')){
    addToWatchlist(currUser,'godfather')
    res.redirect('/godfather')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/conjuring', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'conjuring')){
    addToWatchlist(currUser,'conjuring')
    res.redirect('/conjuring')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/darkknight', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'darkknight')){
    addToWatchlist(currUser,'darkknight')
    res.redirect('/darkknight')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/fightclub', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'fightclub')){
    addToWatchlist(currUser,'fightclub')
    res.redirect('/fightclub')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/godfather2', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'godfather2')){
    addToWatchlist(currUser,'godfather2')
    res.redirect('/godfather2')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/scream', function(req,res){
  currUser = getUser_id(req.sessionID)
  if(!checkWatchlist(currUser,'scream')){
    addToWatchlist(currUser,'scream')
    res.redirect('/scream')
  }
  else{
    res.send("This movie is already in your watchlist.")
  }
})

app.post('/Search', function(req,res){
  //console.log("Search POST")
  mov = findMovie(req.body.Search)
  movPages = getMoviesPages(mov)
  //console.log(mov)
  if(mov.length == 0){
    res.send("Movie not found")
  }
  else{
    res.redirect('/searchresults')
  }
})

let getMoviesPages = function(movieNames){
  let result = []
  for(let i=0; i<movieNames.length; i++){
    switch(movieNames[i]){
      case 'godfather': result.push('/godfather'); break;
      //case 'godfather': result.push("href='/godfather'"); break;
      case 'godfather2': result.push('/godfather2'); break;
      //case 'godfather2': result.push("href='/godfather2'"); break;
      case 'scream': result.push('/scream'); break;
      //case 'scream': result.push("href='/scream'"); break;
      case 'conjuring': result.push('/conjuring'); break;
      //case 'conjuring': result.push("href='/conjuring'"); break;
      case 'fightclub': result.push('/fightclub'); break;
      //case 'fightclub': result.push("href='/fightclub'"); break;
      case 'darkknight': result.push('/darkknight'); break;
      //case 'darkknight': result.push("href='/darkknight'"); break;
    }
  }
  return result
}

let findMovie = function(movieName){
  let result = []
  for(let i=0; i<movies.length; i++){
    if(movies[i].includes(movieName)){
      result.push(movies[i])
    }
  }
  return result
}

app.post('/watchlist', function(req,res){
  //console.log("in watchlist post")
  //let wl = getUserWatchlist(currentUser)
  //fs.writeFileSync('watchlist.json', JSON.stringify(wl))
  res.redirect('/watchlist')
})

let addToWatchlist = function(username, movieName){
  let theUser = {}
  let users = loadUsers()
  for(let i=0; i<users.length; i++){
    if(isEqual(users[i].username, username)){
      theUser = users[i]
      users.splice(i, 1); 
    }
  }
  let theUserWatchlist = theUser.watchlist
  theUserWatchlist.push(movieName) 
  users.push(theUser)
  fs.writeFileSync('users.json', JSON.stringify(users))
}

let checkWatchlist = function(username, movieName){
  let theWatchlist = getUserWatchlist(username)
  for(let i=0; i<theWatchlist.length; i++){
    if(isEqual(theWatchlist[i], movieName)){
      return true
    }
  }
  return false
}

let getUserWatchlist = function(username){
  let users = loadUsers()
  for(let i=0; i<users.length; i++){
    if(isEqual(users[i].username, username)){                           
      return users[i].watchlist 
    }
  }
  return []
}

// let getUserByUsername = function(username){
//   let users = loadUsers()
//   for(let i=0; i<users.length; i++){
//     if(isEqual(users[i].username, username)){
//       return users[i] 
//     }
//   }
//   return []
// }

let getUser_id = function(sessionID){
  for(let i=0; i<diffUser.length; i++){
    if(isEqual(diffUser[i].sessionID, sessionID)){
      return diffUser[i].username 
    }
  }
  return ''
}



//var currentUser = ''
var movies = ["godfather","godfather2","scream","conjuring","fightclub","darkknight"]
let mov = []
let movPages = []


let diffUser = []

