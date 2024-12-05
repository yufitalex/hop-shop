import express from 'express'
const router = express.Router()
import {getProductById,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        createProductReview,
        getTopProducts} from '../controllers/productControllers.js'
import checkObjectId from './../middleware/checkObjectId.js'

import {protect, admin} from './../middleware/authMiddleware.js'

router.route('/')
.get(getProducts)
.post(protect, admin, createProduct)
router.get('/top', getTopProducts)
  router.route('/:id')
  .get(checkObjectId, getProductById)
  .patch(protect,admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct)
router.post('/:id/review',protect, checkObjectId, createProductReview)
export default router