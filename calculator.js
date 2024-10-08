class Outcome {
    constructor(name) {
        this.name = name;
        this.grades = [];
    }

    addGrade(grade) {
        this.grades.push(grade);
        this.renderGrades();
    }

    removeGrade(grade) {
        const index = this.grades.indexOf(grade);
        if (index > -1) {
            this.grades.splice(index, 1);
            this.renderGrades();
        }
    }

    calculateAverage() {
        if (this.grades.length <= 1) return 0;
        const sortedGrades = [...this.grades].sort((a, b) => a - b);
        sortedGrades.shift(); // Drop the lowest grade
        const sum = sortedGrades.reduce((acc, grade) => acc + grade, 0);
        return sum / sortedGrades.length;
    }

    renderGrades() {
        const outcomeElement = document.getElementById(this.name);
        if (outcomeElement) {
            outcomeElement.innerHTML = `
                <h3>${this.name}</h3>
                <ul>
                    ${this.grades.map(grade => `<li>${grade}</li>`).join('')}
                </ul>
                <div class="button-group">
                    <button class="icon-button" onclick="removeGrade('${this.name}')">
                        &#128465; Remove Last Grade
                    </button>
                    <button class="icon-button" onclick="addGrade('${this.name}')">
                        &#43; Add Grade
                    </button>
                    <button class="clear-remove" onclick="removeOutcome('${this.name}')">
                        &#10060; Remove Outcome
                    </button>
                </div>
            `;
        }
    }
}

const outcomes = [];

function addOutcome() {
    const name = document.getElementById('outcomeName').value.trim();
    if (name && !outcomes.some(outcome => outcome.name === name)) {
        const outcome = new Outcome(name);
        outcomes.push(outcome);
        renderOutcomeList();
        document.getElementById('outcomeName').value = '';
    } else {
        alert('Outcome name is required or already exists.');
    }
}

function renderOutcomeList() {
    const outcomeList = document.getElementById('outcomeList');
    if (outcomeList) {
        outcomeList.innerHTML = outcomes.map(outcome => `
            <div id="${outcome.name}" class="section">
                <h3>${outcome.name}</h3>
                <div class="button-group">
                    <button class="icon-button" onclick="addGrade('${outcome.name}')">
                        &#43; Add Grade
                    </button>
                    <button class="icon-button" onclick="removeGrade('${outcome.name}')">
                        &#128465; Remove Last Grade
                    </button>
                    <button class="clear-remove" onclick="removeOutcome('${outcome.name}')">
                        &#10060; Remove Entire Outcome
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function addGrade(outcomeName) {
    const grade = parseFloat(prompt('Enter grade:'));
    if (!isNaN(grade)) {
        const outcome = outcomes.find(outcome => outcome.name === outcomeName);
        if (outcome) {
            outcome.addGrade(grade);
        }
    }
}

function removeGrade(outcomeName) {
    const outcome = outcomes.find(outcome => outcome.name === outcomeName);
    if (outcome && outcome.grades.length > 0) {
        outcome.removeGrade(outcome.grades[outcome.grades.length - 1]);
    }
}

function removeOutcome(outcomeName) {
    const index = outcomes.findIndex(outcome => outcome.name === outcomeName);
    if (index > -1) {
        outcomes.splice(index, 1);
        renderOutcomeList();
    }
}

function calculateFinalGrade() {
    if (outcomes.length === 0) {
        document.getElementById('finalGrade').innerText = 'No outcomes available.';
        return;
    }

    const averages = outcomes.map(outcome => outcome.calculateAverage());
    const overallAverage = averages.reduce((acc, avg) => acc + avg, 0) / averages.length;
    const lowestOutcome = Math.min(...averages);

    let finalGrade = '';

    if (overallAverage >= 90 && lowestOutcome >= 85) {
        finalGrade = 'A';
    } else if (overallAverage >= 80 && lowestOutcome >= 75) {
        finalGrade = 'B';
    } else if (overallAverage >= 70 && lowestOutcome >= 65) {
        finalGrade = 'C';
    } else {
        finalGrade = 'D';
    }

    document.getElementById('finalGrade').innerText = `Final Grade: ${finalGrade}`;
}

function clearAllOutcomes() {
    outcomes.length = 0; // Clear the outcomes array
    renderOutcomeList();
    document.getElementById('finalGrade').innerText = '';
}
