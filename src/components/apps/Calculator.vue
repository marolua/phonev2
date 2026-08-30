<script setup>
import { computed, ref } from 'vue';

const display = ref('0');
const storedValue = ref(null);
const pendingOperator = ref(null);
const waitingForOperand = ref(false);
const expression = ref('');
const justEvaluated = ref(false);

const operatorLabels = {
    '/': '÷',
    '*': '×',
    '-': '−',
    '+': '+',
};

const clearLabel = computed(() => display.value === '0' && storedValue.value === null ? 'AC' : 'C');
const displayClass = computed(() => ({
    compact: display.value.length > 9,
    tiny: display.value.length > 13,
}));

const formatResult = (value) => {
    if (!Number.isFinite(value)) return 'Erreur';
    if (Math.abs(value) < 1e-12) return '0';

    const rounded = Number.parseFloat(value.toPrecision(12));
    return String(rounded);
};

const calculate = (left, right, operator) => {
    if (operator === '+') return left + right;
    if (operator === '-') return left - right;
    if (operator === '*') return left * right;
    if (operator === '/') return right === 0 ? Number.NaN : left / right;
    return right;
};

const resetCalculator = () => {
    display.value = '0';
    storedValue.value = null;
    pendingOperator.value = null;
    waitingForOperand.value = false;
    expression.value = '';
    justEvaluated.value = false;
};

const clearCurrentValue = () => {
    if (clearLabel.value === 'AC' || display.value === 'Erreur') {
        resetCalculator();
        return;
    }

    display.value = '0';
    waitingForOperand.value = false;
    justEvaluated.value = false;
};

const inputDigit = (digit) => {
    if (display.value === 'Erreur' || waitingForOperand.value || justEvaluated.value) {
        display.value = digit;
        waitingForOperand.value = false;
        justEvaluated.value = false;
        return;
    }

    if (display.value === '0') {
        display.value = digit;
    } else if (display.value.replace('-', '').replace('.', '').length < 15) {
        display.value += digit;
    }
};

const inputDecimal = () => {
    if (display.value === 'Erreur' || waitingForOperand.value || justEvaluated.value) {
        display.value = '0.';
        waitingForOperand.value = false;
        justEvaluated.value = false;
        return;
    }

    if (!display.value.includes('.')) display.value += '.';
};

const toggleSign = () => {
    if (display.value === '0' || display.value === 'Erreur') return;
    display.value = display.value.startsWith('-') ? display.value.slice(1) : `-${display.value}`;
};

const calculatePercent = () => {
    const value = Number(display.value);
    if (!Number.isFinite(value)) return;

    const percent = storedValue.value !== null && ['+', '-'].includes(pendingOperator.value)
        ? storedValue.value * value / 100
        : value / 100;
    display.value = formatResult(percent);
};

const chooseOperator = (operator) => {
    const inputValue = Number(display.value);
    if (!Number.isFinite(inputValue)) {
        resetCalculator();
        return;
    }

    if (pendingOperator.value && storedValue.value !== null && !waitingForOperand.value) {
        storedValue.value = calculate(storedValue.value, inputValue, pendingOperator.value);
        display.value = formatResult(storedValue.value);
    } else if (storedValue.value === null) {
        storedValue.value = inputValue;
    }

    pendingOperator.value = operator;
    waitingForOperand.value = true;
    justEvaluated.value = false;
    expression.value = `${display.value} ${operatorLabels[operator]}`;
};

const evaluate = () => {
    if (pendingOperator.value === null || storedValue.value === null) return;

    const result = calculate(storedValue.value, Number(display.value), pendingOperator.value);
    expression.value = `${storedValue.value} ${operatorLabels[pendingOperator.value]} ${display.value} =`;
    display.value = formatResult(result);
    storedValue.value = null;
    pendingOperator.value = null;
    waitingForOperand.value = true;
    justEvaluated.value = true;
};

