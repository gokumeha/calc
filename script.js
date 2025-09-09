const historyDisplay = document.getElementById('history-display');
const currentDisplay = document.getElementById('current-display');
const buttons = document.querySelectorAll('.calculator-button');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let firstOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;
let calculationHistory = [];

function formatNumber(num) {
    if (num.toString().length > 12) {
        return parseFloat(num).toExponential(6);
    }
    return num.toString();
}

// FIX: Correctly map operators to their symbols
function getOperatorSymbol(operator) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[operator] || operator;
}

function addToHistory(calculation, result) {
    calculationHistory.unshift({ calculation, result });
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.5); margin-top: 50px;">No calculations yet</div>';
        return;
    }
    historyList.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <div class="history-calculation">${item.calculation}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function calculate() {
    const prev = parseFloat(firstOperand);
    const current = parseFloat(currentDisplay.textContent);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (currentOperator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentDisplay.textContent = 'Error';
                historyDisplay.textContent = '';
                firstOperand = null;
                currentOperator = null;
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    const operatorSymbol = getOperatorSymbol(currentOperator);
    const calculationString = `${formatNumber(prev)} ${operatorSymbol} ${formatNumber(current)}`;
    const resultString = formatNumber(result);

    // FIX: Pass the calculation string to addToHistory, not the entire history array
    addToHistory(calculationString, resultString);

    currentDisplay.textContent = resultString;
    historyDisplay.textContent = `${calculationString}`;

    firstOperand = result.toString();
    currentOperator = null;
    shouldResetDisplay = true;
}

clearHistoryBtn.addEventListener('click', () => {
    calculationHistory = [];
    updateHistoryDisplay();
});

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const button = event.target;
        const number = button.dataset.number;
        const action = button.dataset.action;
        const operator = button.dataset.operator;

        if (number) {
            if (currentDisplay.textContent === '0' || shouldResetDisplay) {
                currentDisplay.textContent = number;
                shouldResetDisplay = false;
            } else {
                if (currentDisplay.textContent.length < 12) {
                    currentDisplay.textContent += number;
                }
            }
        } else if (action === 'decimal') {
            if (shouldResetDisplay) {
                currentDisplay.textContent = '0.';
                shouldResetDisplay = false;
            } else if (!currentDisplay.textContent.includes('.')) {
                currentDisplay.textContent += '.';
            }
        } else if (action === 'operator') {
            if (firstOperand === null) {
                firstOperand = currentDisplay.textContent;
            } else if (currentOperator && !shouldResetDisplay) {
                calculate();
                firstOperand = currentDisplay.textContent;
            }

            currentOperator = operator;
            const operatorSymbol = getOperatorSymbol(operator);
            historyDisplay.textContent = `${formatNumber(firstOperand)} ${operatorSymbol} `;
            shouldResetDisplay = true;

        } else if (action === 'equals') {
            if (firstOperand !== null && currentOperator !== null && !shouldResetDisplay) {
                calculate();
            }
        } else if (action === 'backspace') {
            if (currentDisplay.textContent !== 'Error') {
                if (currentDisplay.textContent.length > 1) {
                    currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
                } else {
                    currentDisplay.textContent = '0';
                }
            }
        } else if (action === 'clear') {
            firstOperand = null;
            currentOperator = null;
            shouldResetDisplay = false;
            currentDisplay.textContent = '0';
            historyDisplay.textContent = '';
        }
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        const numberButton = document.querySelector(`[data-number="${key}"]`);
        if (numberButton) numberButton.click();
    } else if (key === '.') {
        const decimalButton = document.querySelector('[data-action="decimal"]');
        if (decimalButton) decimalButton.click();
    } else if (['+', '-', '*', '/'].includes(key)) {
        const operatorButton = document.querySelector(`[data-operator="${key}"]`);
        if (operatorButton) operatorButton.click();
    } else if (key === 'Enter' || key === '=') {
        const equalsButton = document.querySelector('[data-action="equals"]');
        if (equalsButton) equalsButton.click();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        const clearButton = document.querySelector('[data-action="clear"]');
        if (clearButton) clearButton.click();
    } else if (key === 'Backspace') {
        const backspaceButton = document.querySelector('[data-action="backspace"]');
        if (backspaceButton) backspaceButton.click();
    }
});