<template>
  <v-container fluid class="home">
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center></v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'home',
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  height: 100px;
  width: auto;
}

.home {
  background: #f8f8f8;
}
</style>
