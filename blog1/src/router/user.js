const {
  loginBlog
} = require('../controller/user')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')


const handleUserRouter = (req, res) => {
  const method = req.method;


  if (method === 'POST' && req.path === '/api/blog/login') {
    const { username, password } = req.body;
    const data = loginBlog(username, password);
    if (data) {
      return new SuccessModel(data)
    } else {
      return new ErrorModel('登录失败')
    }
  }
}

module.exports = handleUserRouter;