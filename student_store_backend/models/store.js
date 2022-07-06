const db = require("../db")
class Store {
    static async listProducts() {
        const results = await db.query("SELECT * FROM products;")
        return results.rows
    }
}

module.exports = Store
