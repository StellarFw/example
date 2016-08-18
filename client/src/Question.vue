<template>
<div class="container nm-Question_container">
  <!-- question card -->
  <md-card class="nm-Question_cardQuestion blue-grey darken-1" content-class="white-text">
    <!-- title -->
    <span slot="title">{{ question.title }}</span>
    
    <!-- excerpt -->
    <p>{{ question.content }}</p>
  </md-card>

  <!-- form to add a new comment -->
  <div v-if="$root.authenticated" class="nm-newComment">
    <div class="nm-newComment_container">
      <div class="row">
        <form class="col s12">
          <!-- content -->
          <md-textarea :value.sync="newComment.content" name="nm-newComment_content" :debounce="500">New comment</md-textarea>

          <!-- create the new question -->
          <md-btn @click.prevent="createComment()" class="nm-newComment_btn waves-effect waves-light">Post</md-btn>
        </form>
      </div>
    </div>
  </div>

  <!-- list all comments to this question -->
  <!--- when empty -->
  <md-card v-if="question.comments.length === 0">
    <span slot="title">There is no comments, until now! 🙁</span>
  </md-card>
  <!--- when not empty -->
  <div v-if="question.comments.length !== 0">
    <md-card v-for="comment in question.comments">
      <!-- user name -->
      <span slot="title">{{ comment.user.name }}</span>

      <!-- comment content -->
      <p>{{ comment.content }}</p>
    </md-card>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      // question info
      question: {
        title: '',
        content: '',
        comments: []
      },

      // new comment data
      newComment: {
        content: ''
      }
    }
  },

  ready() {
    let self = this

    // fetch the question info
    self.fecthQuestion()
  },

  methods: {
    fecthQuestion() {
      let self = this

      self.$root.stellar.action('getQuestion', {
        id: self.$route.params.id
      }, response => { self.question = response.question })
    },

    createComment() {
      let self = this

      // prepare the data to be send
      let data = self.newComment

      // append question id
      data.question_id = self.question._id

      // append the user profile
      data.user = JSON.parse(localStorage.getItem('profile'))
      
      // make API call to create a new comment
      self.$root.stellar.action('createComment', data, response => {
        // fetch the question 
        self.fecthQuestion() 

        // clean up the new comment form
        self.newComment.content = ''
      })
    }
  }
}
</script>

<style>
.nm-newComment_container {
  transition: box-shadow .25s;
  padding: 20px;
  margin: 0.5rem 0 1rem 0;
  border-radius: 2px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);

  background-color: #eceff1;
}
.nm-newComment_btn { float: right; }
</style>