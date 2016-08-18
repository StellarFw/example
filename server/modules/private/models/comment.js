'use strict'

exports.default = (api, mongoose) => {
  // get Schema type
  let Schema = mongoose.Schema

  // return the schema
  return {
    _creator: { type: Schema.Types.ObjectId, ref: 'question' },
    content: String,
    user: Schema.Types.Mixed
  }
}
