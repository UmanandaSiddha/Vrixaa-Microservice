import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { ESLint } from 'eslint';

const app = express();

const PORT = 5001;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

async function lintCode(codeSnippet: string) {
    const eslint = new ESLint();
    const results = await eslint.lintText(codeSnippet);
    return results[0].messages;
}

app.get("/", async (req: Request, res: Response) => {

    const data = await lintCode(`
        function calculateSum(numbers) {
            let sum = 0;
            numbers.forEach((num) => {
                sum += num;
            });
            return sum;
        }
    `);
    console.log(data);

    res.json({
        success: true,
        message: "Auth microservice is running successfully",
        data,
        version: "1.0.0"
    });
});

app.listen(PORT, () => {
    console.log(`Auth Microservice running on port ${PORT}`);
});