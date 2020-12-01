const loginBlog = (username, password) => {
  if (username === '张三' && password === '123456') {
    return true
  }
  return false
}

module.exports = {
  loginBlog
}
