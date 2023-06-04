import express from "express";
import recipeRouter from "../src/app/recipe/recipeRoute";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(recipeRouter);

export default app;