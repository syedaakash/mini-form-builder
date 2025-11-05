<script setup lang="ts">
import { ref } from 'vue';
import { useQuestionsStore, type Question } from '../stores/useQuestionsStore';

const props = defineProps<{ question: Question }>();
const emit = defineEmits<{ remove: [id: number] }>();

const store = useQuestionsStore();
const isEditing = ref(false);
const localLabel = ref(props.question.label);

const startEditing = () => {
  isEditing.value = true;
  localLabel.value = props.question.label;
};

const saveLabel = () => {
  if (localLabel.value.trim()) {
    store.updateLabel(props.question.id, localLabel.value.trim());
  }
  isEditing.value = false;
};

const cancelEditing = () => {
  localLabel.value = props.question.label;
  isEditing.value = false;
};

const changeType = (newType: Question['type']) => {
  store.updateQuestionType(props.question.id, newType);
};
</script>

<template>
  <div class="question-item">
    <div class="question-header">
      <div v-if="!isEditing" class="question-display" @click="startEditing">
        <h3 class="question-label">{{ question.label }}</h3>
        <span class="edit-hint">Click to edit</span>
      </div>

      <div v-else class="question-edit">
        <input
          v-model="localLabel"
          @keyup.enter="saveLabel"
          @keyup.esc="cancelEditing"
          class="question-input"
          autofocus
        />
        <div class="edit-actions">
          <button @click="saveLabel" class="btn-save">✓</button>
          <button @click="cancelEditing" class="btn-cancel">✕</button>
        </div>
      </div>

      <button
        class="remove-btn"
        @click="$emit('remove', question.id)"
        title="Delete question"
      >
        🗑️
      </button>
    </div>

    <div class="question-controls">
      <div class="type-selector">
        <label>Type:</label>
        <button
          v-for="type in ['text', 'checkbox', 'radio']"
          :key="type"
          @click="changeType(type as Question['type'])"
          :class="['type-btn', { active: question.type === type }]"
        >
          {{ type }}
        </button>
      </div>

      <div class="question-preview">
        <div v-if="question.type === 'text'" class="preview-item">
          <input type="text" placeholder="Text answer" disabled />
        </div>
        <div v-else-if="question.type === 'checkbox'" class="preview-item">
          <label><input type="checkbox" disabled /> Option 1</label>
          <label><input type="checkbox" disabled /> Option 2</label>
        </div>
        <div v-else-if="question.type === 'radio'" class="preview-item">
          <label><input type="radio" name="preview" disabled /> Option 1</label>
          <label><input type="radio" name="preview" disabled /> Option 2</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.question-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.question-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
}

.question-display {
  flex: 1;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  .question-label {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: #1f2937;
  }

  .edit-hint {
    font-size: 0.75rem;
    color: #9ca3af;
  }
}

.question-edit {
  flex: 1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.question-input {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.5rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #1d4ed8;
  }
}

.edit-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-save,
.btn-cancel {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save {
  background: #10b981;
  color: white;

  &:hover {
    background: #059669;
  }
}

.btn-cancel {
  background: #ef4444;
  color: white;

  &:hover {
    background: #dc2626;
  }
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #fee2e2;
  }
}

.question-controls {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.type-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }
}

.type-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  text-transform: capitalize;
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

.question-preview {
  background: #f9fafb;
  border-radius: 6px;
  padding: 1rem;

  .preview-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    input[type='text'] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      cursor: not-allowed;
    }
  }
}
</style>
