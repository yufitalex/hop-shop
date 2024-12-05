const notFound = (req, res, next ) =>{
    const error = new Error(`Not Found -${req.originalUrl}`)
}
class AppError extends Error{
    statusCode
 constructor(statusCode, message){
    super(message)
    this.statusCode = statusCode
 }
}
const errorHandler = (err, req, res, next) =>{
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500: res.statusCode)
    let message = err.message
    
    ///Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind ==='ObjectId'){
        message = 'Resource not found'
        statusCode = 404
    }
    res.status(statusCode).json({
        status:'fail',
         message,
         stack: process.env.NODE_ENV === 'production' ?'🤣' : err.stack
    })
    }
export {notFound, errorHandler ,AppError}