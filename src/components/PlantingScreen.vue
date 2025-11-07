<template>
  <div class="container-fluid my-5 d-flex justify-content-center">
    <div class="card game-container text-center w-100">
      
      <VideoModal
        :visible="showVideo"
        :videoSrc="currentVideo"
        @close="showVideo = false"
      />

      <h2 class="title">Planting Screen</h2>
      <p>Drag the seed and plant it in the soil area below.</p>

      <div class="seed-source">
        <img 
          ref="seedRef"
          :src="seedImage" 
          alt="Seed" 
          class="seed"
          @mousedown.prevent="startDrag"
          @touchstart.prevent="startDrag"
        >
      </div>
      
      <div class="soil-area" ref="soil">
        <img 
          ref="soilImg"
          :src="soilImage" 
          alt="Soil Area" 
          class="soil-img"
        >

        <img
          v-for="(seed, index) in plantedSeeds"
          :key="index"
          :src="seedImage"
          alt="Planted Seed"
          class="planted-seed"
          :style="{ left: seed.x + 'px', top: seed.y + 'px' }"
        >
        
        <p v-if="seedCount === 0">Empty soil. Drag a seed here to plant it!</p>
        <p v-else style="margin-top: 15px;">
          You have planted {{ seedCount }} seed{{ seedCount > 1 ? 's' : '' }}!
        </p>
      </div>

      <button 
        @click="handleContinue" 
        :disabled="seedCount < 1"
        class="btn btn-success start-btn"
      >
        Start watering
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import seedImage from '../assets/images/seed.png'; 
import soilImage from '../assets/images/terrain.png'; 
import popSoundFile from '../assets/sounds/PopSound.mp3';
import plantingSoundFile from '../assets/sounds/Planting.mp3';
import VideoModal from '@/components/AnimationModal.vue';
import videoSeed from '@/assets/videos/seed.mp4';

const emit = defineEmits(['start', 'continue']);

const plantedSeeds = ref([]);
const soil = ref(null);
const soilImg = ref(null);
const seedRef = ref(null);
const showVideo = ref(false);
const currentVideo = ref(null);

const seedCount = computed(() => plantedSeeds.value.length);
let dragging = null;

const popAudio = new Audio(popSoundFile);
const plantingAudio = new Audio(plantingSoundFile);

onMounted(() => {
  currentVideo.value = videoSeed;
  showVideo.value = true;
});

const playPopSound = async () => { 
  try { 
    await popAudio.play(); 
    popAudio.currentTime = 0;
  } catch(e){ 
    console.warn('Pop sound failed', e); 
  } 
};

const playPlantingSound = async () => { 
  try { 
    await plantingAudio.play(); 
    plantingAudio.currentTime = 0;
  } catch(e){ 
    console.warn('Planting sound failed', e); 
  } 
};

const handleContinue = async () => {
  await playPopSound();
  emit('start');
  emit('continue', seedCount.value);
};

const startDrag = (event) => {
  const isTouch = event.type === 'touchstart';
  const rect = event.target.getBoundingClientRect();

  dragging = {
    el: event.target.cloneNode(true),
    width: rect.width,
    height: rect.height
  };

  dragging.el.style.position = 'absolute';
  dragging.el.style.zIndex = '1000';
  dragging.el.style.pointerEvents = 'none';
  dragging.el.style.width = rect.width + 'px';
  dragging.el.style.height = rect.height + 'px';
  dragging.el.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(dragging.el);

  const moveEvent = isTouch ? 'touchmove' : 'mousemove';
  const endEvent = isTouch ? 'touchend' : 'mouseup';

  const move = (e) => {
    const moveX = isTouch ? e.touches[0].clientX : e.clientX;
    const moveY = isTouch ? e.touches[0].clientY : e.clientY;
    dragging.el.style.left = moveX + 'px';
    dragging.el.style.top = moveY + 'px';
  };

  const end = async (e) => {
    const dropX = isTouch ? e.changedTouches[0].clientX : e.clientX;
    const dropY = isTouch ? e.changedTouches[0].clientY : e.clientY;
    const imgRect = soilImg.value.getBoundingClientRect();

    if (
      dropX >= imgRect.left &&
      dropX <= imgRect.right &&
      dropY >= imgRect.top &&
      dropY <= imgRect.bottom
    ) {
      plantedSeeds.value.push({
        x: dropX - imgRect.left,
        y: dropY - imgRect.top,
      });
      await playPlantingSound();
    }

    document.body.removeChild(dragging.el);
    document.removeEventListener(moveEvent, move);
    document.removeEventListener(endEvent, end);
    dragging = null;
  };

  document.addEventListener(moveEvent, move);
  document.addEventListener(endEvent, end);
};
</script>

<style scoped>
.seed-source {
  display: inline-block;
  margin-bottom: 20px;
  border: 1px dashed green;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  background-color: #f8fff4;
}

.title {
  color: #99d98c;
  font-weight: 700;
  margin-bottom: 1rem;
}

.soil-area {
  position: relative;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.soil-img {
  width: 100%;
  max-width: 600px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.seed {
  width: 70px;
  cursor: grab;
  margin-bottom: 15px;
  user-select: none;
}

.planted-seed {
  position: absolute;
  width: 50px;
  height: auto;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.game-container {
  background-color: #f4f9f4;
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(153, 217, 140, 0.3);
  padding: 2rem;
  width: 1000px; 
}

.start-btn {
  font-weight: 600;
  border-radius: 10px;
  padding: 10px 25px;
}
</style>
