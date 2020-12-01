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

const handleBlogRouter = (req, res) => {
  const method = req.method; //get post
  const id = req.query.id;


  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || '';
    // console.log('author---' + author)
    const keyword = req.query.keyword || '';
    // console.log('keyword---' + keyword)

    const result = getList(author, keyword)
    return result.then(listData => {
      console.log('listData------', listData)
      return new SuccessModel(listData)
    })




  }

  // 获取博客详情接口
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const data = getDetail(id);
    return new SuccessModel(data);

  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const data = newBlog(req.body);
    return new SuccessModel(data);

  }
  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const data = updateBlog(id, req.body)
    if (data) {
      return new SuccessModel(data)
    } else {
      return new ErrorModel('更新博客失败')
    }

  }
  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const data = delBlog(id);
    if (data) {
      return new SuccessModel(data)
    } else {
      return new ErrorModel('删除博客失败')
    }
  }

}


module.exports = handleBlogRouter