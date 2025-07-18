<template>
    <div :class="['volume-mix-bg', { shake: isShaking }]" @animationend="isShaking = false">
        <div class="header-area">
            <h1 class="volume-title">🎚️ Volume Mix <span class="off-label">OFF</span></h1>
            <p class="subtitle">Experience the silence from the artist's perspective.<br>
                <span class="subtitle-detail">Turn the knobs, feel the shake, but the mix is off!</span>
            </p>
        </div>
        <div>
            <div class="volume-display">
                <span>Volume: {{ volume }}</span>
            </div>
            <div @click="resetKnobs" style="cursor:pointer;">Reset</div>
            <div class="volume-display">
                <svg
                    width="100%"
                    height="220"
                    viewBox="0 0 800 220"
                    preserveAspectRatio="none"
                >
                    <rect
                        v-for="n in 10"
                        :key="n"
                        :x="(n - 1) * 75 + 30"
                        :y="200 - (volume / 100) * 160 * n / 10"
                        width="55"
                        :height="(volume / 100) * 160 * n / 5"
                        fill="#42b983"
                        rx="8"
                    />
                </svg>
            </div>
            <div class="knob-control-container">
                <span class="fake-btn left"></span>
                <span class="fake-btn right"></span>
                <div class="knob-row">
                    <Knob v-model="volume" :sensitivity="1" :maxChange="10" :key="'k1-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="6" :maxChange="18" :key="'k2-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="-9" :maxChange="50" :key="'k8-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="1" :maxChange="5" :key="'k5-'+knobResetKey"></Knob>
                </div>
                <div class="knob-row bottom">
                    <Knob v-model="volume" :sensitivity="3" :maxChange="15" :key="'k6-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="0" :maxChange="10" :key="'k3-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="-4" :maxChange="24" :key="'k4-'+knobResetKey"></Knob>
                    <Knob v-model="volume" :sensitivity="0" :maxChange="20" :key="'k7-'+knobResetKey"></Knob>
                </div>
            </div>
        </div>
        <!-- Audio element for crowd cheering -->
        <audio
            ref="crowdAudio"
            src="https://cdn.pixabay.com/audio/2025/03/07/audio_b32c860c59.mp3"
            loop
            autoplay
        ></audio>
        <!-- Audio element for error sound -->
        <audio
            ref="errorAudio"
            src="https://cdn.pixabay.com/audio/2025/06/02/audio_9dd11cb4aa.mp3"
        ></audio>
    </div>
</template>

<script>
import Knob from './VolumeMixOff/knob.vue';

export default {
    name: 'VolumeMixOff',
    components: { Knob },
    data() {
        return {
            volume: 0,
            knobResetKey: 0, // Used to force re-mount knobs
            isShaking: false
        };
    },
    watch: {
        volume(newVal, oldVal) {
            console.log(`Volume changed from ${oldVal} to ${newVal}`);
            if (newVal > 100 || newVal < -5) {
                // Stop crowd audio
                const crowdAudio = this.$refs.crowdAudio;
                if (crowdAudio) {
                    crowdAudio.pause();
                    crowdAudio.currentTime = 0;
                }
                // Play error audio at max volume, only once
                const errorAudio = this.$refs.errorAudio;
                if (errorAudio) {
                    errorAudio.volume = 1;
                    errorAudio.currentTime = 0;
                    // Play error sound, then show alert after it starts
                    errorAudio.play().catch(() => {}).finally(() => {
                        window.alert('Error: Volume must stay between -5 and 100. Resetting knobs.');
                        this.resetKnobs();
                    });
                    return;
                }
                // Fallback if errorAudio is not available
                window.alert('Error: Volume must stay between -5 and 100. Resetting knobs.');
                this.resetKnobs();
            } else if (newVal !== oldVal) {
                document.documentElement.style.setProperty('--volume', newVal);
                this.triggerShake();
                this.setCrowdVolume(newVal);
            }
        }
    },
    mounted() {
        // Set initial audio volume to 0 (silent)
        const audio = this.$refs.crowdAudio;
        if (audio) {
            audio.volume = this.volume;
            audio.play();
        }
        // Set the CSS variable for shake
        document.documentElement.style.setProperty('--volume', this.volume);
    },
    methods: {
        increaseVolume() {
            this.volume = Math.min(100, this.volume + 1);
        },
        decreaseVolume() {
            this.volume = Math.max(-5, this.volume - 1);
        },
        resetKnobs() {
            // Reset volume and force re-mount knobs to reset their internal state
            this.volume = 0;
            this.knobResetKey++;
            this.setCrowdVolume(0);
            // Resume crowd audio after reset
            const crowdAudio = this.$refs.crowdAudio;
            if (crowdAudio) {
                crowdAudio.currentTime = 0;
                crowdAudio.play().catch(() => {});
            }
        },
        triggerShake() {
            // Remove and re-add the shake class to restart the animation
            this.isShaking = false;
            this.$nextTick(() => {
                this.isShaking = true;
            });
        },
        setCrowdVolume(val) {
            // Clamp between 0 and 1 for audio element
            const audio = this.$refs.crowdAudio;
            if (audio) {
                audio.volume = Math.max(0, Math.min(1, val / 100));
            }
        }
    }
};
</script>

