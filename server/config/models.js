'use strict'

// use a remote MongoDB server
exports.default = {
  models: api => {
    return {
      connectionString: 'mongodb://nomore:nomore@ds063715.mlab.com:63715/nomore',
      pkg: 'mongoose'
    }
  }
}

