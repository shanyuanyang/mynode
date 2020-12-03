const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// // session数据
// const SESSION_DATA = {};


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
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式 JSON
  res.setHeader('content-type', 'application/json');

  // 获取path
  const url = req.url;
  // console.log('url----' + url)
  req.path = url.split('?')[0]
  //解析query
  req.query = querystring.parse(url.split('?')[1])
  console.log('req.query---', req.query)

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
  // // 解析session
  // let needSetCookie = false;
  // let userid = req.cookie.userid;
  // if (userid) {
  //   if (!SESSION_DATA[userid]) {
  //     SESSION_DATA[userid] = {}
  //   }
  // } else {
  //   needSetCookie = true;
  //   userid = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userid] = {}

  // }
  // req.session = SESSION_DATA[userid]
  // console.log('req.session-----', req.session)

  // 解析session （redis）  
  let needSetCookie = false;
  let userid = req.cookie.userid;
  if (!userid) {
    needSetCookie = true
    userid = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userid, {})
  }
  // 获取 session
  req.sessionId = userid
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 设置 session
      req.session = {}
    } else {
      // 设置 session
      req.session = sessionData
    }
    // 处理 post data
    return getPostData(req);
  }).then(postData => {
    req.body = postData;
    // console.log(111111)

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res);
    console.log('blogResult------', blogResult)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }

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