const mongoose = require('mongoose')

const PostMessage = require('../models/postMessage')

const getPost = async (req, res) => {
	const { id } = req.params

	try {
		const post = await PostMessage.findById(id)
		res.status(200).json(post)
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

const getPosts = async (req, res) => {
	const { page } = req.query

	try {
		const LIMIT = 8

		// get starting index of every page
		const startIndex = (Number(page) - 1) * LIMIT
		const total = await PostMessage.countDocuments({})

		const posts = await PostMessage.find()
			.sort({ _id: -1 })
			.limit(LIMIT)
			.skip(startIndex)
		res.status(200).json({
			data: posts,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		})
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

const getPostsBySearch = async (req, res) => {
	const { searchQuery, tags } = req.query

	try {
		const title = new RegExp(searchQuery, 'i')
		const posts = await PostMessage.find({
			$or: [{ title }, { tags: { $in: tags.split(',') } }],
		})

		res.json({ data: posts })
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

const createPosts = async (req, res) => {
	const post = req.body
	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	})

	try {
		await newPost.save()
		res.status(201).json(newPost)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

const updatePost = async (req, res) => {
	const { id: _id } = req.params
	const post = req.body

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send('No post with that id')
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
		new: true,
	})

	res.json(updatedPost)
}

const deletePost = async (req, res) => {
	const { id: _id } = req.params

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send('No post with that id')
	}

	const deletedPost = await PostMessage.findById(_id)
	await PostMessage.findByIdAndDelete(_id)

	res.json({
		message: `Post with title of ${deletedPost.title} deleted succesfully`,
	})
}

const likePost = async (req, res) => {
	const { id: _id } = req.params

	// req.Id is populated in middleware/auth.js
	if (!req.userId) return res.json({ message: 'Unauthenticated' })

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send('No post with that id')
	}

	const post = await PostMessage.findById(_id)

	const index = post.likes.findIndex((_id) => _id === String(req.userId))

	if (index === -1) {
		// the user doesn't exist in likes array
		post.likes.push(req.userId)
	} else {
		// remove the like
		post.likes = post.likes.filter((_id) => _id !== String(req.userId))
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
		new: true,
	})

	res.json(updatedPost)
}

const commentPost = async (req, res) => {
	const { id } = req.params
	const { value } = req.body

	const post = await PostMessage.findById(id)
	post.comments.push(value)

	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
		new: true,
	})

	res.json(updatedPost)
}

module.exports = {
	getPost,
	getPosts,
	getPostsBySearch,
	createPosts,
	updatePost,
	deletePost,
	likePost,
	commentPost,
}
