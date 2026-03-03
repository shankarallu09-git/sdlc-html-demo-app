// SMARTPAY-50 — Unit Tests (Node.js)
// Bug: Task input should reject blank/whitespace-only task submissions

function validateTaskInput(rawValue) {
  const text = rawValue.trim();
  if (!text) {
    return {
      valid: false,
      message: rawValue.length === 0
        ? 'Task cannot be empty.'
        : 'Task cannot be blank or whitespace only.'
    };
  }
  if (text.length > 200) {
    return { valid: false, message: 'Task is too long (max 200 characters).' };
  }
  return { valid: true, message: null, text };
}

let passed = 0, failed = 0;

function test(desc, fn) {
  try {
    fn();
    console.log('  PASS', desc);
    passed++;
  } catch (e) {
    console.log('  FAIL', desc, '-', e.message);
    failed++;
  }
}

function expect(val) {
  return {
    toBe: (exp) => {
      if (val !== exp) throw new Error(`Expected ${JSON.stringify(exp)}, got ${JSON.stringify(val)}`);
    },
    toContain: (s) => {
      if (!String(val).includes(s)) throw new Error(`"${val}" does not contain "${s}"`);
    },
  };
}

console.log('\n=== Suite 1: Blank/Empty Input Rejection ===');
test('empty string "" is invalid',            () => expect(validateTaskInput('').valid).toBe(false));
test('single space " " is invalid',           () => expect(validateTaskInput(' ').valid).toBe(false));
test('multiple spaces "   " is invalid',      () => expect(validateTaskInput('   ').valid).toBe(false));
test('tab "\\t" is invalid',                  () => expect(validateTaskInput('\t').valid).toBe(false));
test('newline "\\n" is invalid',              () => expect(validateTaskInput('\n').valid).toBe(false));
test('mixed whitespace is invalid',           () => expect(validateTaskInput(' \t \n ').valid).toBe(false));

console.log('\n=== Suite 2: Valid Input Acceptance ===');
test('normal text "Buy milk" is valid',       () => expect(validateTaskInput('Buy milk').valid).toBe(true));
test('trimmed text returns correct value',    () => expect(validateTaskInput('  Fix bug  ').text).toBe('Fix bug'));
test('single char "X" is valid',              () => expect(validateTaskInput('X').valid).toBe(true));
test('200-char text is valid (boundary)',      () => expect(validateTaskInput('A'.repeat(200)).valid).toBe(true));
test('null message on valid input',           () => expect(validateTaskInput('Task').message).toBe(null));

console.log('\n=== Suite 3: Max Length Enforcement ===');
test('201-char text is invalid',              () => expect(validateTaskInput('A'.repeat(201)).valid).toBe(false));
test('too-long message contains "200"',       () => expect(validateTaskInput('B'.repeat(250)).message).toContain('200'));

console.log('\n=== Suite 4: Error Message Differentiation ===');
test('empty input => "Task cannot be empty."',
  () => expect(validateTaskInput('').message).toBe('Task cannot be empty.'));
test('whitespace input => "Task cannot be blank or whitespace only."',
  () => expect(validateTaskInput('   ').message).toBe('Task cannot be blank or whitespace only.'));

console.log('\n========================================');
console.log(`PASSED : ${passed}`);
console.log(`FAILED : ${failed}`);
console.log(`TOTAL  : ${passed + failed}`);
console.log(failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
process.exit(failed > 0 ? 1 : 0);
