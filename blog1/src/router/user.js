const {
  loginBlog
} = require('../controller/user')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')



const handleUserRouter = (req, res) => {
  const method = req.method;
  // console.log('req.cookie--', req.cookie)

  if (method === 'GET' && req.path === '/api/blog/login') {
    const { username, password } = req.body;
    const result = loginBlog(username, password);
    return result.then(loginData => {


      // console.log('loginData----', loginData)
      if (loginData.username) {
        // 设置 session
        req.session.username = data.username
        req.session.realname = data.realname
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })

  }
  // 登录验证的测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({
          session: req.session
        })
      )
    }
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }

}

module.exports = handleUserRouter;