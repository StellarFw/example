<template>
<div class="container">
  <!-- new form -->
  <div v-if="$root.authenticated" class="nm-newQuestion">
    <h3>New question</h3>

    <div class="nn-newQuestion_container">
      <div class="row">
        <form class="col s12">
          <!-- title -->
          <md-input name="nn-newQuestion_title" :value.sync="newQuestion.title" placeholder="Title">Title</md-input>
          
          <!-- content -->
          <md-textarea :value.sync="newQuestion.content" name="nn-newQuestion_content" :debounce="500">Content</md-textarea>

          <!-- create the new question -->
          <md-btn class="waves-effect waves-light nm-newQuestion_btn" @click.prevent="createPost()">Post</md-btn>
        </form>
      </div>
    </div>
  </div>

  <!-- list of all questions -->
  <div class="nn-listOfQuestions">
    <h3>All questions</h3>

    <div class="nm-listOfQuestions_container">
      <md-card v-for="question in questions" class="blue-grey darken-1 nm-card" content-class="white-text">
        <!-- title -->
        <span slot="title">{{ question.title }}</span>
        
        <!-- excerpt -->
        <p>{{ question.excerpt }}</p>
        
        <!-- actions -->
        <div slot="actions">
          <!-- view only this question -->
          <a v-link="{name: 'question', params: {id: question._id}}" href="#!">View</a>

          <!-- delete question -->
          <a @click.prevent="deleteQuestion(question)" href="#">Delete</a>
        </div>
      </md-card>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      // all questions
      questions: [],
      
      // new question structure
      newQuestion: {
        title: '',
        content: ''
      }
    }
  },

  ready() {
    let self = this

    // get all questions from server
    self.fetchQuestions()
  },

  events: {
    'new-question'(newQuestion) {
      let self = this

      // append the new question to `self.questions` array
      self.questions.unshift(newQuestion)
    },
    'del-question'(deletedId) {
      let self = this
      
      // remove the deleted question from the `self.questions` array
      self.questions = self.questions.filter(item => item.id !== deletedId)
    }
  },

  methods: {
    fetchQuestions() {
      let self = this

      self.$root.stellar.action('getQuestions', response => {
        self.questions = response.questions
      })
    },

    createPost() {
      let self = this

      // append user profile to the request
      let data = self.newQuestion
      data.user = localStorage.getItem('profile')
      
      // make the API request
      self.$root.stellar.action('createQuestion', data, response => {
        // todo: show a toast with a success message
      })
    },

    /**
     * Delete the requested question
     *
     * @todo validate if the user is the question owner, only then can remove 
     *       the question
     * 
     * @param  {object} question  question object
     */
    deleteQuestion(question) {
      let self = this

      // todo: check if the user is the owner of this question
      
      // make an API call to remove this question
      self.$root.stellar.action('removeQuestion', {id: question._id}, response => {
        // re-fetch all questions
        self.fetchQuestions()
      })
    }
  }
}
</script>

<style>
/* new card */
.nm-newCard { width: 100%; }
.nn-newQuestion_container {
  transition: box-shadow .25s;
  padding: 20px;
  margin: 0.5rem 0 1rem 0;
  border-radius: 2px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);

  background-color: #eceff1;
}

.nm-card { width: 100% }

.nm-newQuestion_btn { float: right; }
</style>