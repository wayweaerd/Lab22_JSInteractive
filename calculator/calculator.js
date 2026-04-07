export class Calculator {
    constructor(displayElement) {
        this.display = displayElement;
        this.expression = '';
        this.hasError = false;
        this.buttons = [];
    }

    init() {
        this.buttons = Array.from(document.querySelectorAll('.buttons button'));
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e.target.textContent));
        });
    }

    handleButtonClick(value) {
        if (this.hasError && value !== 'C') {
            this.clear();
        }

        if (value === 'C') {
            this.clear();
        } else if (value === '=') {
            this.calculate();
        } else {
            this.addToExpression(value);
        }
    }

    addToExpression(value) {
        if (this.expression === '' && this.isOperator(value) && value !== '-') return;
        if (this.isLastCharOperator() && this.isOperator(value)) return;
        if (value === '.' && this.hasDuplicateDot()) return;

        this.expression += value;
        this.updateDisplay();
    }

    calculate() {
        if (!this.isValidExpression()) {
            this.showError();
            return;
        }

        try {
            const result = this.safeEvaluate(this.expression);
            if (!isFinite(result)) {
                this.showError();
            } else {
                this.expression = String(result);
                this.updateDisplay();
                this.hasError = false;
            }
        } catch (error) {
            this.showError();
        }
    }
    safeEvaluate(expr) {
        if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
            throw new Error('Invalid characters in expression');
        }
        return eval(expr);
    }
    isValidExpression() {
        if (this.expression.trim() === '') return false;
        const lastChar = this.expression.slice(-1);
        if (this.isOperator(lastChar)) return false; 
        return true;
    }

    clear() {
        this.expression = '';
        this.hasError = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.expression === '' ? '0' : this.expression;
    }

    showError() {
        this.display.value = 'Ошибка';
        this.hasError = true;
    }

    isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }

    isLastCharOperator() {
        return this.expression.length > 0 && this.isOperator(this.expression.slice(-1));
    }

    hasDuplicateDot() {
        const parts = this.expression.split(/[+\-*/]/);
        const currentNumber = parts[parts.length - 1];
        return currentNumber.includes('.');
    }
}