import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useQuestionsStore } from './useQuestionsStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('useQuestionsStore', () => {
  it('adds a question', () => {
    const store = useQuestionsStore();
    store.addQuestion('text');
    expect(store.questions.length).toBe(1);
  });

  it('updates a label', () => {
    const store = useQuestionsStore();
    store.addQuestion('text');
    const id = store.questions[0]?.id;
    if (id) store.updateLabel(id, 'New label');
    expect(store.questions[0]?.label).toBe('New label');
  });

  it('removes a question', () => {
    const store = useQuestionsStore();
    store.addQuestion('text');
    const id = store.questions[0]?.id;
    if (id) store.removeQuestion(id);
    expect(store.questions.length).toBe(0);
  });
});
