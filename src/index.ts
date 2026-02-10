import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000

app.use(express.json());

app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
