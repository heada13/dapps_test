<template>
<div>
<table border="1" align="center">
  <tr>
    <th>myaccount</th>
    <th>{{ myaccount }}</th>
  </tr>
  <tr>
    <td>Data in BlockChain</td>
    <td>{{ update_bcdata[0] }}</td>
  </tr>
</table>

<font color="red"> {{update_bcdata[1]}} </font>
<br><br>
<input type="text" v-model="msg">
<button v-on:click="okButtonClick">update</button>
<br><br><br>
<button v-on:click="returnButtonClick">TOP PAGEへ戻る</button>
</div>
</template>
<script>
/* eslint-disable */ 
import * as types from '../store/mutation-types'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'demo',

  data(){
    return {
      msg: ''
    }
  },

  methods:{
    ...mapActions([
      'update_BCDATA',
      'initial',

    ]),

    okButtonClick: function () {
      console.log('ok button click')
      this.update_BCDATA(this.msg)
         //console.log(this.$store.getters.newTodo)    
         //this.test_dat()
    },

    returnButtonClick: function () {
      this.$router.go(-1) // 1つ戻る
    }
  },

  computed: {

  ...mapGetters({
    myaccount:'datACCOUNT',
    get_bcdata:'BCDATA',
    updating_done: 'UPDATING_DONE'
  }),
    update_bcdata: {     
      get () {
      //  return [this.$store.getters.BCDATA, this.$store.getters.UPDATING_DONE]
      return [this.get_bcdata,this.updating_done]
      },
      set (value) {
        this.$store.commit(types.UPDATING_BCDAT, value)
      },
     }
  },

  created () {
    this.initial()
    console.log('call init')
  },

}
</script>


<style scoped>
</style>