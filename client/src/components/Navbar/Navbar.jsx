import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core'
import useStyles from './style'
import memories from '../../images/memories.png'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authLogout } from '../../features/auth/authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import decode from 'jwt-decode'

const Navbar = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  const logout = () => {
    dispatch(authLogout)
    localStorage.clear()
    setUser(null)
    navigate('/')
    googleLogout()
  }

  useEffect(() => {
    const token = user?.token

    if (token) {
      const decodedData = decode(token)

      if (decodedData.exp * 1000 < new Date().getTime()) {
        logout()
      }
    }

    setUser(JSON.parse(localStorage.getItem('user')))
  }, [location])

  return (
    <>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <div className={classes.brandContainer}>
          <Typography
            component={Link}
            to="./auth"
            className={classes.heading}
            variant="h2"
            align="center"
          >
            Memories
          </Typography>
          <img
            className={classes.image}
            src={memories}
            alt="memories"
            height="60"
          ></img>
        </div>

        <Toolbar className={classes.toolbar}>
          {user ? (
            <div className={classes.profile}>
              <Avatar
                className={classes.purple}
                alt={user.name}
                src={user.picture}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography className={classes.userName} variant="h6">
                {user.name}
              </Typography>
              <Button
                variant="contained"
                className={classes.logout}
                color="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="contained" color="primary">
                Sign In
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>

      <Outlet />
    </>
  )
}
export default Navbar
