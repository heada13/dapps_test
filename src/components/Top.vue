<template>
<div>
<p>DEMOに移動する</p>
<input type="button" value="移動" @click="goNewTask()">
</div>
</template>

<script>
/* eslint-disable */ 

export default {
  name: 'top',
  methods: {
    goNewTask: function () {
      this.$router.push('demo')   //New.vueに移動する
    }
  },

}
</script>