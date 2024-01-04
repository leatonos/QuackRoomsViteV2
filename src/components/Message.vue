

<template>
  <div class="message-container">
    <h4>{{ user }} says:</h4>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
        background-color: blue;
        margin: 15px 0px;
        width: calc(100% - 30px);
        border-radius: 5px;
        padding: 5px 15px;
    }
</style>
