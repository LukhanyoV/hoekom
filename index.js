import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import flash from "express-flash";
import bodyParser from "body-parser";
import config from "./config.json" assert { type: "json" };

const app = express();

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main",
    helpers: {
        hoekomStatus: code => {
            switch (code) {
                case code < 1:
                    return "Oops";
                case 1:
                    return "No load shedding";
                default:
                    return `Stage ${code-1}`;
            }
        }
    }
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

import HoekomService from "./services/hoekom-service.js";
import Routes from "./routes/index.js";
const routes = Routes(HoekomService);

app.get("/", routes.index);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 App now running at PORT: ${PORT}`));