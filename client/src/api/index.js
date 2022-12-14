import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' })

API.interceptors.request.use((req) => {
	if (localStorage.getItem('user')) {
		req.headers.Authorization = `Bearer ${
			JSON.parse(localStorage.getItem('user')).token
		}`
	}

	return req
})

export const fetchPost = (id) => API.get(`/posts/${id}`)
export const fetchPosts = (page) => API.get(`/posts?page=${page}`)
export const fetchPostsBySearch = (searchQuery) =>
	API.get(
		`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${
			searchQuery.tags
		}`
	)
export const createPost = (newPost) =>
	API.post('/posts', newPost, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
export const updatePost = (id, updatedPost) =>
	API.patch(`posts/${id}`, updatedPost)

export const deletePost = (id) => API.delete(`posts/${id}`)
export const likePost = (id) => API.patch(`posts/${id}/likePost`)
export const comment = (value, id) =>
	API.post(`posts/${id}/commentPost`, { value })

// authentication
export const singin = (formData) => API.post('/users/signin', formData)
export const signup = (formData) => API.post('/users/signup', formData)
