var mongoose = require("mongoose")
var MovieSchema = require("../schemas/movie")
var Movie = mongoose.model('Movie',MovieSchema) 
// 第一个参数是  模型的名字 ，第二个模式

module.exports = Movie;