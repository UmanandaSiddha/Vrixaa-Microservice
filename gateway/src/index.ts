import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));

app.use('/auth', proxy('http://localhost:5001'));
app.use('/code', proxy('http://localhost:5002'));
app.use('/org', proxy('http://localhost:5003'));
app.use('/pricing', proxy('http://localhost:5004'));

app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Welcome to the Vrixxa Code Platform API Gateway"
    });
});

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
