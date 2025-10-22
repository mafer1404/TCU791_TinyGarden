<template>
  <div class="game-container">
    <h2>
      Stage: <span style="color: #99d98c;">{{ stages[plantState.stage] }}</span>
    </h2>

    <div class="resources-above-plant">
      <img src="@/assets/images/sun.png" alt="Sunlight" class="resource-icon" @click="handleSunClick" />
      <img src="@/assets/images/watering_can.png" alt="Water" class="resource-icon" @click="handleWaterClick" />
    </div>

    <div class="plant-visual">
      <img 
        v-for="(plant, index) in plants" 
        :key="index" 
        :src="stageImages[plantState.stage]" 
        :alt="stages[plantState.stage]" 
        class="plant-image"
        :style="{ left: plant.x + '%', bottom: plant.y + 'px' }"
      />

    <div v-for="drop in waterDrops" :key="drop.id" class="water-drop" :style="{ left: drop.x + '%' }"></div>
    <div v-for="ray in sunRays" :key="ray.id" class="sun-ray" :style="{ left: ray.x + '%' }"></div>
    </div>

    <div v-if="isFinished" class="finished-banner">
      <h3>Congratulations! You have grown beautiful {{ stages[plantState.stage] }}s!</h3>
      <button @click="$emit('restart')" class="btn btn-success start-btn">Play again</button>
    </div>

    <div v-else class="resource-controls">
      <div class="progress-item">
        <label>Water</label>
        <div class="progress-bar">
          <div class="progress-fill water-fill" :style="{ width: plantState.water + '%' }"></div>
        </div>
      </div>

      <div class="progress-item">
        <label>Sunlight</label>
        <div class="progress-bar">
          <div class="progress-fill sun-fill" :style="{ width: plantState.sun + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import grownSeedImage from '../assets/images/grown_seed.png';
import sproutImage from '../assets/images/sprout.png';
import plantImage from '../assets/images/plant.png';
import flowerImage from '../assets/images/flower.png';
import wateringSound from '../assets/sounds/Watering.mp3';
import sunlightSound from '../assets/sounds/Sunlight.mp3';

defineProps({
  plantState: Object,
  stages: Array,
  maxProgress: Number,
  isFinished: Boolean,
  seedCount: Number,
});

const emit = defineEmits(['provide-resource', 'restart']);

const stageImages = [
  grownSeedImage,
  sproutImage,
  plantImage,
  flowerImage
];

const plants = ref([
  { x: 20, y: 0 },
  { x: 50, y: 0 },
  { x: 80, y: 0 },
]);

const waterDrops = ref([]);
const sunRays = ref([]);
const wateringAudio = new Audio(wateringSound);
const sunlightAudio = new Audio(sunlightSound);

const handleWaterClick = () => {
  emit('provide-resource', 'water');
  
  wateringAudio.currentTime = 0;
  wateringAudio.play();

  plants.value.forEach((plant, plantIndex) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const id = Date.now() + plantIndex * 10 + i;
        waterDrops.value.push({ id, x: plant.x });

        setTimeout(() => {
          waterDrops.value = waterDrops.value.filter(d => d.id !== id);
        }, 1000);
      }, i * 200);
    }
  });
};

const handleSunClick = () => {
  emit('provide-resource', 'sun');

  sunlightAudio.currentTime = 0;
  sunlightAudio.play();

  plants.value.forEach((plant, plantIndex) => {
    for (let i = 0; i < 3; i++) { 
      setTimeout(() => {
        const id = Date.now() + plantIndex * 10 + i;
        sunRays.value.push({ id, x: plant.x });

        setTimeout(() => {
          sunRays.value = sunRays.value.filter(r => r.id !== id);
        }, 1000);
      }, i * 300);
    }
  });
};

</script>

<style scoped>
.game-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.resources-above-plant {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.resource-icon {
  width: 150px;
  height: 150px;
  cursor: pointer;
  transition: transform 0.2s;
}

.resource-icon:hover {
  transform: scale(1.1);
}

.plant-visual {
  position: relative;
  width: 100%;
  height: 200px;
  background-image: url('@/assets/images/terrain.png');
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}

.plant-image {
  position: absolute;
  width: 150px;
  height: 150px;
  object-fit: contain;
  transform: translateX(-50%);
  transition: transform 0.3s;
}

.plant-image:hover {
  transform: translateX(-50%) scale(1.1);
}

.water-drop {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #00aaff;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scale(1);
  animation: drop 1s ease-out forwards;
}

.sun-ray {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #ff0 0%, transparent 70%);
  border-radius: 50%;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) scale(1);
  animation: ray 1s ease-out forwards;
}

@keyframes drop {
  0% { top: 0; opacity: 1; }
  100% { top: 140px; opacity: 0; transform: scale(1.8); }
}

@keyframes ray {
  0% { transform: translateX(-50%) scale(0.8); opacity: 1; top: 20px; }
  100% { transform: translateX(-50%) scale(2); opacity: 0; top: 100px; }
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #f4f9f4;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px 0;
}

.progress-fill {
  height: 100%;
  width: 0%;
  border-radius: 10px 0 0 10px;
  transition: width 0.4s ease;
}

.water-fill {
  background: linear-gradient(90deg, #00cfff, #0077cc);
}

.sun-fill {
  background: linear-gradient(90deg, #fffc7f, #ffdd33);
}

.finished-banner {
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}
</style>
