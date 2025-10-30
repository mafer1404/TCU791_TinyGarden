<script setup>
import { ref, computed } from 'vue';
import InstructionsScreen from './components/InstructionsScreen.vue';
import PlantingScreen from './components/PlantingScreen.vue';
import GrowthScreen from './components/GrowthScreen.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const currentScreen = ref('instructions');
const plantedSeeds = ref(0);

const plantState = ref({
  stage: 0,
  water: 0,
  sun: 0,
});

const MAX_PROGRESS = 100;
const STAGES = ['sprout', 'growing plant', 'flower'];

const bannerMessage = ref('');
const showBanner = ref(false);

const startGame = () => {
  currentScreen.value = 'planting';
};

const startGrowth = (seedCount) => {
  if (seedCount > 0) {
    plantedSeeds.value = seedCount;
    currentScreen.value = 'growth';
  } else {
    bannerMessage.value = 'You must plant at least one seed!';
    showBanner.value = true;

    setTimeout(() => {
      showBanner.value = false;
    }, 3000);
  }
};

const restartGame = () => {
  plantedSeeds.value = 0;
  plantState.value = {
    stage: 0,
    water: 0,
    sun: 0,
  };
  currentScreen.value = 'instructions';
};

const provideResource = (resource) => {
  const progressAmount = 30;

  if (resource === 'water') {
    plantState.value.water = Math.min(plantState.value.water + progressAmount, MAX_PROGRESS);
  } else if (resource === 'sun') {
    plantState.value.sun = Math.min(plantState.value.sun + progressAmount, MAX_PROGRESS);
  }

  checkGrowth();
};

const checkGrowth = () => {
  if (plantState.value.water >= MAX_PROGRESS && plantState.value.sun >= MAX_PROGRESS) {
    if (plantState.value.stage < STAGES.length - 1) {
      plantState.value.stage += 1;
      plantState.value.water = 0;
      plantState.value.sun = 0;
    }
  }
};

const isFinished = computed(() => plantState.value.stage === STAGES.length - 1);
</script>

<template>
  <div id="plant-grow-game">

    <transition name="fade">
      <div v-if="showBanner" class="alert-banner">
        {{ bannerMessage }}
      </div>
    </transition>

    <Header />

    <div>
      <InstructionsScreen
        v-if="currentScreen === 'instructions'"
        @start="startGame"
      />

      <PlantingScreen
        v-else-if="currentScreen === 'planting'"
        @continue="startGrowth"
      />

      <GrowthScreen
        v-else-if="currentScreen === 'growth'"
        :plant-state="plantState"
        :stages="STAGES"
        :max-progress="MAX_PROGRESS"
        :is-finished="isFinished"
        :seed-count="plantedSeeds"
        @provide-resource="provideResource"
        @restart="restartGame"
      />
    </div>

    <Footer />
  </div>
</template>

<style>
#plant-grow-game {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.alert-banner {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 15px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.game-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
.resource-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px;
}
</style>
