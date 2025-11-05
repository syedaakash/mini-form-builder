<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuestionsStore } from '../stores/useQuestionsStore';
import QuestionItem from './QuestionItem.vue';

const store = useQuestionsStore();
const { questions } = storeToRefs(store);

function removeQuestion(id: number) {
  store.removeQuestion(id);
}
</script>
<template>
  <div class="question-list">
    <QuestionItem
      v-for="q in questions"
      :key="q.id"
      :question="q"
      @remove="removeQuestion"
    />
  </div>
</template>

<style scoped lang="scss">
.question-list {
  padding: 1rem;
}
</style>
