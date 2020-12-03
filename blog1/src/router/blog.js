const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')


// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method; //get post
  const id = parseInt(req.query.id);
  console.log('req.query.id', req.query.id)
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    // console.log('req.session222222', req.session)

    if (req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        // 未登录
        return loginCheckResult
      }
      // 强制查询自己的博客
      author = req.session.username
    }

    // console.log('keyword---' + keyword)
    const result = getList(author, keyword)
    // console.log('result---', result)
    return result.then(listData => {
      console.log('listData------', listData)
      return new SuccessModel(listData)
    })

  }

  // 获取博客详情接口
  if (method === 'GET' && req.path === '/api/blog/detail') {

    const blogDetail = getDetail(id);
    return blogDetail.then(data => {
      return new SuccessModel(data);
    })

  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }
    // console.log(111111111111)


    console.log('req.session-----', req.session)
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
      // console.log('data-----', data)
      return new SuccessModel(data);

    })

  }
  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {

    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    console.log('id---', id)
    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新博客失败')

      }
    })

  }
  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username
    const result = delBlog(id, author);
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除博客失败')
      }
    })

  }

}


module.exports = handleBlogRouter