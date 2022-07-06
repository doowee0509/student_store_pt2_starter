const db = require("../db")
const { BadRequestError } = require("../utils/errors")

class Order {
    static async listOrdersForUser(email) {
        // select orders with same customer_id
        const result = await db.query(`
            SELECT orders.id AS "orderId",
                    orders.customer_id AS "customerId",
                    od.quantity AS "quantity",
                    products.name AS "name",
                    products.price AS "price"
            FROM orders
            JOIN order_details od 
            ON od.order_id = orders.id
            JOIN products 
            ON products.id = od.product_id
            WHERE orders.customer_id = (SELECT id FROM users WHERE email = $1)
            `, [email])

    return result.rows
    }

    static async createOrder({order, user}) {
        // Error check for required fields and insert order into db
        if (!order || !Object.keys(order).length) {
            throw new BadRequestError("No order info provided")
        }

        if (!user) {
        throw new BadRequestError("No user provided")
        }
    
          // create a new order
        const result = await db.query(
        `INSERT INTO orders (customer_id) 
        VALUES ($1)
        RETURNING id`, [user.user_id])
        // get orderId
        const orderId = result.rows[0].id

        // add the products to the order details table
        Object.keys(order).forEach(async (productId) => {
        const quantity = order[productId]

        await db.query(
            `
            INSERT INTO order_details (order_id, product_id, quantity)
            VALUES ($1, $2, $3)
        `,
            [orderId, productId, quantity]
        )
        })

        return await Order.fetchOrderById(orderId)
    }

    static async fetchOrderById(orderId) {
        const result = await db.query(
            `SELECT orders.id AS "orderId",
                    orders.customer_id AS "customerId",
                    od.quantity AS "quantity",
                    products.name AS "name",
                    products.price AS "price"
            FROM orders
            JOIN order_details od 
            ON od.order_id = orders.id
            JOIN products 
            ON products.id = od.product_id
            WHERE orders.id = $1`,[orderId])
        
        return result.rows
    }
}

module.exports = Order
