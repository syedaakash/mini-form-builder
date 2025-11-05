<script setup lang="ts">
import { useQuestionsStore } from '../stores/useQuestionsStore';
const { addQuestion } = useQuestionsStore();

export type BtnSize = 'sm' | 'lg';
const { size } = defineProps<{ size: BtnSize }>();

const add = (type: 'text' | 'checkbox' | 'radio') => {
  addQuestion(type);
};
</script>

<template>
  <div class="add-question-panel flex p-4 justify-end">
    <button
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      :class="size === 'sm' ? '' : 'flex-1'"
      @click="add('text')"
    >
      ➕ Question
    </button>
  </div>
</template>

<style scoped lang="scss">
//.add-question-panel {
//  display: flex;
//  gap: 1rem;
//  padding: 1rem;
//  border-bottom: 1px solid #ddd;
//
//  button {
//    background: #2563eb;
//    color: white;
//    border: none;
//    border-radius: 8px;
//    padding: 0.5rem 1rem;
//    cursor: pointer;
//
//    &:hover {
//      background: #1d4ed8;
//    }
//  }
//}
</style>
