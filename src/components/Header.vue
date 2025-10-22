<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="border rounded shadow p-3 d-flex justify-content-center
      align-items-center gap-3 w-100 flex-wrap">
      <img
          :src="LogoUCR"
          alt="UCR logo"
          class="img-fluid"
          style="max-width: 200px" />

      <img
          :src="LogoELM"
          alt="ELM Logo"
          class="img-fluid"
          style="max-width: 200px"/>

      <img
          :src="LogoTCU"
          alt="TCU Logo"
          class="img-fluid"
          style="max-width: 200px" />
    </div>
  </div>
</template>

<script>
import LogoUCR from '../assets/images/LogoUCR.jpg';
import LogoTCU from '../assets/images/LogoTCU.jpg';
import LogoELM from '../assets/images/LogoELM.png';

export default {
  name: 'HeaderHomePage',
  data() {
    return {
      LogoUCR,
      LogoELM,
      LogoTCU,
    };
  }
}
</script>