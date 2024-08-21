document.addEventListener('DOMContentLoaded', () => {

    // Change input color when checked 
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach((inputGroup) => {
        let input = inputGroup.querySelector('input[type="text"]');
        input.addEventListener('focus', () => {
            inputGroup.classList.add('active')
        });
        input.addEventListener('focusout', () => {
            inputGroup.classList.remove('active')
        });
    });

    // Change radio label color when checked
    const radioLabels = document.querySelectorAll('label.radio');
    labelChangeColorCallback(radioLabels);
    radioLabels.forEach((label) => {
        let input = label.querySelector('input[type="radio"]');
        input.addEventListener('change', () => labelChangeColorCallback(radioLabels));
    });

    // Clear all fields button
    const clearAllButton = document.querySelector('[data-action="clear-all"]');
    clearAllButton.addEventListener('click', () => {
        inputGroups.forEach((inputGroup) => {
            // Clear input 
            let input = inputGroup.querySelector('input[type="text"]');
            input.value = '';

            //clear errors
            document.querySelector('.input-1 .input-group').classList.remove('error');
            document.querySelector('.input-2 .input-group').classList.remove('error');
            document.querySelector('.input-3 .input-group').classList.remove('error');

            document.querySelector('[data-error="mortgage-amount"]').textContent = '';
            document.querySelector('[data-error="mortgage-term"]').textContent = '';
            document.querySelector('[data-error="interest-rate"]').textContent = '';

            // hide results
            const completedResultsElem = document.querySelector('.results-container .completed-results');
            const emptyResultsElem = document.querySelector('.results-container .empty-results');
            showElementAnimation(emptyResultsElem);
            hideElementAnimation(completedResultsElem);
        });
    });

    // Input formatting
    document.querySelector('#mortgage-term-input').addEventListener('input', (event) => {
        const input = event.target;
        formatNumberInput(input);
    });
    document.querySelector('#interest-rate-input').addEventListener('input', (event) => {
        const input = event.target;
        formatNumberInput(input);
    });

    document.querySelector('#mortgage-amount-input').addEventListener('input', (event) => {
        const input = event.target;
        const originalCursorPosition = input.selectionStart;
        const originalInputLength = input.value.length;
        formatMoneyInput(event.target);
        const newInputLength = input.value.length;
        const newCursorPosition = originalCursorPosition + (newInputLength - originalInputLength);
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    });
    // Cursor placement on left and right movements
    document.querySelector('#mortgage-amount-input').addEventListener('keydown', (event) => {
        const input = event.target;
        const currentCursorPosition = input.selectionStart;
        const valueLength = input.value.length
        if (event.key === 'ArrowLeft' && currentCursorPosition > 0) {
            if (input.value[currentCursorPosition - 2] === ',') {
                input.setSelectionRange(currentCursorPosition - 1, currentCursorPosition - 1);
            }
        }
        if (event.key === 'ArrowRight' && currentCursorPosition < valueLength) {
            if (input.value[currentCursorPosition] === ',') {
                input.setSelectionRange(currentCursorPosition + 1, currentCursorPosition + 1);
            }
        }
    });

    document.querySelector('#mortgage-amount-input').addEventListener('click', (event) => {
        const input = event.target;
        const currentCursorPosition = input.selectionStart;
        if (input.value[currentCursorPosition - 1] === ',') {
            input.setSelectionRange(currentCursorPosition - 1, currentCursorPosition - 1);
        }
    });
});

function labelChangeColorCallback(radioLabels) {
    radioLabels.forEach((label) => {
        let input = label.querySelector('input[type="radio"]');
        if (input.checked) {
            label.classList.add('checked')
        } else {
            label.classList.remove('checked')
        }
    })
}

function formatMoneyInput(input) {
    const value = input.value.replace(/[^0-9]/g, '');
    const formattedValue = Number(value).toLocaleString('en-GB');
    input.value = formattedValue;
}

function formatNumberInput(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
}

