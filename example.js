document.addEventListener("DOMContentLoaded", function () {
    const tamilBtn = document.getElementById("tamilBtn");
    const englishBtn = document.getElementById("englishBtn");
    const btnRestart = document.getElementById("restartButton");
    const calculateButton = document.getElementById("calBtn");

    // Set the initial color of both buttons to white
    tamilBtn.style.backgroundColor = 'white';
    englishBtn.style.backgroundColor = 'white';

    // Add click event listener to tamilBtn
    tamilBtn.addEventListener("click", function () {
        setLanguage("tamil");
        tamilBtn.style.backgroundColor = 'green';
        englishBtn.style.backgroundColor = 'white';
    });

    // Add click event listener to englishBtn
    englishBtn.addEventListener("click", function () {
        setLanguage("english");
        englishBtn.style.backgroundColor = 'green';
        tamilBtn.style.backgroundColor = 'white';
    });

    function setLanguage(language) {
        const elements = document.querySelectorAll("[data-tamil], [data-english]");
        elements.forEach(element => {
            element.textContent = element.getAttribute(`data-${language}`);
        });
    }

    function calculateEMI(event) {
        event.preventDefault();

        let principal = parseFloat(document.getElementById("Principal").value) || 0;
        let paymentInAdvance = parseFloat(document.getElementById("paymentInAdvance").value) || 0;
        let interestRate = parseFloat(document.getElementById("InterestRate").value) || 0;
        let months = parseInt(document.getElementById("month").value) || 0;
        let currentYear = parseInt(document.getElementById("currentYear").value) || new Date().getFullYear();
        let tax = parseFloat(document.getElementById("tax").value) || 0;

        let radio1 = document.getElementById('radio1');
        let radio2 = document.getElementById('radio2');
        let radio3 = document.getElementById('radio3');
        let radio4 = document.getElementById('radio4');

        const today = new Date();
        let currentMonth = today.getMonth();

        function printMonthsAfter(startMonth = currentMonth, startYear = currentYear, durationMonths = months) {
            let month = startMonth;
            let year = startYear;
            const monthNames = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோம்பர்', 'நவம்பர்', 'டிசம்பர்'];
            const monthData = [];
            for (let i = 1; i <= durationMonths; i++) {
                const monthName = monthNames[month];
                monthData.push(`${monthName}, ${year}`);
                month++;
                if (month === 12) {
                    month = 0;
                    year++;
                }
            }
            return monthData;
        }

        const monthData = printMonthsAfter();
        let loanAmountCalculate = principal - paymentInAdvance;
        document.getElementById("loanAmount").textContent = loanAmountCalculate.toFixed(2);
        let advancePercentageCalculate = (paymentInAdvance * 100) / principal;
        document.getElementById("advance").textContent = advancePercentageCalculate.toFixed(2) + " % ";
        let monthlyInterestRate = interestRate / 12 / 100;

        let taxMonthly = tax / 12;
        document.getElementById("taxid").textContent = taxMonthly.toFixed(2);
        let totalTaxAmount = taxMonthly * months;
        document.getElementById("totalTax").textContent = totalTaxAmount.toFixed(2);

        let EMI = (loanAmountCalculate * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
            (Math.pow(1 + monthlyInterestRate, months) - 1);
        let monthTotalEMI = EMI + taxMonthly;

        function checkHomeLoan() {
            if ((radio1.checked && radio3.checked) || (radio2.checked && radio4.checked)) {
                document.getElementById("monthlyEmi").textContent = monthTotalEMI.toFixed(2);
            } else {
                document.getElementById("monthlyEmi").textContent = EMI.toFixed(2);
            }
        }

        checkHomeLoan();

        let remainingPrincipal = loanAmountCalculate;
        let totalInterestPaid = 0;
        let amortizationSchedule = [];
        let balanceArray = [];
        let principalArray = [];
        let interestArray = [];
        let taxArray = [];

        for (let month = 1; month <= months; month++) {
            const interestForMonth = remainingPrincipal * monthlyInterestRate;
            const principalForMonth = EMI - interestForMonth;
            totalInterestPaid += interestForMonth;
            remainingPrincipal -= principalForMonth;

            amortizationSchedule.push({
                month,
                principal: principalForMonth.toFixed(2),
                interest: interestForMonth.toFixed(2),
                balance: remainingPrincipal.toFixed(2)
            });

            balanceArray.push(remainingPrincipal.toFixed(2));
            interestArray.push(interestForMonth.toFixed(2));
            principalArray.push(principalForMonth.toFixed(2));
            taxArray.push(taxMonthly * month.toFixed(2));

            document.getElementById("totalInterest").textContent = totalInterestPaid.toFixed(2);
        }

        let annuval = monthTotalEMI * 12;
        document.getElementById("annuvaltotalemi").textContent = annuval.toFixed(2);

        let wholeEMI = monthTotalEMI * months;
        document.getElementById("totalofemi").textContent = wholeEMI.toFixed(2);

        if (typeof anychart !== 'undefined' && anychart.charts) {
            if (anychart.charts[0]) {
                anychart.charts[0].dispose();
            }
        }

        anychart.onDocumentReady(function () {
            let chart = anychart.cartesian();

            let data = [];
            for (let i = 0; i < months; i++) {
                data.push({
                    x: monthData[i],
                    tax: parseFloat(taxArray[i]),
                    interest: parseFloat(interestArray[i]),
                    principal: parseFloat(principalArray[i]),
                    balance: parseFloat(balanceArray[i])
                });
            }

            let dataSet = anychart.data.set(data);
            let taxData = dataSet.mapAs({ x: 'x', value: 'tax' });
            let interestData = dataSet.mapAs({ x: 'x', value: 'interest' });
            let principalData = dataSet.mapAs({ x: 'x', value: 'principal' });
            let balanceData = dataSet.mapAs({ x: 'x', value: 'balance' });

            chart.column(taxData).name('Taxes & Fees').color('#a8c0ff');
            chart.column(interestData).name('Interest').color('#668cff');
            chart.column(principalData).name('Principal').color('#002080');

            let balanceScale = anychart.scales.linear();
            let lineSeries = chart.line(balanceData);
            lineSeries.yScale(balanceScale);
            lineSeries.name('Balance').color('rgba(0, 0, 0, 1)').markers(true);

            chart.yScale().stackMode('value');

            let balanceAxis = chart.yAxis(1);
            balanceAxis.orientation('right');
            balanceAxis.scale(balanceScale);
            balanceAxis.title('Balance');

            chart.xAxis().title('Year');
            chart.xAxis().labels().rotation(-45);
            chart.xAxis().labels().padding([0, 5, 5, 5]);
            chart.xAxis().labels().format(function() {
                return monthData[this.index];
            });

            chart.yAxis().title('Payments');
            chart.yAxis().labels().format(function () {
                return this.value / 1000 + 'k';
            });

            chart.tooltip().format('{%seriesName}: ₹{%value}');

            chart.legend().enabled(true).position('top');

            chart.container('container');
            chart.draw();
        });
    }

    calculateButton.addEventListener('click', calculateEMI);

    btnRestart.addEventListener('click', function() {
        location.reload();
    });
});
