var mongoose = require("mongoose")

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    year: String,
    summary: String,
    poster: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()  //创建时候的时间。  
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});


MovieSchema.pre('save',function(next){
  if (this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  
  next(); //这样才会继续走
});

// model 编译 之后，实例化 之后才会真的与 数据库交互
MovieSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updataAt')
      .exec(cb)
  },
  findById: function(id, cb){
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MovieSchema;