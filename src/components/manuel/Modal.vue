<template>
    <transition name="modal-fade">
        <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <header class="modal-header">
                    <h2 id="modalTitle">
                        <slot name="header">
                            Default Header
                        </slot>
                    </h2>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Close modal">
                        &times;
                    </button>
                </header>

                <section class="modal-body">
                    <slot name="body">
                        Default Body
                    </slot>
                </section>

                <footer class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn-green" @click="closeModal" aria-label="Close modal">
                            Close
                        </button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: stretch;
    padding: 20px;
    z-index: 10;
    /* Ensure it's on top of other content */
}

.modal-content {
    background: #fff;
    border-radius: 8px;
    overflow-x: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    /* Adjust as needed */
    width: 90%;
    height: 100%;
    max-height: 95vh;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header,
.modal-footer {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header {
    border-bottom: 1px solid #eee;
    color: #313131;
}

.modal-footer {
    border-top: 1px solid #eee;
    justify-content: flex-end;
}

.modal-body {
    position: relative;
    padding: 20px 0;
}

.btn-close {
    border: none;
    font-size: 20px;
    padding: 10px 15px;
    cursor: pointer;
    font-weight: bold;
    color: #4aae9b;
    background: transparent;
}

.btn-submit {
    color: #fff;
    background: #4aae9b;
    border: 1px solid #4aae9b;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
}

/* Modal Transition Styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>