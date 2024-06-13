import express from "express"
import axios from "axios"
import ejs from "ejs"

const app = express()
const port = 3000
//Add your key here 
const base_url = "https://api.openai.com/v1/chat/completions"
const config = {
    headers: {
        Authorization: `Bearer ${api_key}`
    }
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let conversationHistory = [];

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const user_content = req.body["user-in"];
    conversationHistory.push({ role: "user", content: user_content });

    try {
        const body = {
            "model": "gpt-3.5-turbo",
            "messages": conversationHistory
        };
        const response = await axios.post(base_url, body, config);
        const botResponse = response.data.choices[0].message.content;
        conversationHistory.push({ role: "assistant", content: botResponse });
        console.log(conversationHistory);
        res.render("index.ejs", { data: conversationHistory });
    } catch (error) {
        console.log(error);
        console.log("something went wrong");
    }
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

