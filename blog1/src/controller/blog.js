const {
  exec
} = require('../db/mysql')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%';`
  }
  // sql += `order by id desc;`

  // 返回 promise
  return exec(sql)

}


const getDetail = (id) => {

  return {
    id: 1,
    title: '123',
    content: '内容123',
    createTime: 56548745,
    author: '111'
  }
}

const newBlog = (blogData = {}) => {

  // console.log('blogData---', blogData)
  return {
    id: 3
  }
}

const updateBlog = (id, blogData = {}) => {

  console.log('blogData---', blogData)
  return true
}

const delBlog = (id) => {

  return true
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}