'use strict';

let calculateButton = document.getElementById("calBtn");
let monthlyEMI = document.getElementById("monthlyEmi");
let monthlyInterest = document.getElementById("monthlyInterest");
let loanAmount = document.getElementById("loanAmount");
let advancePercentage = document.getElementById("advance");
let totalInterest = document.getElementById("totalInterest");
let taxCalculate = document.getElementById("taxid");
let totalTax = document.getElementById("totalTax");
let AnnuvalTotalEmi = document.getElementById("annuvaltotalemi");
let TotalOfEmi = document.getElementById("totalofemi");

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
    loanAmount.textContent = loanAmountCalculate.toFixed(2);
    let advancePercentageCalculate = (paymentInAdvance * 100) / principal;
    advancePercentage.textContent = advancePercentageCalculate.toFixed(2) + " % ";
    let monthlyInterestRate = interestRate / 12 / 100;
    monthlyInterest.textContent = monthlyInterestRate.toFixed(5);

    let taxMonthly = tax / 12;
    taxCalculate.textContent = taxMonthly.toFixed(2);

    let totalTaxAmount = taxMonthly * months;
    totalTax.textContent = totalTaxAmount.toFixed(2);

    let EMI = (loanAmountCalculate * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
        (Math.pow(1 + monthlyInterestRate, months) - 1);

    let monthTotalEMI = EMI + taxMonthly;

    function checkHomeLoan() {
        if ((radio1.checked && radio3.checked) || (radio2.checked && radio4.checked)) {
            monthlyEMI.textContent = monthTotalEMI.toFixed(2);
        } else {
            monthlyEMI.textContent = EMI.toFixed(2);
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
        taxArray.push(taxMonthly.toFixed(2));

        totalInterest.textContent = totalInterestPaid.toFixed(2);
    }

    let annuval = monthTotalEMI * 12;
    AnnuvalTotalEmi.textContent = annuval.toFixed(2);

    let wholeEMI = monthTotalEMI * months;
    TotalOfEmi.textContent = wholeEMI.toFixed(2);

    anychart.onDocumentReady(function () {
        let chart = anychart.column();
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

        let lineSeries = chart.line(data.map(item => item.balance));
        lineSeries.name('கட்ட வேண்டிய தொகை (ரூ)').color('rgba(0, 0, 0, 1)').markers(true);

        let taxSeries = chart.column(data.map(item => item.tax));
        taxSeries.name('மாத வரி (ரூ)').color('#a8c0ff');

        let interestSeries = chart.column(data.map(item => item.interest));
        interestSeries.name('மாத வட்டி (ரூ)').color('#668cff');

        let principalSeries = chart.column(data.map(item => item.principal));
        principalSeries.name('அசல் (ரூ)').color('#002080');

        chart.yScale().stackMode('value');
        chart.xAxis().title('Months');
        chart.xAxis().labels().rotation(-45);
        chart.xAxis().labels().padding([1, 2, 3]);
        chart.xAxis().labels().format(function() {
            return monthData[this.index];
        });

        chart.yAxis().title('Payments (₹)');
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
