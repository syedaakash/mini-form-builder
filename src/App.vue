<template>
  <div class="app">
    <header class="app-header">
      <h1>📋 Mini Form Builder</h1>
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: currentView === 'builder' }]"
          @click="currentView = 'builder'"
        >
          🛠️ Builder
        </button>
        <button
          :class="['toggle-btn', { active: currentView === 'preview' }]"
          @click="currentView = 'preview'"
        >
          👁️ Preview
        </button>
        <button
          :class="['toggle-btn', { active: currentView === 'split' }]"
          @click="currentView = 'split'"
        >
          ⚡ Split View
        </button>
      </div>
    </header>

    <div :class="['content-wrapper', currentView]">
      <div v-if="currentView !== 'preview'" class="builder-section">
        <AddQuestionPanel />
        <QuestionList />
      </div>

      <div v-if="currentView !== 'builder'" class="preview-section">
        <FormPreview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddQuestionPanel from './components/AddQuestionPanel.vue';
import QuestionList from './components/QuestionList.vue';
import FormPreview from './components/FormPreview.vue';

const currentView = ref<'builder' | 'preview' | 'split'>('split');
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1rem;
}

.app-header {
  max-width: 1400px;
  margin: 0 auto 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 1rem 0;
    text-align: center;
    font-size: 1.75rem;
    color: #1f2937;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .toggle-btn {
    padding: 0.625rem 1.25rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      border-color: #2563eb;
      color: #2563eb;
    }

    &.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
  }
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;

  &.builder {
    grid-template-columns: 1fr;
  }

  &.preview {
    grid-template-columns: 1fr;
  }

  &.split {
    grid-template-columns: 1fr 1fr;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
}

.builder-section,
.preview-section {
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 400px;
}
</style>
