import {
  Avatar,
  Paper,
  Grid,
  Typography,
  Container,
  Button,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './style'
import { useState } from 'react'
// import { GoogleLogin } from '@react-oauth/google'
import { useGoogleLogin } from '@react-oauth/google'
import Icon from './Icon'
import Input from './Input'
import { useDispatch } from 'react-redux'
import { googleAuth, signup, signin } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Auth = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(initialState)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSignup) {
      dispatch(signup({ formData, navigate }))
    } else {
      dispatch(signin({ formData, navigate }))
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const switchMode = () => setIsSignup(!isSignup)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userObj = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data)

      const token = tokenResponse.access_token
      try {
        dispatch(googleAuth({ userObj, token }))
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    },

    onError: (error) => {
      console.log(error)
      console.log('Google Sign In was unsuccessful. Try Again Later')
    },
  })

  // const googleSuccess = async (res) => {
  //   const userObj = jwt_decode(res.credential)
  //   const token = res.credential
  //   try {
  //     dispatch(googleAuth({ userObj, token }))
  //     navigate('/')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const googleFailure = (error) => {
  //   console.log(error)
  //   console.log('Google Sign In was unsuccessful. Try Again Later')
  // }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? 'SignUp' : 'Sign In'}
          </Button>

          {/* <GoogleLogin
            clientId="95842381898-vli2a9l1id8b9uneca836km9qr7q7a1p.apps.googleusercontent.com"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
            useOneTap
          /> */}
          <Button
            onClick={googleLogin}
            className={classes.googleButton}
            color="primary"
            fullWidth
            startIcon={<Icon />}
            variant="contained"
          >
            Google Sign In
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}
export default Auth
