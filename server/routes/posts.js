const express = require('express')
const {
	getPost,
	getPosts,
	getPostsBySearch,
	createPosts,
	updatePost,
	deletePost,
	likePost,
	commentPost,
} = require('../controllers/posts')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/', getPosts)
router.get('/search', getPostsBySearch)
router.get('/:id', getPost)
router.post('/', auth, createPosts)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)
router.post('/:id/commentPost', auth, commentPost)

module.exports = router
