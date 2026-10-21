// frontend/scripts/validateQuizzes.js
// Standalone validator to verify quiz pool integrity, question validity, options diversity, and metadata standards.

import { QUIZ_DEFINITIONS, generateQuizInstance, generateQuestionPoolForLessons } from '../src/data/quizCatalog.js';

let errors = [];

console.log('🔍 Starting SignVerse Quiz Catalog & Data Integrity Validation...\n');

QUIZ_DEFINITIONS.forEach((quizDef) => {
  const sourceLessons = quizDef.sourceLessons();
  const pool = generateQuestionPoolForLessons(sourceLessons);
  
  // 1. Check pool size >= 2x quiz length
  const minPoolSize = quizDef.questionCount * 2;
  if (pool.length < minPoolSize) {
    errors.push(`[${quizDef.id}] Question pool size (${pool.length}) is less than 2x quiz length (${minPoolSize}).`);
  }

  // 2. Advanced quizzes must have at least 15 questions, standard must have at least 10
  if (quizDef.level === 'Advanced' && quizDef.questionCount < 15) {
    errors.push(`[${quizDef.id}] Advanced quiz must have at least 15 questions, but has ${quizDef.questionCount}.`);
  } else if (quizDef.questionCount < 10) {
    errors.push(`[${quizDef.id}] Quiz must have at least 10 questions, but has ${quizDef.questionCount}.`);
  }

  // 3. Test multiple instance generations for stability & duplicates
  for (let trial = 0; trial < 3; trial++) {
    const instance = generateQuizInstance(quizDef.id);
    if (!instance || !instance.questions || instance.questions.length !== quizDef.questionCount) {
      errors.push(`[${quizDef.id}] Trial ${trial + 1}: Generated instance question count mismatch.`);
      continue;
    }

    // Check no question duplicate in the same instance
    const seenIds = new Set();
    instance.questions.forEach((q, idx) => {
      if (seenIds.has(q.id)) {
        errors.push(`[${quizDef.id}] Duplicate question detected in same attempt: ${q.id}`);
      }
      seenIds.add(q.id);

      // Validate question structure
      if (!q.prompt || typeof q.prompt !== 'string') {
        errors.push(`[${quizDef.id}] Question ${idx} missing prompt string.`);
      }

      if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim() === '') {
        errors.push(`[${quizDef.id}] Question ${q.id} missing explanation.`);
      }

      // Check question types and option integrity
      if (q.type === 'sign_to_word' || q.type === 'order_steps' || q.type === 'build_sentence') {
        if (!Array.isArray(q.options) || q.options.length < 4) {
          errors.push(`[${quizDef.id}] Question ${q.id} has fewer than 4 options (${q.options?.length}).`);
        }
        const optTexts = q.options.map(o => (typeof o === 'string' ? o.toLowerCase().trim() : ''));
        const uniqueOpts = new Set(optTexts);
        if (uniqueOpts.size !== optTexts.length) {
          errors.push(`[${quizDef.id}] Question ${q.id} has identical/duplicate text options: ${JSON.stringify(q.options)}`);
        }
        if (!q.options.includes(q.correctAnswer)) {
          errors.push(`[${quizDef.id}] Question ${q.id} correctAnswer "${q.correctAnswer}" not found in options.`);
        }
      } else if (q.type === 'word_to_sign') {
        if (!Array.isArray(q.optionLessons) || q.optionLessons.length < 4) {
          errors.push(`[${quizDef.id}] Question ${q.id} has fewer than 4 optionLessons (${q.optionLessons?.length}).`);
        }
        const labels = (q.optionLessons || []).map(opt => opt.label);
        const uniqueLabels = new Set(labels);
        if (uniqueLabels.size !== labels.length) {
          errors.push(`[${quizDef.id}] Question ${q.id} has duplicate optionLessons.`);
        }
        if (!labels.includes(q.correctAnswer)) {
          errors.push(`[${quizDef.id}] Question ${q.id} correctAnswer "${q.correctAnswer}" not in optionLessons.`);
        }
      } else if (q.type === 'true_false') {
        if (!Array.isArray(q.options) || q.options.length !== 2) {
          errors.push(`[${quizDef.id}] True/False question ${q.id} must have exactly 2 options.`);
        }
        if (q.correctAnswer !== 'True' && q.correctAnswer !== 'False') {
          errors.push(`[${quizDef.id}] True/False question ${q.id} correctAnswer must be "True" or "False", got ${q.correctAnswer}`);
        }
      }
    });
  }

  console.log(`✅ [${quizDef.id}] Validated: ${quizDef.title} (${quizDef.level}) — Pool: ${pool.length}, Quiz: ${quizDef.questionCount}, Est: ${quizDef.estimatedTime}`);
});

console.log('\n----------------------------------------');
if (errors.length > 0) {
  console.error(`❌ Quiz Validation FAILED with ${errors.length} error(s):`);
  errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('🎉 All quiz definitions, pools, randomizer passes, and question formats VALIDATED SUCCESSFULLY!');
  process.exit(0);
}
