import { isValidObjectId } from "mongoose";
import { AppError } from "./errorMiddleware.js";
const  checkObjectId = (req, res, next)=>{
    if (!isValidObjectId(req.params.id))
        return next (new AppError(404, 'Invalid ObjectId'))
    next()
}
export default checkObjectId