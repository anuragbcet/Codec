import express from 'express';
import { createClient } from 'redis';
const app = express();
app.use(express.json());
const client = createClient();
async function main() {
    await client.connect();
    app.listen(3000, () => {
        console.log("Server is running on port:3000");
    });
}
app.post('/submit', async (req, res) => {
    const { problemId, code, language } = req.body;
    console.log(problemId);
    console.log(code);
    console.log(language);
    try {
        const response = await client.lPush('submission', JSON.stringify({ problemId, code, language }));
        res.status(200).json(response);
    }
    catch (error) {
        res.json({ message: "submission rejected" });
    }
});
main();
