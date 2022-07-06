const express = require("express")
const User = require("../models/user")
const Order = require("../models/order")
const router = express.Router()
const {createUserJwt} = require("../utils/tokens")
const security = require("../middleware/security")

router.get("/me", security.requireAuthenticatedUser, async function (req, res, next) {
  try {
      //get required information and create new user in the database
      const {email} = res.locals.user
      const user = await User.fetchUserByEmail(email)
      const orders = await Order.listOrdersForUser(user)
      const publicUser = await User.makePublicUser(user)
      return res.status(200).json({ user: publicUser, orders })
  } catch (err) {
      next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    const token = createUserJwt(user)

    return res.status(200).json({ token, user })
  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body, isAdmin: false })
    const token = createUserJwt(user)

    return res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
})

module.exports = router
