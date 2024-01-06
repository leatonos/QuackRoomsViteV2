<template>
    <div>
        <h1>Yellow</h1>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: String,
      required: true,
    }
  }
});
</script>