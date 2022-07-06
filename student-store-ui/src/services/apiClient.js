import axios from "axios"

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl
        this.token = null
        this.tokenName = "student_store_token"
    }

    setToken(token) {
        this.token = token
        localStorage.setItem(this.tokenName, token)
    }

    async request({endpoint, method ='GET', data= {}}) {
        const url = `${this.remoteHostUrl}/${endpoint}`

        const headers = {
            "Content-Type": "application/json",
            Authorization: this.token ? `Bearer ${this.token}` : "",
        }

        try {
            const res = await axios({url, method, data, headers})
            return {data: res.data, error: null}
        } catch (err) {
            console.error({errorResponse: err.response})
            const message = err?.response?.data?.error?.message
            return {data: null, error: message || String(err)}
        }
    }



    async createOrder(creds) {
        return await this.request({ endpoint: `order`, method: `POST`, data: creds })
    }

    async fetchUserOrders() {
        return await this.request({ endpoint: `order`, method: `GET` })
    }

    async fetchProducts() {
        return await this.request({ endpoint: `store`, method: `GET` })
    }

    async fetchUserFromToken() {
        return await this.request({ endpoint: `auth/me`, method: `GET` })
    }

    async loginUser(creds) {
        return await this.request({endpoint: `auth/login`, method: `POST`, data:creds})
    }

    async signupUser(creds) {
        return await this.request({endpoint: `auth/register`, method: `POST`, data:creds})
    }

    async logoutUser() {
        this.setToken(null)
        localStorage.setItem(this.tokenName, "")
    }
}

// export default new ApiClient(process.env.REACT_APP_REMOTE_HOST_URL || "http://localhost:3001")
export default new ApiClient("http://localhost:3001")