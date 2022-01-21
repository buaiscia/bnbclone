
const register = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end() //Method Not Allowed
    return
  }
  console.log('POST request received')
  console.log(req.body)
}

export default register;