<style scoped>
@keyframes shake {
    0% { transform: translate(0, 0) rotate(0deg); }
    10% { transform: translate(calc(var(--shake-amount, 1px) * -1.5), -2px) rotate(-1.5deg); }
    20% { transform: translate(calc(var(--shake-amount, 1px) * 1.5), 2px) rotate(1.5deg); }
    30% { transform: translate(calc(var(--shake-amount, 1px) * -2), 1px) rotate(-2deg); }
    40% { transform: translate(calc(var(--shake-amount, 1px) * 2), -1px) rotate(2deg); }
    50% { transform: translate(calc(var(--shake-amount, 1px) * -2.5), 2px) rotate(-2.5deg); }
    60% { transform: translate(calc(var(--shake-amount, 1px) * 2.5), -2px) rotate(2.5deg); }
    70% { transform: translate(calc(var(--shake-amount, 1px) * -2), 1px) rotate(-2deg); }
    80% { transform: translate(calc(var(--shake-amount, 1px) * 2), -1px) rotate(2deg); }
    90% { transform: translate(calc(var(--shake-amount, 1px) * -1.5), 2px) rotate(-1.5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
}
.volume-mix-bg.shake {
    /* Shake amount increases with volume, max 64px at volume 100 */
    --shake-amount: calc(10px + 0.54px * max(0, min(100, var(--volume, 0))));
    animation: shake 0.38s cubic-bezier(.36,.07,.19,.97) both;
}
.volume-mix-bg {
    min-height: 100vh;
    min-width: 100vw;
    background-image: url('https://static.standard.co.uk/2022/11/17/00/5d8812c775adb8eeb2dd446c35362438Y29udGVudHNlYXJjaGFwaSwxNjY4NjkyODA5-2.66091700.jpg?width=1200');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0;
    margin: 0;
}
.volume-display {
    place-content: center;
    place-self: center;
    background: rgba(30, 30, 30, 0.7);
    border-radius: 18px;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.7), 0 0 0 8px #222a inset;
    padding: 2.5rem 2.5rem 2.5rem 2.5rem;
    max-width: 800px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    color: #fff;
    font-size: 2rem;
    text-align: center;
}
.volume-display svg {
    width: 100% !important;
    height: 220px !important;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 2px 8px #000a);
}

/* Metallic table style for knob-control-container */
.knob-control-container {
    position: relative;
    margin: 2rem auto 0 auto;
    width: 900px;
    height: 340px;
    background: linear-gradient(160deg, #e0e0e0 0%, #b0b0b0 60%, #888 100%);
    border-radius: 40px;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.7), 0 0 0 12px #bbb inset;
    border: 4px solid #888;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: visible;
}

/* Fake buttons on the table */
.knob-control-container::before,
.knob-control-container::after {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    background: radial-gradient(circle at 30% 30%, #fff 60%, #aaa 100%);
    border: 2px solid #888;
    border-radius: 50%;
    top: 24px;
    z-index: 2;
    box-shadow: 0 2px 8px #8888;
}
.knob-control-container::before {
    left: 32px;
}
.knob-control-container::after {
    right: 32px;
}

/* More fake buttons (bottom) */
.knob-control-container .fake-btn {
    position: absolute;
    width: 24px;
    height: 24px;
    background: radial-gradient(circle at 30% 30%, #fff 60%, #aaa 100%);
    border: 2px solid #888;
    border-radius: 50%;
    bottom: 24px;
    z-index: 2;
    box-shadow: 0 2px 8px #8888;
}
.knob-control-container .fake-btn.left {
    left: 55px;
}
.knob-control-container .fake-btn.right {
    right: 55px;
}

/* Arrange knobs in two rows */
.knob-control-container .knob-row {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: 40px;
}
.knob-control-container .knob-row.bottom {
    margin-top: 60px;
}

/* Make sure knob components are not stretched */
.knob-control-container ::v-deep .knob-control {
    margin: 0 12px;
}

button {
    margin: 0 8px;
    padding: 4px 12px;
}

.header-area {
    text-align: center;
    margin-bottom: 2.5rem;
    user-select: none;
}
.volume-title {
    font-family: 'Orbitron', 'Oswald', 'Arial Black', Arial, sans-serif;
    font-size: 3.2rem;
    letter-spacing: 0.08em;
    color: #fff;
    text-shadow:
        0 2px 12px #000a,
        0 1px 0 #42b983,
        0 0px 24px #42b98388;
    background: linear-gradient(90deg, #42b983 10%, #fff 40%, #42b983 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: brightness(1.15);
    display: inline-block;
    margin-bottom: 0.2em;
}
.off-label {
    font-size: 1.1em;
    font-weight: bold;
    color: #d9534f;
    background: #fff;
    border-radius: 0.3em;
    padding: 0.08em 0.4em;
    margin-left: 0.3em;
    box-shadow: 0 2px 8px #0003;
    letter-spacing: 0.12em;
    vertical-align: middle;
    text-shadow: none;
}
.subtitle {
    font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
    color: #e0e0e0;
    font-size: 1.25rem;
    margin-top: 0.5em;
    margin-bottom: 0.2em;
    text-shadow: 0 2px 8px #000a;
}
.subtitle-detail {
    font-size: 1rem;
    color: #b0ffdc;
    letter-spacing: 0.04em;
    display: block;
    margin-top: 0.3em;
    font-style: italic;
    text-shadow: 0 1px 6px #000a;
}
</style>