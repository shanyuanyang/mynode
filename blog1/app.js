const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session数据
const SESSION_DATA = {};
// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  return d.toGMTString();
}

// 用于处理post data函数
const getPostData = (req) => {
  return new Promise((resolve, reject) => {

    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })

}



const serverHandle = (req, res) => {
  // 设置返回格式 JSON
  res.setHeader('content-type', 'application/json');

  // 获取path
  const url = req.url;
  // console.log('url----' + url)
  req.path = url.split('?')[0]
  //解析query
  req.query = querystring.parse(url.split('?')[1])
  // console.log('req.query---', req.query)

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  })
  // 解析session
  let needSetCookie = false;
  let userid = req.cookie.userid;
  if (userid) {
    if (!SESSION_DATA[userid]) {
      SESSION_DATA[userid] = {}
    }
  } else {
    needSetCookie = true;
    userid = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userid] = {}

  }
  req.session = SESSION_DATA[userid]
  // console.log('req.session-----', req.session)
  // 用于处理post data
  getPostData(req).then(postData => {
    req.body = postData;
    if (needSetCookie) {
      res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`)
    }
    // 处理blog路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {

        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

  })



}

module.exports = serverHandle