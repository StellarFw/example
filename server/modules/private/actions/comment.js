'use strict'

module.exports = [ {
    name: 'createComment',
    description: 'Create a new Comment',

    inputs: {
        content: {
            required: true
        }
    },

    run: (api, action, next) => {
        // get the questions
        api.models.get('question')
        .findById(action.params.question_id)
        .populate('comment')
        .exec((error, question) => {
            if (error) {
                // return an error message to the client
                return next(new Error('We can create that resource!'))
            }

            // create the new comment
            let newModel = new (api.models.get('comment'))(action.params)

            // save the new model
            newModel.save(error => {
                if (error) {
                    // return an error message to the client
                    return next(new Error('We can create that resource!'))
                }

                // push the new model to questions
                question.comments.push(newModel)

                // append the new model on the response object
                action.response.comment = newModel

                // save the question model and finish the action execution
                question.save(next)
            })
        })
    }
}, {
    name: 'getComments',
    description: 'Get all Comments',

    run: (api, action, next) => {
        api.models.get('comment').find({}, (err, resources) => {
            action.response.comments = resources
            next()
        })
    }
}, {
    name: 'getComment',
    description: 'Get a Comment',

    inputs: {
        id: {required: true}
    },

    run: (api, action, next) => {
        // search for the request post on the DB
        api.models.get('comment').findById(action.params.id, (err, resource) => {
            // put model information in response object
            action.response.comment = resource

            // finish the action execution
            next()
        })
    }
}, {
    name: 'editComment',
    description: 'Edit a Comment',

    inputs: {
        id: {required: true}
    },

    run: (api, action, next) => {
        // search for the Comment and update it
        api.models.get('comment').findOneAndUpdate({_id: action.params.id}, action.params, {upsert: true}, (err, model) => {
            if (err) {
                // return an error message to the client
                next(new Error('We could not find the resource you were looking for'))
                return
            }

            // put the updated model on the response object
            action.response.comment = model

            // finish the action execution
            next()
        })
    }
}, {
    name: 'removeComment',
    description: 'Remove a Comment',

    inputs: {
        id: { required: true }
    },

    run: (api, action, next) => {
        // search and remove the model
        api.models.get('comment').findByIdAndRemove(action.params.id, err => {
            if (err) {
                  // return an error message to the client
                  next(new Error('We could not remove the requested resource'))
                  return
              }

              // finish the action execution
              next()
        })
    }
} ]
