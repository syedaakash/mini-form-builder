<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuestionsStore } from '../stores/useQuestionsStore';

const store = useQuestionsStore();
const { questions } = storeToRefs(store);

interface Answer {
  questionId: number;
  value: string | string[];
}

const answers = ref<Answer[]>([]);

const getAnswer = (questionId: number) => {
  return answers.value.find((a) => a.questionId === questionId);
};

const updateTextAnswer = (questionId: number, value: string) => {
  const existing = answers.value.find((a) => a.questionId === questionId);
  if (existing) {
    existing.value = value;
  } else {
    answers.value.push({ questionId, value });
  }
};

const updateRadioAnswer = (questionId: number, value: string) => {
  const existing = answers.value.find((a) => a.questionId === questionId);
  if (existing) {
    existing.value = value;
  } else {
    answers.value.push({ questionId, value });
  }
};

const updateCheckboxAnswer = (
  questionId: number,
  option: string,
  checked: boolean
) => {
  const existing = answers.value.find((a) => a.questionId === questionId);

  if (existing) {
    const values = Array.isArray(existing.value) ? existing.value : [];
    if (checked) {
      if (!values.includes(option)) {
        existing.value = [...values, option];
      }
    } else {
      existing.value = values.filter((v) => v !== option);
    }
  } else {
    answers.value.push({ questionId, value: checked ? [option] : [] });
  }
};

const isCheckboxChecked = (questionId: number, option: string) => {
  const answer = getAnswer(questionId);
  return answer && Array.isArray(answer.value) && answer.value.includes(option);
};

const getRadioValue = (questionId: number) => {
  const answer = getAnswer(questionId);
  return answer && typeof answer.value === 'string' ? answer.value : '';
};

const clearForm = () => {
  answers.value = [];
};

const submitForm = () => {
  console.log('Form submitted with answers:', answers.value);
  alert('Form submitted! Check console for answers.');
};

const formattedAnswers = computed(() => {
  return answers.value.map((answer) => {
    const question = questions.value.find((q) => q.id === answer.questionId);
    return {
      question: question?.label || 'Unknown',
      answer: Array.isArray(answer.value)
        ? answer.value.join(', ')
        : answer.value,
    };
  });
});
</script>

<template>
  <div class="form-preview">
    <div class="preview-header">
      <h2>📝 Form Preview</h2>
      <p class="subtitle">This is how your form will look to respondents</p>
    </div>

    <div v-if="questions.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p>No questions yet!</p>
      <p class="empty-hint">
        Add some questions using the builder to see them here.
      </p>
    </div>

    <div v-else class="form-content">
      <div class="form-questions">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="preview-question"
        >
          <label class="question-label">
            <span class="question-number">{{ index + 1 }}.</span>
            {{ question.label }}
          </label>

          <!-- Text Input -->
          <div v-if="question.type === 'text'" class="answer-section">
            <input
              type="text"
              :value="getAnswer(question.id)?.value || ''"
              @input="
                updateTextAnswer(
                  question.id,
                  ($event.target as HTMLInputElement).value
                )
              "
              placeholder="Your answer..."
              class="text-input"
            />
          </div>

          <!-- Radio Buttons -->
          <div v-else-if="question.type === 'radio'" class="answer-section">
            <label v-for="i in 3" :key="i" class="radio-label">
              <input
                type="radio"
                :name="`radio-${question.id}`"
                :value="`Option ${i}`"
                :checked="getRadioValue(question.id) === `Option ${i}`"
                @change="updateRadioAnswer(question.id, `Option ${i}`)"
              />
              <span>Option {{ i }}</span>
            </label>
          </div>

          <!-- Checkboxes -->
          <div v-else-if="question.type === 'checkbox'" class="answer-section">
            <label v-for="i in 3" :key="i" class="checkbox-label">
              <input
                type="checkbox"
                :checked="isCheckboxChecked(question.id, `Option ${i}`)"
                @change="
                  updateCheckboxAnswer(
                    question.id,
                    `Option ${i}`,
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <span>Option {{ i }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          @click="submitForm"
          class="btn-submit bg-green-500 hover:bg-green-600 text-white"
        >
          ✓ Submit Form
        </button>
        <button @click="clearForm" class="btn-clear">✕ Clear Answers</button>
      </div>

      <div v-if="formattedAnswers.length > 0" class="answers-summary">
        <h3>Current Answers:</h3>
        <div
          v-for="(item, idx) in formattedAnswers"
          :key="idx"
          class="answer-item"
        >
          <strong>{{ item.question }}:</strong>
          <span>{{ item.answer || '(not answered)' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-preview {
  background: white;
  min-height: 400px;
}

.preview-header {
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }

  .subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 0.875rem;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0.5rem 0;
    font-size: 1.125rem;
  }

  .empty-hint {
    font-size: 0.875rem;
    color: #9ca3af;
  }
}

.form-content {
  padding: 1.5rem;
}

.form-questions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.preview-question {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
}

.question-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;

  .question-number {
    color: #6366f1;
    margin-right: 0.5rem;
  }
}

.answer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: white;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  span {
    font-size: 0.9375rem;
    color: #374151;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.btn-submit,
.btn-clear {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit {
  //background: #10b981;
  //color: white;

  &:hover {
    //background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
}

.btn-clear {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
}

.answers-summary {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 1.25rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #1e40af;
  }

  .answer-item {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #dbeafe;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #1f2937;
      min-width: 150px;
    }

    span {
      color: #6b7280;
    }
  }
}
</style>
