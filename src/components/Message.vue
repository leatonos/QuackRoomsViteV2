

<template>
  <div class="message-container">
    <div class="message-duck-image">
      <DuckPortrait :color="color"/>
    </div>
    <div class="message-text">
      <h4>{{ user }} says:</h4>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DuckPortrait from './DuckPortrait.vue';
export default defineComponent({
  components:{
    DuckPortrait
  }, 
  props: {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'black',
    },
  },
  computed: {
    textColor(): string {
      return this.color;
    },
  },
});
</script>

<style scoped>
    .message-container{
        display: flex;
        flex-direction: row;
        justify-content:start;
        align-items: center;
        background-color: white;
        margin: 15px 0px;
        width: calc(100% - 30px);
        border-radius: 5px;
        padding: 5px 15px;
    }

    .message-duck-image{
      
    }

    .message-text{

    }
</style>
