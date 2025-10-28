import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { AppDataSource } from './src/config/data-source';

const app = express();
const port: number = Number(process.env.PORT) || 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
