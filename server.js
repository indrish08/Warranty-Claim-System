const express = require('express')
const session = require('express-session')
const {Pool} = require('pg')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const user = require('./models/user')
const order = require('./models/order')
const product = require('./models/product')
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
app.use(cookieParser())

app.get('/getorder', async(req, res) => {
    const orders = await order.findByPk(1, {
        attributes: ['address', 'quantity'],
        include: {
            model: product,
            attributes: ['name', 'price', 'warrantyPeriod']
        }
      })
      console.log(orders);
    res.json(orders)
})

app.get('/addorder', (req, res) => {
    order.create({productId: 1, orderDate: new Date(), address: 'CBE'})
    // product.create({name: 'PB Rockerz 255 Pro', price: 899, warrantyPeriod: 1})
    res.send('Done')
})

app.get('/addproduct', (req, res) => {
    product.create({name: 'PB Rockerz 260', price: 949, warrantyPeriod: 1})
    // product.create({name: 'PB Rockerz 255 Pro', price: 899, warrantyPeriod: 1})
    res.send('Done')
})

const isAuthenticated = (req, res, next) => {
    const jwt_token = req.cookies.jwt
    if (jwt_token) {
        jwt.verify(jwt_token, ACCESS_TOKEN_SECRET, (err, token) => {
            if (err) {
                res.clearCookie('jwt')
                res.redirect('/signin')
            }
            req.user = token.user;
            next()
        })
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

app.get('/signin', (req, res) => {
    res.sendFile(__dirname + '/signin.html');
})

app.post('/signup', async (req,res) => {
    const {username, password} = req.body;
    // const username = 'indrishh';
    // const password = 'passs';
    const userDetails = await user.createUser(username, password);
    console.log(userDetails);
    res.status(200).json({message:'success'});
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;
    var response = {
        username: false,
        password: false
    }
    
    product.test()
    try{
        const result = await user.classMethods.findByUsername(username);
        if (result) {
            response.username = true;
            const password_match = await user.comparePassword(password, result.dataValues.password);
            if (password_match) {
                response.password = true;
                const maxAge = 2 * 3600;
                const token = jwt.sign({user: username}, ACCESS_TOKEN_SECRET, {expiresIn: maxAge});
                res.cookie('jwt', token, {httpOnly: true});
                return res.status(200).json(response);
            }
        }
        res.status(401).json(response);
    } catch (error) {
        console.log(error.message)
        response.message = error.message;
        res.status(500).json(response);
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/signin')
})

app.get('/authStatus', (req, res) => {
    const userIsLoggedIn = req.cookies.jwt ? true : false
    res.json({ userIsLoggedIn })
})

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
})