'use strict'

exports.default = (api, mongoose) => {
  // get Schema type
  let Schema = mongoose.Schema

  // return the model schema
  const questionS = new Schema({
    title: String,
    content: String,
    user: [Schema.Types.Mixed],
    comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
  }, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

  // add a dynamic fields
  questionS.virtual('excerpt').get(function () { 
    return this.content.substring(0, 400) + '(...)'
  })

  // return the schema
  return questionS
}
