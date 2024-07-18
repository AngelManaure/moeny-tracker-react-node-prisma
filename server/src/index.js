import express from "express"
import cors from "cors"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json('test ok')
});

app.get('/delete', async (req, res) => {
    await prisma.transaction.deleteMany()
})

app.post('/api/transaction', async (req, res) => {
    const { name, price, description, datetime } = req.body;
    const newTransaction = await prisma.transaction.create({
        data: {
            name,
            price: parseInt(price, 10),
            description,
            datetime,
        }
    })
    res.json(newTransaction)
})

app.get('/api/transactions', async (req, res) => {
    const allTransactions = await prisma.transaction.findMany();
    res.json(allTransactions)
})

app.listen(3000, () => {
    console.log('Server running on port:', 3000);
})