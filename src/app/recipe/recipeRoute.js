import express from "express";
import {  getRecipesOrderByCreatedAt, getRecipesOrderBylikes, getRecipesByCategory, postComment, getComments, clickLike, deleteRecipesById  } from "./recipeController";

const recipeRouter = express.Router();

recipeRouter.get('/', (req, res) => {
    console.log("server starting!");
    res.send("hello world");
});

recipeRouter.get('/recipes/uploadtime', getRecipesOrderByCreatedAt);

recipeRouter.get('/recipes/likes', getRecipesOrderBylikes);

recipeRouter.get('/recipes/category/:cat', getRecipesByCategory)

recipeRouter.delete('/recipes', deleteRecipesById)

recipeRouter.post('/recipes/:recipe_id(\\d+)/comments', postComment);

recipeRouter.get('/recipes/:recipe_id(\\d+)/comments', getComments); 

recipeRouter.post('/recipes/like', clickLike);

export default recipeRouter;