const pressKey = (key) => {
    if (/^\d$/.test(key)) return inputDigit(key);
    if (key === '.') return inputDecimal();
    if (key === 'AC' || key === 'C') return clearCurrentValue();
    if (key === '±') return toggleSign();
    if (key === '%') return calculatePercent();
    if (key === '=') return evaluate();
    return chooseOperator(key);
};
</script>

<template>
    <div class="calculator-app">
        <div class="calculator-display" aria-live="polite">
            <span v-if="expression" class="calculator-expression">{{ expression }}</span>
            <span class="calculator-value" :class="displayClass">{{ display }}</span>
        </div>

        <div class="calculator-keypad">
            <button type="button" class="calculator-key calculator-key--function" @click="pressKey(clearLabel)">
                {{ clearLabel }}
            </button>
            <button type="button" class="calculator-key calculator-key--function" @click="pressKey('±')">±</button>
            <button type="button" class="calculator-key calculator-key--function" @click="pressKey('%')">%</button>
            <button type="button" class="calculator-key calculator-key--operator"
                :class="{ active: pendingOperator === '/' }" @click="pressKey('/')">÷</button>

            <button type="button" class="calculator-key" @click="pressKey('7')">7</button>
            <button type="button" class="calculator-key" @click="pressKey('8')">8</button>
            <button type="button" class="calculator-key" @click="pressKey('9')">9</button>
            <button type="button" class="calculator-key calculator-key--operator"
                :class="{ active: pendingOperator === '*' }" @click="pressKey('*')">×</button>

            <button type="button" class="calculator-key" @click="pressKey('4')">4</button>
            <button type="button" class="calculator-key" @click="pressKey('5')">5</button>
            <button type="button" class="calculator-key" @click="pressKey('6')">6</button>
            <button type="button" class="calculator-key calculator-key--operator"
                :class="{ active: pendingOperator === '-' }" @click="pressKey('-')">−</button>

            <button type="button" class="calculator-key" @click="pressKey('1')">1</button>
            <button type="button" class="calculator-key" @click="pressKey('2')">2</button>
            <button type="button" class="calculator-key" @click="pressKey('3')">3</button>
            <button type="button" class="calculator-key calculator-key--operator"
                :class="{ active: pendingOperator === '+' }" @click="pressKey('+')">+</button>

            <button type="button" class="calculator-key calculator-key--zero" @click="pressKey('0')">0</button>
            <button type="button" class="calculator-key" @click="pressKey('.')">.</button>
            <button type="button" class="calculator-key calculator-key--operator" @click="pressKey('=')">=</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.calculator-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15cqw 3cqh 8cqh;
    color: white;
    background: #000;
}

.calculator-display {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    padding: 0 2cqw 3cqh;
    box-sizing: border-box;
}

.calculator-expression {
    min-height: 2cqh;
    margin-bottom: 1cqh;
    color: rgba(255, 255, 255, 0.42);
    font-size: 1.65cqh;
}

.calculator-value {
    max-width: 100%;
    overflow: hidden;
    font-size: 9.4cqh;
    font-weight: 300;
    letter-spacing: -0.25cqw;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.calculator-value.compact {
    font-size: 7cqh;
}

.calculator-value.tiny {
    font-size: 5.7cqh;
}

.calculator-keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.2cqw;
    flex-shrink: 0;
}

.calculator-key {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    min-width: 0;
    border: 0;
    border-radius: 50%;
    padding: 0;
    color: white;
    background: #333333;
    font: inherit;
    font-size: 3.3cqh;
    font-weight: 500;
    cursor: pointer;
    transition: filter 0.12s ease, transform 0.12s ease, background 0.12s ease;
}

.calculator-key:hover {
    filter: brightness(1.25);
}

.calculator-key:active {
    transform: scale(0.93);
}

.calculator-key--function {
    color: #111;
    background: #a5a5a5;
}

.calculator-key--operator {
    color: white;
    background: #ff9500;
    font-size: 4cqh;
}

.calculator-key--operator.active {
    color: #ff9500;
    background: white;
}

.calculator-key--zero {
    grid-column: span 2;
    aspect-ratio: auto;
    justify-content: flex-start;
    border-radius: 20cqh;
    padding-left: 7cqw;
}
</style>
