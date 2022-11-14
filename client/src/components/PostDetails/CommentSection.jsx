import { useRef, useState } from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { commentPost } from '../../features/posts/postsSlice'

import useStyles from './styles'

const CommentSection = ({ post }) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const [comments, setComments] = useState(post?.comments)
	const [comment, setComment] = useState('')
	const user = JSON.parse(localStorage.getItem('user'))
	const commentsRef = useRef()

	const handleClick = async () => {
		const finalComment = `${user.name}: ${comment}`
		setComment('')
		const response = await dispatch(commentPost({ finalComment, id: post._id }))
		const newComments = response.payload.comments
		setComments(newComments)

		commentsRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div>
			<div className={classes.commentOuterContainer}>
				<div className={classes.commentsInnerContainer}>
					<Typography gutterBottom variant="h6">
						Comments
					</Typography>
					{comments.map((c, i) => (
						<Typography key={i} gutterBottom variant="subtitle1">
							{c}
						</Typography>
					))}
					<div ref={commentsRef} />
				</div>
				{user?.name && (
					<div style={{ width: '70%' }}>
						<Typography gutterBottom variant="h6">
							Write a Comment
						</Typography>
						<TextField
							fullWidth
							minRows={4}
							variant="outlined"
							label="Comment"
							multiline
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<Button
							style={{ margiTop: '10px' }}
							fullWidth
							disabled={!comment}
							variant="contained"
							onClick={handleClick}
							color="primary"
						>
							Post Comment
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default CommentSection
