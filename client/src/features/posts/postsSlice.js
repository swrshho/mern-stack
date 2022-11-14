import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../api'

const initialState = {
	posts: [],
	post: null,
	currentPage: null,
	numberOfPages: null,
	isLoading: true,
}

export const getPost = createAsyncThunk(
	'posts/getPost',
	async (id, thunkAPI) => {
		try {
			const { data } = await api.fetchPost(id)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('something went wrong')
		}
	}
)

export const getPosts = createAsyncThunk(
	'posts/getPosts',
	async (page, thunkAPI) => {
		try {
			const { data } = await api.fetchPosts(page)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('something went wrong')
		}
	}
)

export const getPostsBySearch = createAsyncThunk(
	'posts/getPostsBySearch',
	async (searchQuery, thunkAPI) => {
		try {
			const {
				data: { data },
			} = await api.fetchPostsBySearch(searchQuery)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('something went wrong')
		}
	}
)

export const createPost = createAsyncThunk(
	'posts/createPost',
	async (args, thunkAPI) => {
		try {
			const post = args.jsonPostData
			const { navigate } = args
			const { data } = await api.createPost(post)
			navigate(`/posts/${data._id}`)
		} catch (error) {
			return thunkAPI.rejectWithValue('post request failed')
		}
	}
)

export const updatePost = createAsyncThunk(
	'posts/updatePost',
	async (args, thunkAPI) => {
		try {
			const { data } = await api.updatePost(args.id, args.post)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('update request failed')
		}
	}
)

export const deletePost = createAsyncThunk(
	'posts/deletePost',
	async (id, thunkAPI) => {
		try {
			await api.deletePost(id)
		} catch (error) {
			return thunkAPI.rejectWithValue('delete post failed')
		}
	}
)

export const likePost = createAsyncThunk(
	'posts/likePost',
	async (id, thunkAPI) => {
		const user = JSON.parse(localStorage.getItem('user'))

		try {
			const { data } = await api.likePost(id, user.token)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('like post failed')
		}
	}
)

export const commentPost = createAsyncThunk(
	'posts/commentPost',
	async (args, thunkAPI) => {
		const { finalComment: value, id } = args
		try {
			const { data } = await api.comment(value, id)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue('posting comment failed')
		}
	}
)

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		[getPost.pending]: (state) => {
			state.isLoading = true
		},
		[getPost.fulfilled]: (state, action) => {
			state.post = action.payload
			state.isLoading = false
		},
		[getPost.rejected]: (state) => {
			state.isLoading = false
		},
		[getPosts.pending]: (state) => {
			state.isLoading = true
		},
		[getPosts.fulfilled]: (state, action) => {
			state.isLoading = false
			state.posts = action.payload.data
			state.currentPage = action.payload.currentPage
			state.numberOfPages = action.payload.numberOfPages
		},
		[getPosts.rejected]: (state) => {
			state.isLoading = false
		},
		[getPostsBySearch.pending]: (state) => {
			state.isLoading = true
		},
		[getPostsBySearch.fulfilled]: (state, action) => {
			state.isLoading = false
			state.posts = action.payload
		},
		[getPostsBySearch.rejected]: (state) => {
			state.isLoading = false
		},
		[updatePost.fulfilled]: (state, action) => {
			state.posts.map((post) =>
				post._id === action.payload._id ? action.payload : post
			)
		},
		[deletePost.fulfilled]: (state, action) => {
			state.posts.filter((post) => post._id !== action.payload)
		},
		[likePost.fulfilled]: (state, action) => {
			state.posts.map((post) =>
				post._id === action.payload._id ? action.payload : post
			)
		},
		[commentPost.fulfilled]: (state, action) => {
			state.posts.map((post) => {
				if (post._id === action.payload._id) {
					return action.payload
				}
				return post
			})
		},
	},
})

export default postsSlice.reducer
