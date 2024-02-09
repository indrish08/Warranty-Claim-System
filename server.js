const express = require('express')
const session = require('express-session')
const {Pool} = require('pg')
const jwt = require('jsonwebtoken')
const User = require('./models/userModel')
require('./initDatabase')
// const path = require('path')
// const fs = require('fs')

const app = express();

const client = new Pool({
    user: 'postgres',
    password: 'indrish',
    host: 'localhost',
    port: '5432',
    database: 'pulsebeat',
});

const port = 3000;
const ACCESS_TOKEN_SECRET = 'f9128bb7044d866f11971057c18a315154a09d95ab5834fe6909941c95bff1fcc82f8d4ce6067d6296f1cd649a652537d219626cc9373d6742c1ae783d9b0676'

app.use(express.static('node_modules/font-awesome'))
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))
app.use(express.static('node_modules/jquery/dist'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'c17259fbaa992d9ffbba1e07523621ef',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/signin')
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET)
}

app.get('/', (req, res) => {
    res.redirect('/signin')
    // res.sendFile(__dirname + '/index.html');
})

app.get('/products', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/products.html');
})

app.get('/warranty', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/warranty.html');
})

app.get('/signin', (req, res) => {
    res.sendFile(__dirname + '/signin.html');
})

app.post('/signup', async (req,res) => {
    const {username, password} = req.body;
    // const username = 'indrishh';
    // const password = 'passs';
    const user = await User.createUser(username, password);
    console.log(user);
    res.status(200).json({message:'success'});
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;
    try{
        const result = await User.findByUsername(username);
        var response = {
            username: false,
            password: false
        }
        if(result){
            response.username = true;
            const password_match = await User.comparePassword(password, result.dataValues.password);
            if (password_match) {
                response.password = true;
                const user = {user: username};
                const token = generateAccessToken(user);
                response.token = token;
                return res.status(200).json(response);
            }
        }
        res.status(401).json(response);
    }catch(error){
        response.message = error.message;
        res.status(500).json(response);
    }
    
    // const select_data = `
    //     SELECT * FROM users WHERE username = $1;
    // `;
    // const result = await client.query(select_data, [username])

    // if (result.rows[0].password === password) {
    //     req.session.userId = username;
    //     res.redirect('/products');
    // }else{
    //     res.send('Sign In Unsuccess. Username or password is wrong check again.')
    // }
})

app.get('/authStatus', (req, res) => {
    const userIsLoggedIn = req.session.userId ? true : false;
    res.json({ userIsLoggedIn });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/signin');
    });
  });

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
})