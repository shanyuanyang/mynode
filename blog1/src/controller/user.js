const { exec,escape } = require('../db/mysql')

const loginBlog = (username, password) => {
  username = escape(username)
  password = escape(password)
  const sql = `select * from users where username=${username} and password=${password}`

  return exec(sql).then(res => {
    return res[0] || {}
  })

}

module.exports = {
  loginBlog
}
