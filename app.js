var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')  // 用老的模块替换掉新的
var Movie = require('./models/movie')
var bodyParser = require('body-parser')
mongoose.Promise = require('bluebird'); //新版本的mongoose 没有promise

// process 是环境变量 ？ 默认3000
var app = express()
var port = process.env.PORT || 3000
app.locals.moment = require('moment');  //就可以直接在 jade 用了

mongoose.connect('mongodb://localhost:27017/')

app.set('views', './views/pages')
app.set('view engine', 'jade')
/*
//老版本express

app.use(express.bodyParser()) //对表单数据格式化
*/
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))  //去 public 这目录查找静态文件
//__dirname 当前目录
app.listen(port)

console.log('on...'+port)

var emptyMovie = {
    title: "",
    doctor: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    summary: ""
};

//路由
//参数1 匹配规则，browser 输入的 地址
app.get('/', function(req, res){
  Movie.fetch(function(err, movies){
    if (err){
      console.log(err);
    }  
    res.render('index', {
      title:'imooc 首页',
      movies: movies   //模型
    })
  })
  

});  

app.get('/movie/:id', function(req, res){ 
  var id = req.params.id;
  
  Movie.findById(id, function(err,movie){
    console.log(movie);
    res.render('detail', {
//      title:'imooc 详情' +movie.title, //这一行老在报错 TypeError: Cannot read property 'title' of undefined  
       title:'imooc 详情',
      movie: movie
    })
  })
  
});  

//admin update movie
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id;
  
  if (id) {
     Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }
      res.render('admin', {
        title: "immooc 后台录入",
        movie: movie
      })
    })
  }
})

//admin post movie
app.post('/admin/movie/new', function(req, res){
  var id = req.body.movie._id  //注意中间还可以能是query
  var movieObj = req.body.movie;
  var _movie
  console.log("to update");
  if (id != 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }
      
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' +movie._id)
      })
    })
  }
  else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash,
    })
    
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' +movie._id)
    })
  }
})

app.get('/admin/movie', function(req, res){
 
  res.render('admin', {
    title:'imooc 列表',
    movie:emptyMovie
  })
});  

app.get('/admin/list', function(req, res){
  console.log("show list");
  Movie.fetch(function(err, movies){
    if (err){
      console.log(err);
    }  
    res.render('list', {
      title:'imooc 列表',
      movies: movies   //模型
    })
  })
});  

app.delete('/admin/list', function(req, res) {
  var id = req.query.id;
  console.log("delete");
  console.log(req.query);
  if (id) {
    Movie.remove({_id: id}, function(err) {
      if (err){
        console.log(err);
      }
      else {
        res.json({success: 1})
      }
    })
  }
}) 