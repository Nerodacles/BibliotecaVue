<template>
    <div class="test">
        <div class="comments">
            <h4>Leave a comment below!</h4>
            <div class="comments-form">
                <form @submit.prevent="handleSubmit">
                    <ul>
                        <!-- <li>
                            <input type="text" placeholder="Name" v-model="username" required />
                        </li> -->
                        <li>
                            <textarea placeholder="Comment" v-model="comment" required></textarea>
                        </li>
                        <li>
                            <div>
                                <input type="submit" value="Post" />
                            </div>
                        </li>
                    </ul>
                </form>
            </div>

            <div class="comments-list">
                <div v-for="comment in comments" :key="comment.id">
                    <div v-if="comment.isActive" class="comment">
                        <h5>{{ comment.username }} says</h5>
                        <p>{{ comment.message }}</p>
                        <p class="comment-time">{{ comment.date }}</p>
                        <div v-if="comment && comment.user == userUID">
                            <span class="far fa-trash-alt px-1" aria-hidden="true" v-on:click="deleteComment(comment)"></span><span class="fas fa-edit" v-on:click="updateComment(comment)" aria-hidden="true"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db } from "../../firebase"
import { booksCollection } from "../../firebase"

export default {
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
        userUID(){
            return auth.currentUser.uid
        },
    },
    data:() => ({
        comment: '',
        comments: [],
    }),
    methods: {
        handleSubmit() {
            this.$store.dispatch('commentActions',{
                action: "create",
                bookID: this.$route.params.id,
                user: this.escapeHTML(auth.currentUser.uid),
                username: this.escapeHTML(this.userData.name),
                message: this.escapeHTML(this.comment),
                time: this.formatTime(),
                likedCount: 0,
            })

            this.comment = '';
        },
        deleteComment: function (comment) {
            this.$store.dispatch('commentActions',{
                action: "delete",
                id: comment.id,
                bookID: comment.bookID,
            })
        },
        updateComment: function (comment){
            this.$store.dispatch('commentActions',{
                action: "update",
                id: comment.id,
                message: comment.message,
                bookID: comment.bookID,
            })
        },
        escapeHTML(html) {
            const div = document.createElement('div');
            div.textContent = html;
            return div.innerHTML;
        },
        formatTime() {
            const options = {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute:'2-digit'
            };
            let now = new Date().toLocaleString('en-US', options);
            return now;
        }
    },
    created() {
		db.collection(`books/${this.$route.params.id}/comments`).onSnapshot(snap=> {
            this.comments = []
            snap.forEach(comment=> {
                var commentData = comment.data();
                commentData.id = comment.id;
                this.comments.push(commentData);
            })
        })
	},
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Quicksand:400,700')


.test
  font-family: 'Quicksand', sans-serif
  display: flex
  justify-content: center
  margin: 100px 0 30px 0

.comments
  width: 100%
  max-width: 100%
  background: #fff
  padding: 20px 30px
  border-radius: 5px
  
.comments-form
  ul
    list-style: none
    margin-left: -40px
    li
      margin-bottom: 15px
      input[type='submit']
        border: 0
        border-radius: 5px
        padding: 10px 15px
        background: #448ef6
        color: #fff
        font-family: 'Quicksand'
        font-weight: bold
      input[type='text'], textarea
        padding: 10px
        border: 1px solid #ccc
        border-radius: 5px
        background: #f5f5f5
        &::placeholder
          font-family: 'Quicksand', sans-serif
        &:focus
          background: #fff
      textarea
        width: 80%
        height: 80px
        resize: none

.comments-list
  margin-top: 30px

.comment
  position: relative
  border-top: 1px dotted #bbb
  padding: 10px 20px
  .comment-time
    position: absolute
    top: 2px
    right: 20px
    color: #777
  h4
    margin-top: 10px

footer
  float: right
  color: #777
  font-size: 0.8em
</style>