'use strict'

module.exports = [ {
    name: 'createQuestion',
    description: 'Create a new Question',

    inputs: {},

    run: (api, action, next) => {
        // create a new model instance
        var newModel = new (api.models.get('question'))(action.params)

        // save it
        newModel.save(err => {
            if (err) {
                // return an error message to the client
                return next(new Error('We can create that resource!'))
            }

            // spreed the new question by all WebSocket users (we don't need wait for the callback)
            api.chatRoom.broadcast({}, 'defaultRoom', { newQuestion: newModel })

            // append the new model on the response object
            action.response.question = newModel

            // finish the action execution
            next()
        })
    }
}, {
    name: 'getQuestions',
    description: 'Get all Questions',

    run: (api, action, next) => {
        api.models.get('question').find({}, (err, resources) => {
            action.response.questions = resources
            next()
        })
    }
}, {
    name: 'getQuestion',
    description: 'Get a Question',

    inputs: {
        id: {required: true}
    },

    run: (api, action, next) => {
        // search for the request post on the DB
        api.models.get('question').findById(action.params.id)
        .populate('comments')
        .exec((err, resource) => {
            // put model information in response object
            action.response.question = resource

            // finish the action execution
            next()
        })
    }
}, {
    name: 'editQuestion',
    description: 'Edit a Question',

    inputs: {
        id: {required: true}
    },

    run: (api, action, next) => {
        // search for the Question and update it
        api.models.get('question').findOneAndUpdate({_id: action.params.id}, action.params.question, {upsert: true}, (err, model) => {
            if (err) {
                // return an error message to the client
                return next(new Error('We could not find the resource you were looking for'))
            }

            // put the updated model on the response object
            action.response.question = model

            // finish the action execution
            next()
        })
    }
}, {
    name: 'removeQuestion',
    description: 'Remove a Question',

    inputs: {
        id: {required: true}
    },

    run: (api, action, next) => {
        // search and remove the model
        api.models.get('question').findByIdAndRemove(action.params.id, err => {
            if (err) {
                  // return an error message to the client
                  return next(new Error('We could not remove the requested resource'))
              }

              // broadcast the question deletion to all connected users (we don't need wait for the callback)
              api.chatRoom.broadcast({}, 'defaultRoom', { delQuestion: action.params.id })

              // finish the action execution
              next()
        })
    }
} ]
