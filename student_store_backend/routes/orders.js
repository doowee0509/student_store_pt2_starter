const express = require("express")
const router = express.Router()
const Order = require ("../models/order")
const security = require("../middleware/security")

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const {email} = res.locals?.user

        const orders = await Order.listOrdersForUser(email)
        res.status(200).json({orders})
    } catch (err) {
        next(err)
    }
})

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals?.user
        const order = await Order.createOrder({order: req.body.order, user})
        res.status(200).json({order})
    } catch (err) {
        next(err)
    }
})

module.exports = router
