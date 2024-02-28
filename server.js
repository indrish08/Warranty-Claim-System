const express = require('express')
const models = require('./models')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const moment = require('moment')
require('dotenv').config()

const app = express();

app.use(express.static('public'))
app.use(express.static('node_modules/font-awesome'))
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'pug')

const isAuthenticated = (req, res, next) => {
    const jwt_token = req.cookies.jwt
    if (jwt_token) {
        jwt.verify(jwt_token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
            if (err) {
                res.clearCookie('jwt')
                res.clearCookie('username')
                res.redirect('/signin')
            }
            req.id = token.id;
            next()
        })
    } else {
        res.redirect('/signin')
    }
}

app.get('/authStatus', (req, res) => {
    res.json({ 
        userIsLoggedIn: req.cookies.username, 
        username: req.cookies.username 
    })
})

app.get('/', (req, res) => {
    res.redirect('/signin');
})

app.get('/orders', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/orders.html'));
})

app.get('/orderspug', isAuthenticated, (req, res) => {
    res.render('orders', {username: req.cookies.username});
})

app.get('/warranty', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/warranty.html'));
})

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '/signin.html'));
})

app.post('/signup', async (req,res) => {
    const {username, password} = req.body;
    // const username = 'indrishh';
    // const password = 'passss';
    const userDetails = await models.User.createUser(username, password);
    res.status(200).json({message:'success'});
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;
    var response = {
        username: false,
        password: false
    }
    try{
        const result = await models.User.findByUsername(username);
        if (result) {
            response.username = true;
            const password_match = await models.User.comparePassword(password, result.dataValues.password);
            if (password_match) {
                response.password = true;
                const maxAge = 2 * 3600 * 24;
                const token = jwt.sign({id: result.dataValues.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: maxAge});
                res.cookie('jwt', token, {httpOnly: true});
                res.cookie('username', username)
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

app.post('/getorders', isAuthenticated, async (req, res) => {
    var filter = {
        UserId: req.id,
    }
    var products = ['Products']
    if (req.body.status !== '') {
        filter.status = req.body.status
    }
    if (req.body.time === '30days') {
        filter.orderDate = {
            [models.Op.gte]: moment().subtract(30, 'days').toDate()
        }
    } else if (req.body.time === '3months') {
        filter.orderDate = {
            [models.Op.gte]: moment().subtract(3, 'months').toDate()
        }
    } else if (req.body.time === 'older') {
        filter.orderDate = {
            [models.Op.lte]: moment(`2021-01-01`).toDate()
        }
    } else if (req.body.time === 'custom-range') {
        filter.orderDate = {
            [models.Op.between]: [
                moment(req.body.startDate).toDate(),
                moment(req.body.endDate).toDate()
            ]
        }
    } else if (req.body.time !== 'all') {
        filter.orderDate = {
            [models.Op.between]: [
                moment(`${req.body.time}-01-01`).toDate(),
                moment(`${req.body.time}-12-31`).toDate()
            ]
        }
    }

    const orders = await models.Order.findAll({
        where: filter,
        order: [['orderDate', 'DESC']],
        // limit: 3,
        include: products,
    })
    res.json(orders)
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.clearCookie('username')
    res.redirect('/signin')
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
})