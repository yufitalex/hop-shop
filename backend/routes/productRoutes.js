import express from 'express'
const router = express.Router()
import {getProductById, getProducts, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts} from '../controllers/productControllers.js'
import {protect, admin} from './../middleware/authMiddleware.js'

router.route('/')
.get(getProducts)
.post(protect, admin, createProduct)
router.get('/top', getTopProducts)
  router.route('/:id')
  .get(getProductById)
  .patch(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)
router.post('/:id/review',protect, createProductReview)
export default router