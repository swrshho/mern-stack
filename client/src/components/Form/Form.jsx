import useStyles from './style'
import { TextField, Button, Typography, Paper } from '@material-ui/core'
import { useState, useEffect } from 'react'
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../../features/posts/postsSlice'
import { useNavigate } from 'react-router-dom'

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  })

  const user = JSON.parse(localStorage.getItem('user'))

  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  )

  useEffect(() => {
    if (post) {
      setPostData(post)
    }
  }, [post])

  const clear = () => {
    setCurrentId(0)
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentId === 0) {
      postData.tags = postData.tags.split(' ')
      const post = { ...postData, name: user?.name }
      const jsonPostData = JSON.stringify(post)
      dispatch(createPost({ jsonPostData, navigate }))
      clear()
    } else {
      dispatch(
        updatePost({ post: { ...postData, name: user?.name }, id: currentId })
      )
      clear()
    }
  }
  if (!user?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please sign in to create memories and like other's memories.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {!currentId ? 'Creating' : 'Editing'} a Memory
        </Typography>

        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
        />

        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>

        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          submit
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  )
}

export default Form
