import dbconfig from "../../../config/database";
import { selectRecipesOrderbyCreatedAt, selectComments, selectLikeRecipe, insertComment, insertLikeRecipe, updateRecipeLikes, deleteLikeRecipe, selectRecipesOrderbyLikes, selectRecipesByCategory, deleteRecipe } from "./recipeDao";


const getRecipesOrderByCreatedAt = async (req, res) => {
    const lastId = req.query.lastId;
    let response;
    if (lastId) {
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const [rows] = await selectRecipesOrderbyCreatedAt(sqlServer, lastId);
        sqlServer.release();
        response = {
            "code": 200,
            "message": "레시피 목록 조회 성공",
            "result": rows
        }  
    }
    else{
        response = {
            "code": 400,
            "message": "레시피 목록 조회 실패",
        }
    }
    res.send(response);
}

const getRecipesOrderBylikes = async (req, res) => {
    const lastId = req.query.lastId;
    let response;
    if (lastId) {
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const [rows] = await selectRecipesOrderbyLikes(sqlServer, lastId);
        sqlServer.release();
        response = {
            "code": 200,
            "message": "레시피 목록 조회 성공",
            "result": rows
        }  
    }
    else{
        response = {
            "code": 400,
            "message": "레시피 목록 조회 실패",
        }
    }
    res.send(response);
}

const getRecipesByCategory = async (req, res) => {
    const category = Number(req.params.cat);
    const lastId = req.query.lastId;
    let response;
    if (category){
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const [rows] = await selectRecipesByCategory(sqlServer, [category, lastId]);
        sqlServer.release();
        response = {
            "code": 200,
            "message": "카테고리 별 레시피 목록 조회 성공",
            "result": rows
        } 
    }
    else{
        response = {
            "code": 400,
            "message": "레시피 목록 조회 실패",
        }
    }
    res.send(response);
}

const deleteRecipesById = async (req, res) => {
    const ids = req.body.ids;
    let response;
    if (ids){
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const stat = await deleteRecipe(sqlServer, ids);
        sqlServer.release();
        if (stat) {
            response = {
                "code": 200,
                "message": "삭제 성공"
            } 
        }
        else{
            response = {
                "code": 400,
                "message": "삭제 실패",
            }
        }
    }
    else{
        response = {
            "code": 400,
            "message": "삭제 실패",
        }
    }
    res.send(response);
}

const postComment = async (req, res) => {
    const {user_id, content}  = req.body;
    const recipe_id = req.params.recipe_id;
    let response;
    if (!recipe_id || !user_id || !content) {
        response = {
            "code": 400,
            "message": "댓글 달기 실패",
        }
    }
    else{
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const stat = await insertComment(sqlServer, [Number(recipe_id), Number(user_id), content]);
        sqlServer.release();
        if (stat){
            response = {
                "code": 201,
                "message": "댓글 달기 성공"
            }
        }
        else{
            response = {
                "code": 400,
                "message": "댓글 달기 실패",
            }
        }
    }
    res.send(response);
}

const getComments = async (req, res) => {
    const recipe_id = req.params.recipe_id;
    const lastId = req.query.lastId;
    let response;
    if (!recipe_id) {
        response = {
            "code": 400,
            "message": "댓글 조회 실패",
        }
    }
    else{
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const rows = await selectComments(sqlServer, [Number(recipe_id), Number(lastId)]);
        console.log(rows);
        sqlServer.release();
        response = {
            "code": 200,
            "message": "댓글 조회 성공",
            "result": rows
        }
    }
    res.send(response);
}

const clickLike = async (req, res) => {
    const recipe_id = Number(req.body.recipe_id);
    const user_id = Number(req.body.user_id);
    let response;
    if (!recipe_id || !user_id){
        response = {
            "code": 400,
            "message": "좋아요 실패",
        }
        res.send(response);
    }
    else{
        const sqlServer = await dbconfig.getConnection(async conn => conn)
        const rows = await selectLikeRecipe(sqlServer, [recipe_id, user_id])
        if (!rows.length){
            const rows = await insertLikeRecipe(sqlServer, [recipe_id, user_id]);
            const likes = await updateRecipeLikes(sqlServer, [1, recipe_id])
            sqlServer.release();
            response = {
                "code": 200,
                "message": "좋아요 누르기",
            }
            res.send(response);
        }
        else {
            const rows = await deleteLikeRecipe(sqlServer, [recipe_id, user_id]);
            const likes = await updateRecipeLikes(sqlServer, [-1, recipe_id])
            sqlServer.release();
            response = {
                "code": 201,
                "message": "좋아요 취소",
            }
            res.send(response);
        }
    }
}

export { getRecipesOrderByCreatedAt, getRecipesOrderBylikes, getRecipesByCategory, postComment, getComments, clickLike, deleteRecipesById }