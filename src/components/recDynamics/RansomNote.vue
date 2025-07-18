<template>



 <div class="relative max-w-2xl mx-auto ransom-note-container">
    <!-- Paper background with aged, torn edges -->
    <div
      class="relative bg-yellow-50 p-12 shadow-2xl transform rotate-1 border border-yellow-200 paper-noise torn-edge"
      :style="{
        clipPath: `polygon(
          2% 8%, 8% 2%, 15% 6%, 22% 1%, 28% 7%, 35% 3%, 42% 9%,
          48% 4%, 55% 8%, 62% 2%, 68% 6%, 75% 1%, 82% 5%, 88% 9%,
          95% 3%, 98% 8%, 96% 15%, 99% 22%, 94% 28%, 98% 35%,
          92% 42%, 97% 48%, 93% 55%, 98% 62%, 94% 68%, 99% 75%,
          95% 82%, 91% 88%, 97% 95%, 92% 98%, 85% 96%, 78% 99%,
          72% 94%, 65% 98%, 58% 92%, 52% 97%, 45% 93%, 38% 98%,
          32% 94%, 25% 99%, 18% 95%, 12% 91%, 5% 97%, 2% 92%,
          6% 85%, 1% 78%, 6% 72%, 2% 65%, 8% 58%, 3% 52%,
          7% 45%, 2% 38%, 6% 32%, 1% 25%, 5% 18%, 9% 12%, 3% 5%
        )`
      }"
    >
      <!-- Dramatic torn paper effects -->
      <div class="absolute -top-3 left-8 w-12 h-6 bg-yellow-50 transform rotate-45 shadow-lg torn-edge" />
      <div class="absolute -top-4 left-24 w-8 h-8 bg-yellow-50 transform rotate-12 shadow-lg torn-edge" />
      <div class="absolute -top-2 left-40 w-6 h-10 bg-yellow-50 transform -rotate-30 shadow-lg torn-edge" />
      <div class="absolute -top-5 right-20 w-10 h-7 bg-yellow-50 transform rotate-60 shadow-lg torn-edge" />
      <div class="absolute -top-3 right-8 w-7 h-9 bg-yellow-50 transform -rotate-15 shadow-lg torn-edge" />

      <!-- Left edge tears -->
      <div class="absolute -left-4 top-16 w-8 h-12 bg-yellow-50 transform rotate-75 shadow-lg torn-edge" />
      <div class="absolute -left-3 top-32 w-6 h-8 bg-yellow-50 transform -rotate-45 shadow-lg torn-edge" />
      <div class="absolute -left-5 top-48 w-10 h-6 bg-yellow-50 transform rotate-30 shadow-lg torn-edge" />

      <!-- Right edge tears -->
      <div class="absolute -right-3 top-12 w-7 h-10 bg-yellow-50 transform -rotate-60 shadow-lg torn-edge" />
      <div class="absolute -right-4 top-36 w-9 h-7 bg-yellow-50 transform rotate-45 shadow-lg torn-edge" />
      <div class="absolute -right-2 top-56 w-5 h-8 bg-yellow-50 transform -rotate-30 shadow-lg torn-edge" />

      <!-- Bottom edge tears -->
      <div class="absolute -bottom-3 left-12 w-8 h-8 bg-yellow-50 transform rotate-12 shadow-lg torn-edge" />
      <div class="absolute -bottom-4 left-32 w-11 h-6 bg-yellow-50 transform -rotate-45 shadow-lg torn-edge" />
      <div class="absolute -bottom-2 right-24 w-7 h-9 bg-yellow-50 transform rotate-75 shadow-lg torn-edge" />
      <div class="absolute -bottom-5 right-12 w-9 h-7 bg-yellow-50 transform -rotate-20 shadow-lg torn-edge" />

      <!-- Jagged corner tears -->
      <div
        class="absolute -top-3 -left-3 w-10 h-10 bg-yellow-50 transform rotate-45 shadow-lg torn-edge"
        :style="{clipPath: 'polygon(0% 0%, 70% 30%, 100% 0%, 80% 80%, 30% 70%, 0% 100%)'}"
      />
      <div
        class="absolute -top-2 -right-4 w-8 h-12 bg-yellow-50 transform -rotate-12 shadow-lg torn-edge"
        :style="{clipPath: 'polygon(0% 0%, 100% 20%, 90% 60%, 60% 90%, 20% 100%, 0% 70%)'}"
      />
      <div
        class="absolute -bottom-4 -left-2 w-12 h-8 bg-yellow-50 transform rotate-25 shadow-lg torn-edge"
        :style="{clipPath: 'polygon(20% 0%, 100% 0%, 80% 40%, 100% 100%, 0% 90%, 10% 60%)'}"
      />
      <div
        class="absolute -bottom-3 -right-3 w-9 h-9 bg-yellow-50 transform -rotate-35 shadow-lg torn-edge"
        :style="{clipPath: 'polygon(0% 20%, 80% 0%, 100% 30%, 70% 70%, 100% 100%, 20% 80%)'}"
      />

      <!-- Coffee stains and aging effects with animation -->
      <div class="absolute top-6 right-12 w-12 h-12 bg-amber-600 opacity-20 rounded-full blur-sm coffee-stain" />
      <div class="absolute bottom-8 left-8 w-10 h-10 bg-amber-800 opacity-15 rounded-full blur-sm coffee-stain" />
      <div class="absolute top-20 left-16 w-6 h-6 bg-yellow-800 opacity-10 rounded-full blur-sm coffee-stain" />
      <div class="absolute top-32 right-20 w-8 h-8 bg-amber-700 opacity-12 rounded-full blur-sm coffee-stain" />
      <div class="absolute bottom-16 right-16 w-7 h-7 bg-yellow-700 opacity-18 rounded-full blur-sm coffee-stain" />
      <div class="absolute top-48 left-32 w-5 h-5 bg-amber-800 opacity-14 rounded-full blur-sm coffee-stain" />

      <!-- Ransom note text with mixed fonts/styles -->
      <div class="relative z-10 space-y-8 title-block" style="margin: 12px;">
        <h1 class="text-center text-black tracking-wider">
          <span class="text-5xl font-bold transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">W</span>
          <span class="text-4xl font-normal transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">A</span>
          <span class="text-5xl font-bold transform inline-block -rotate-2 ransom-letter" :style="{fontFamily: 'Arial, sans-serif'}">N</span>
          <span class="text-4xl font-normal transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Georgia, serif'}">T</span>
          <span class="spacer"></span>
          <span class="text-5xl font-bold transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Helvetica, sans-serif'}">T</span>
          <span class="text-4xl font-normal transform inline-block rotate-2 ransom-letter" :style="{fontFamily: 'Courier New, monospace'}">0</span>
          <span class="spacer"></span>
          <span class="text-5xl font-bold transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">C</span>
          <span class="text-4xl font-normal transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">H</span>
          <span class="text-5xl font-bold transform inline-block rotate-2 ransom-letter" :style="{fontFamily: 'Arial, sans-serif'}">A</span>
          <span class="text-4xl font-normal transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Georgia, serif'}">N</span>
          <span class="text-5xl font-bold transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">G</span>
          <span class="text-4xl font-normal transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">E</span>
          <br />
          <span class="text-5xl font-bold transform inline-block -rotate-2 ransom-letter" :style="{fontFamily: 'Arial, sans-serif'}">T</span>
          <span class="text-4xl font-normal transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Georgia, serif'}">H</span>
          <span class="text-5xl font-bold transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Helvetica, sans-serif'}">E</span>
          <span class="spacer"></span>

          <span class="text-4xl font-normal transform inline-block rotate-2 ransom-letter" :style="{fontFamily: 'Courier New, monospace'}">V</span>
          <span class="text-5xl font-bold transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">O</span>
          <span class="text-4xl font-normal transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">L</span>
          <span class="text-5xl font-bold transform inline-block rotate-2 ransom-letter" :style="{fontFamily: 'Arial, sans-serif'}">U</span>
          <span class="text-4xl font-normal transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Georgia, serif'}">M</span>
          <span class="text-5xl font-bold transform inline-block -rotate-1 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">E</span>
          <span class="text-4xl font-normal transform inline-block rotate-1 ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">?</span>

        </h1>

        <div class="border-t-4 border-dashed border-gray-400 pt-6">
          <p class="text-center text-black leading-relaxed space-y-2">
            <span class="block text-2xl font-bold text-red-800 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">
              LISTEN TO THE FINAL MESSAGE
            </span>
            <span class="block text-xl font-normal ransom-letter" :style="{fontFamily: 'Times New Roman, serif'}">
                <span class="text-red-600 font-bold">OR ELSE</span>
            </span>
            <span class="block text-lg ransom-letter" :style="{fontFamily: 'Courier New, monospace'}">
			    we'll publish your search history
            </span>
            <span class="block text-xl text-red-800 ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">
              PUBLISHED FOR ALL TO SEE
            </span>
          </p>
        </div>

        <!-- Deadline section -->
        <div class="border-t-4 border-dashed border-red-600 pt-6 mt-6">
          <div class="bg-red-100 border-2 border-red-800 p-4 transform -rotate-1 shadow-lg paper-noise">
            <h3 class="text-center text-red-900 mb-4">
              <span class="text-lg font-bold ransom-letter" :style="{fontFamily: 'Impact, Arial Black, sans-serif'}">
                ⏰ YOUR SEARCH HISTORY PREVIEW: ⏰
              </span>
            </h3>
            <div class="text-center space-y-2">
                <ul class="search-list">
                    <li class="search-item">"Underground Super Smash Brothers Tournament"</li>
                    <li class="search-item">"How to get AI to do my job"</li>
                    <li class="search-item">"How to get a forklift certification fast?"</li>
                    <li class="search-item">"How many energy drinks is too many webMD"</li>
                </ul>
              <div class="text-red-900 font-bold ransom-letter" :style="{fontFamily: 'Georgia, serif', marginBottom: '18px'}">
                TICK TOCK, TIME IS RUNNING OUT!
              </div>

            </div>


            <!-- Additional aging effects for this section -->
            <div class="absolute top-2 right-2 w-3 h-3 bg-red-900 opacity-30 rounded-full blur-sm coffee-stain" />
            <div class="absolute bottom-1 left-3 w-2 h-2 bg-red-800 opacity-40 rounded-full blur-sm coffee-stain" />
          </div>
          <div class="button-container">
                <button
                    class="listen-button"
                    @click="handleListenClick"
                    >
                🎧 LISTEN TO FINAL MESSAGE
                </button>
            </div>
        </div>
      </div>


      <!-- Tape effects on corners with realistic styling -->
      <div
        class="absolute top-4 left-4 w-12 h-6 opacity-80 transform -rotate-12 shadow-sm tape-effect"
        :style="{
          clipPath: 'polygon(0% 20%, 100% 0%, 95% 80%, 5% 100%)'
        }"
      />
      <div
        class="absolute top-6 right-6 w-10 h-8 opacity-80 transform rotate-45 shadow-sm tape-effect"
        :style="{
          clipPath: 'polygon(10% 0%, 100% 15%, 90% 100%, 0% 85%)'
        }"
      />
      <div
        class="absolute bottom-4 right-8 w-14 h-5 opacity-80 transform -rotate-6 shadow-sm tape-effect"
        :style="{
          clipPath: 'polygon(0% 10%, 95% 0%, 100% 90%, 5% 100%)'
        }"
      />
    </div>

    <!-- Enhanced shadow effect with animation -->
    <div class="absolute inset-0 bg-black opacity-30 blur-sm transform translate-x-2 translate-y-2 -z-10 ransom-shadow" />
  </div>




</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['listen-click']);

const handleListenClick = () => {
    emit('listen-click');
}
</script>

<style scoped>
.title-block {
    padding-top: 18px;
    .spacer{
      width: 20px;
      display: inline-block;
    }
}
.search-item {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: #2c1810;
    padding: 8px 0;
    border-bottom: 1px dotted #8b0000;
    text-align: left;
    padding-left: 14px;
}

.search-item:before {
    content: "• ";
    color: #8b0000;
    font-weight: bold;
    margin-right: 0.5rem;
}

.search-item:last-child {
    border-bottom: none;
}

.button-container{
    width: 100%;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 34px;
}
.listen-button {
    background: linear-gradient(145deg, #8b0000, #5c0000);
    color: #ffffff;
    border: 3px solid #2c0000;
    padding: 12px;
    font-family: 'Impact', sans-serif;
    font-size: 16px;
    letter-spacing: 4px;
    cursor: pointer;
    transform: rotate(-1deg);
    transition: all 0.3s ease;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.listen-button:hover {
    background: linear-gradient(145deg, #a60000, #700000);
    transform: rotate(0deg) scale(1.05);
    box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.7);
}

.listen-button:active {
    transform: rotate(-1deg) scale(0.98);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
}
</style>