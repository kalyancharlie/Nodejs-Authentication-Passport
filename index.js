const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
