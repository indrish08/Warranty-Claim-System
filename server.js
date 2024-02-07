const express = require('express')
const session = require('express-session')
const {Pool} = require('pg')
const User = require('./models/userModel')
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

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
})

app.get('/signin', (req, res) => {
    res.sendFile(__dirname + '/signin.html');
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;
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

    const result = await User.findByUsername(username);

    if (result.dataValues.password === password) {
        req.session.userId = username;
        res.redirect('/products');
    }else{
        res.send('Sign In Unsuccess. Username or password is wrong check again.')
    }
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


app.post('/submit', (req, res) => {
    res.send('Thanks for Submitting the form!!');
    console.log(req.body)
})

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
})