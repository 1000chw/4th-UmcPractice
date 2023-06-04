export const selectRecipesOrderbyCreatedAt = async (connection, lastId) => {
    const selectRecipesQuery = `
        SELECT id, title, user_id, created_at, likes 
        FROM recipes
        WHERE (
            SELECT r.created_at 
            FROM recipes r
            WHERE id = ?
        ) > recipes.created_at
        ORDER BY created_at DESC
        LIMIT 10;
    `
    const recipeRows = await connection.query(selectRecipesQuery, lastId);
    return recipeRows;
}

export const selectRecipesOrderbyLikes = async (connection, lastId) => {
    const selectRecipesQuery = `
        SELECT id, title, user_id, created_at, likes 
        FROM recipes
        WHERE (
            SELECT r.likes
            FROM recipes r
            WHERE id = ?
        ) > recipes.likes
        ORDER BY likes DESC
        LIMIT 10;
    `
    const recipeRows = await connection.query(selectRecipesQuery, lastId);
    return recipeRows;
}

export const selectRecipesByCategory = async (connection, params) => {
    const selectRecipesByCategoryQuery = `
        SELECT id, title, user_id, created_at, likes
        FROM recipes
        WHERE recipes.beverage_type = ? AND (
            SELECT r.created_at
            FROM recipes r
            WHERE id = ?
        ) > recipes.created_at
        ORDER BY created_at DESC
        LIMIT 10;
    `
    const recipeRows = await connection.query(selectRecipesByCategoryQuery, params);
    return recipeRows;
}

export const deleteRecipe = async (connection, deleteRecipeIds) => {
    const deleteRecipeQuery = `
        DELETE FROM recipes
        WHERE id = ?;
    `
    let del = true;
    deleteRecipeIds.forEach(async id => {
        del = await connection.query(deleteRecipeQuery, Number(id), (err) => false);
    });
    return true;
}

export const insertComment = async (connection, insertCommentParams) => {
    const insertCommentQuery = `
        INSERT INTO comments (recipe_id, user_id, content) 
        VALUES (?, ?, ? );
    `

    const stat = await connection.query(insertCommentQuery, insertCommentParams, (err, rows) => {if (err) return false;}) && true;
    console.log(stat);
    return stat;
}

export const selectComments = async (connection, selectCommentsParams) => {
    const selectCommentsQuery = `
        SELECT c.id, c.user_id, c.content, c.created_at
        FROM comments c 
        LEFT JOIN comment_report cr 
            ON c.id = cr.comment_id 
        LEFT JOIN user_block ub 
            ON c.user_id = ub.block_id AND ub.user_id = ID
        WHERE c.recipe_id = ? AND cr.comment_id IS NULL AND ub.block_id IS NULL AND 
        (SELECT cc.created_at FROM comments cc WHERE id = ?) > c.created_at
        ORDER BY c.created_at DESC
        LIMIT 6;
    `
    const [commentRows] = await connection.query(selectCommentsQuery, selectCommentsParams);
    console.log(commentRows);
    return commentRows;
}

export const selectLikeRecipe = async (connection, selectLikeRecipeParams) => {
    const selectLikeRecipeQuery = `
        SELECT * from likes 
        WHERE likes.recipe_id = ? AND likes.user_id = ?;
    `
    const [likeRecipe] = await connection.query(selectLikeRecipeQuery, selectLikeRecipeParams);
    console.log(likeRecipe);
    return likeRecipe;
}

export const insertLikeRecipe = async (connection, insertLikeRecipeParams) => {
    const insertLikeRecipeQuery = `
        INSERT INTO likes (recipe_id, user_id) VALUES (?, ?); 
    `
    const likeRecipe = await connection.query(insertLikeRecipeQuery, insertLikeRecipeParams);
    return likeRecipe;
}

export const deleteLikeRecipe = async (connection, deleteLikeRecipeParams) => {
    const deleteLikeRecipeQuery = `
        DELETE from likes 
        WHERE recipe_id = ? AND user_id = ?;
    `
    const likeRecipe = await connection.query(deleteLikeRecipeQuery, deleteLikeRecipeParams);
    return likeRecipe;
}

export const updateRecipeLikes = async (connection, updateRecipeLikesParams) => {
    const updateRecipeLikes = `
        UPDATE recipes SET likes = likes + ?
        WHERE id = ?;
    `
    const likeRecipe = await connection.query(updateRecipeLikes, updateRecipeLikesParams);
    return likeRecipe
}
