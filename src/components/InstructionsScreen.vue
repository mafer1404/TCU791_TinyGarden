<template>
  <div class="container-fluid my-5 d-flex justify-content-center">
    <div class="card instructions-card text-center w-100">
      <h1 class="title">Tiny Garden: A Plant Growth Adventure</h1>
      <h2 class="subtitle">Instructions</h2>

      <ol class="instructions-list text-start mx-auto">
        <li>Plant the seed: Touch or drag the seed onto the soil.</li>
        <li>Give your plant water and sunlight: Click the watering can and the sun. Watch the progress bar fill up!</li>
        <li>Watch it grow: A short video shows each stage of your plant.</li>
        <li>Win the game: When your plant is fully grown, a "Play again" button will appear.</li>
      </ol>

      <button class="btn btn-success start-btn" @click="handleStart">Start Game</button>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    async popSound() {
      try {
        const sound = new Audio(popSound);
        await sound.play();
      } catch (e) {
        //
      }
    },
    async handleStart() {
      await this.popSound();
      this.$emit('start');
    }
  }
}
</script>

<script setup>
import popSound from '../assets/sounds/PopSound.mp3'; 
defineEmits(['start']);
</script>

<style scoped>
.instructions-card {
  background-color: #f4f9f4;
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(153, 217, 140, 0.3);
  padding: 2rem;
  width: 1000px; 
}

.title {
  color: #99d98c;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  color: #a6c48a;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.instructions-list {
  max-width: 600px;
  font-size: 1.15em;
  line-height: 1.6;
  color: #3a5a40;
}

.instructions-list li {
  margin-bottom: 0.8rem;
}

.footer-text {
  color: #6b8e23;
  margin-top: 1.5rem;
}

.start-btn {
  font-size: 1.2rem;
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.start-btn:hover {
  transform: scale(1.05);
}
</style>
