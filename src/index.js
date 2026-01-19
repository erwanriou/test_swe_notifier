const app = require("./app")
const transaction = require("./services/transactions")

// CONNECT DATABASE
transaction("Notifier")

// LISTEN APP
app.listen(3000, () => console.log("Notifier listening on port 3000!"))