function calculateMortgage(mortgageAmount, mortgageTerm, interestRate, mortgageType) {
    const principal = parseFloat(mortgageAmount);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;

    let monthlyPayment;
    let totalPayment;

    if (mortgageType === 'repayment') {
        monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        totalPayment = monthlyPayment * numberOfPayments;
    } else if (mortgageType === 'interest-only') {
        monthlyPayment = principal * monthlyInterestRate;
        totalPayment = monthlyPayment * numberOfPayments + principal; // Principal is still owed at the end
    } else {
        throw new Error("Invalid mortgage type. Choose 'repayment' or 'interest-only'.");
    }

    return {
        monthlyPayment: monthlyPayment.toFixed(2), // Rounded to two decimal places
        totalPayment: totalPayment.toFixed(2) // Rounded to two decimal places
    };
}

function formatMoneyToNumber(value) {
    return Number(value.replace(/[^0-9.]/g, ''));
}

function hideElementAnimation(element) {
    element.classList.add("hide")
    setTimeout(() => {
        element.classList.add("hidden")
    }, 1000);
    setTimeout(() => {
        element.classList.remove("hide")
    }, 3000)
}

function showElementAnimation(element) {
    element.classList.add("show")
    setTimeout(() => {
        element.classList.remove("hidden")
    }, 1000);
    setTimeout(() => {
        element.classList.remove("show")
    }, 3000)
}

function checkForm(event) {
    let isValid = true;
    // get the contents of the form
    let mortgageAmount = document.querySelector('#mortgage-amount-input').value;
    let mortgageTerm = document.querySelector('#mortgage-term-input').value;
    let interestRate = document.querySelector('#interest-rate-input').value;
    let mortgageType = document.querySelector('input[name="mortgage-type"]:checked').value;


    if (mortgageAmount === '') {
        document.querySelector('.input-1 .input-group').classList.add('error');
        document.querySelector('[data-error="mortgage-amount"]').textContent = 'Please enter a value';
        event.preventDefault();
        isValid = false;
    } else if (isNaN(formatMoneyToNumber(mortgageAmount))) {
        document.querySelector('.input-1 .input-group').classList.add('error');
        document.querySelector('[data-error="mortgage-amount"]').textContent = 'Please enter a number';
        event.preventDefault();
        isValid = false;
    }

    if (mortgageTerm === '') {
        document.querySelector('.input-2 .input-group').classList.add('error');
        document.querySelector('[data-error="mortgage-term"]').textContent = 'Please enter a value';
        event.preventDefault();
        isValid = false;
    } else if (isNaN(mortgageTerm)) {
        document.querySelector('.input-2 .input-group').classList.add('error');
        document.querySelector('[data-error="mortgage-term"]').textContent = 'Please enter a number';
        event.preventDefault();
        isValid = false;
    }

    if (interestRate === '') {
        document.querySelector('.input-3 .input-group').classList.add('error');
        document.querySelector('[data-error="interest-rate"]').textContent = 'Please enter a value';
        event.preventDefault();
        isValid = false;
    } else if (isNaN(interestRate)) {
        document.querySelector('.input-3 .input-group').classList.add('error');
        document.querySelector('[data-error="interest-rate"]').textContent = 'Please enter a number';
        event.preventDefault();
        isValid = false;
    }

    if (isValid) {
        document.querySelector('.input-1 .input-group').classList.remove('error');
        document.querySelector('.input-2 .input-group').classList.remove('error');
        document.querySelector('.input-3 .input-group').classList.remove('error');

        document.querySelector('[data-error="mortgage-amount"]').textContent = '';
        document.querySelector('[data-error="mortgage-term"]').textContent = '';
        document.querySelector('[data-error="interest-rate"]').textContent = '';

        let { monthlyPayment, totalPayment } = calculateMortgage(formatMoneyToNumber(mortgageAmount), mortgageTerm, interestRate, mortgageType);
        monthlyPayment = Number(monthlyPayment).toLocaleString('en-GB')
        totalPayment = Number(totalPayment).toLocaleString('en-GB')

        // replace results
        document.querySelector('.results-card .monthly-result').textContent = monthlyPayment;
        document.querySelector('.results-card .total-result').textContent = totalPayment;

        // show results div
        const completedResultsElem = document.querySelector('.results-container .completed-results');
        const emptyResultsElem = document.querySelector('.results-container .empty-results');
        showElementAnimation(completedResultsElem);
        hideElementAnimation(emptyResultsElem);
    }
    return false;
}

// make the checkForm function global
window.checkForm = checkForm