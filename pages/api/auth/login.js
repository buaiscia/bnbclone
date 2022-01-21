import { House, User, sequelize } from '../../../model.js'
import Cookies from 'cookies'


const login = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }

  // House.sync() // create House table in DB on first run

  const { email, password } = req.body

  let user = await User.findOne({ where: { email } })

  if (!user) {
    res.end(JSON.stringify({ status: 'error', message: 'User does not exist' }))
    return
  }

  const isPasswordValid = await user.isPasswordValid(password)

  if (!isPasswordValid) {
    res.end(JSON.stringify({ status: 'error', message: 'Password not valid' }))
    return
  }

  let sessionToken = null
  const sessionExpiration = new Date()
  sessionExpiration.setDate(sessionExpiration.getDate() + 30)

  if (new Date(user.session_expiration) < new Date()) {
    sessionToken = randomString(255)
    User.update(
      {
        session_token: sessionToken,
        session_expiration: sessionExpiration
      },
      { where: { email } }
    )
  } else {
    sessionToken = user.session_token
    User.update(
      {
        session_expiration: sessionExpiration
      },
      { where: { email } }
    )
  }

  const cookies = new Cookies(req, res)
  cookies.set('bnb_session', sessionToken, {
    httpOnly: true // true by default
  })

  res.end(JSON.stringify({ status: 'success', message: 'Logged in' }))
}

export default login
