<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <video
        :src="videoSrc"
        controls
        autoplay
        style="width:100%; border-radius: 12px;"
      ></video>

      <button class="close-btn" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    videoSrc: String
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 18px;
  border-radius: 14px;
  width: 80%;
  max-width: 850px;
}
.close-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: #3da35a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
