import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Question {
  id: number;
  label: string;
  type: 'text' | 'checkbox' | 'radio';
}

export const useQuestionsStore = defineStore('questions', () => {
  const STORAGE_KEY = 'mini-form-builder-questions';
  const loadFromStorage = (): Question[] => {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load from storage:', e);
      return [];
    }
  };

  const saveToStorage = (questions: Question[]) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  };

  const questions = ref<Question[]>(loadFromStorage());

  // Auto-save to localStorage whenever questions change
  watch(
    questions,
    (newQuestions) => {
      saveToStorage(newQuestions);
    },
    { deep: true }
  );

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: generateUniqueId(),
      label: 'Untitled Question',
      type,
    };
    questions.value.push(newQuestion);
  };

  const updateLabel = (id: number, newLabel: string) => {
    const question = questions.value.find((q) => q.id === id);
    if (question) {
      question.label = newLabel;
    }
  };

  const removeQuestion = (id: number) => {
    const index = questions.value.findIndex((q) => q.id === id);
    if (index !== -1) {
      questions.value.splice(index, 1);
    }
  };

  const updateQuestionType = (id: number, newType: Question['type']) => {
    const question = questions.value.find((q) => q.id === id);
    if (question) {
      question.type = newType;
    }
  };

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    const [removed] = questions.value.splice(fromIndex, 1);
    questions.value.splice(toIndex, 0, removed);
  };

  const clearAll = () => {
    questions.value = [];
  };

  return {
    questions,
    addQuestion,
    updateLabel,
    removeQuestion,
    updateQuestionType,
    reorderQuestions,
    clearAll,
  };
});

// --- Helper functions ---

function generateUniqueId(): number {
  return Date.now() + Math.random() * 1000;
}
