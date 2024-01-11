<template>
  <div class="background_animation">
    <canvas ref="canvas" style="width: 100%; height: calc(100vh);"></canvas>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';

interface Duck {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  rotation: number;
}

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);

    const createDucks = (): void => {
      if (canvas.value) {
        const ctx = canvas.value.getContext('2d');
        if (ctx) {

          const duckSize = 40

          const numberOfDucks = 50;
          const ducks: Duck[] = [];

          for (let i = 0; i < numberOfDucks; i++) {
            ducks.push({
              x: Math.random() * canvas.value.width,
              y: Math.random() * canvas.value.height,
              velocityX: 0.1,
              velocityY: 0.1,
              width: duckSize,
              height: duckSize,
              rotation: 0, // Initial rotation angle
            });
          }

          const duckImg = new Image();
          duckImg.src = '/duck-3.png'; // Adjust the path to your duck SVG

          duckImg.onload = () => {
            const draw = (): void => {
              ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

              ducks.forEach((duck) => {
                duck.x += duck.velocityX;
                duck.y += duck.velocityY;

                // Check collision with walls
                if (duck.x + duck.width > canvas.value.width || duck.x < 0) {
                  duck.velocityX *= -1;
                }
                if (duck.y + duck.height > canvas.value.height || duck.y < 0) {
                  duck.velocityY *= -1;
                }

                ctx.save(); // Save the current state
                ctx.translate(duck.x + duck.width / 2, duck.y + duck.height / 2); // Translate to the center of the duck
                ctx.rotate((duck.rotation * Math.PI) / 180); // Rotate by the specified angle (converted to radians)
                ctx.drawImage(duckImg, -duck.width / 2, -duck.height / 2, duck.width, duck.height); // Draw image centered at the translated position
                ctx.restore(); // Restore to the original state

                duck.rotation += 1; // Increase rotation angle for next frame

              });

              requestAnimationFrame(draw);
            };

            draw();
          };
        }
      }
    };

    watchEffect(() => {
      if (canvas.value) {
        createDucks();
      }
    });

    return {
      canvas,
    };
  },
});
</script>

<style scoped>
.background_animation{
  top: 0;
  left: 0;
  z-index: -9;
}
/* Add any necessary styles */
</style>
