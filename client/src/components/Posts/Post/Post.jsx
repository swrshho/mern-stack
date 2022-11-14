import useStyles from './style'
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import moment from 'moment'
import { deletePost, likePost } from '../../../features/posts/postsSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('user'))

  const userId = user?.googleId || user?._id

  const hasLikedPost = post.likes.find((like) => like === userId) ? true : false
  const [liked, setliked] = useState(hasLikedPost)
  const [likeCount, setlikeCount] = useState(post.likes.length)
  const navigate = useNavigate()

  const handleLike = async () => {
    dispatch(likePost(post._id))
    setliked(!liked)

    if (liked) {
      setlikeCount(likeCount - 1)
    } else {
      setlikeCount(likeCount + 1)
    }
  }

  const Likes = () => {
    if (likeCount > 0) {
      return liked ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likeCount > 2
            ? `You and ${likeCount - 1} others`
            : `${likeCount} like${likeCount > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </>
      )
    }
    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    )
  }

  const openPost = () => {
    navigate(`/posts/${post._id}`)
  }

  return (
    <Card className={classes.card} raised elevation={6}>
      <CardMedia
        className={classes.media}
        image={post.selectedFile}
        title={post.title}
      />

      <div className={classes.overlay}>
        <Typography variant="h6">{post.name}</Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>
      <div className={classes.overlay2}>
        {(user?._id === post?.creator || user?.googleId === post?.creator) && (
          <Button
            style={{ color: 'white' }}
            size="small"
            onClick={() => {
              setCurrentId(post._id)
            }}
          >
            <MoreHorizIcon fontSize="medium" />
          </Button>
        )}
      </div>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <div className={classes.details}>
          <Typography varaint="body2" color="textSecondary">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
      </ButtonBase>
      <Typography className={classes.title} varaint="h5" gutterBottom>
        {post.title}
      </Typography>
      <CardContent>
        <Typography varaint="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>

      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user}
          onClick={handleLike}
        >
          <Likes />
        </Button>
        {(user?._id === post?.creator || user?.googleId === post?.creator) && (
          <Button
            size="small"
            color="primary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Post
