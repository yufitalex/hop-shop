import express from 'express'
const router = express.Router()
import {
     loginUser,
     deleteUser,
     getUserById,
     getUserProfile,
     getUsers,
     logoutUser,
     registerUser,
     updateUser,
     updateUserProfile
    } from '../controllers/userControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'


router.route('/')
.get(protect, admin, getUsers)
router.post('/register', registerUser)

router.post('/login',loginUser)
router.post('/logout',protect, logoutUser)

router.route('/profile')
.put(protect, updateUserProfile)
.get(protect, getUserProfile)


router.route('/:id')
.get(protect, admin,getUserById)
.delete(protect, admin, deleteUser)
.put(protect, admin, updateUser)
export default router