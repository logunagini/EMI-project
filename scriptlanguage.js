document.addEventListener("DOMContentLoaded", function () {
   
    const tamilBtn = document.getElementById("tamilBtn");
    const englishBtn = document.getElementById("englishBtn");
    const btnRestart = document.getElementById("restartButton");

    // Set the initial color of both buttons to white
    tamilBtn.style.backgroundColor = 'white';
    englishBtn.style.backgroundColor = 'white';
    btnRestart.style.backgroundColor = 'white';
    // Add click event listener to tamilBtn
    tamilBtn.addEventListener("click", function () {
        setLanguage("tamil");

        // Change tamilBtn's background color to green and englishBtn to white
        tamilBtn.style.backgroundColor = 'green';
        englishBtn.style.backgroundColor = 'white';
        btnRestart.style.backgroundColor = 'white';
    });

    // Add click event listener to englishBtn
    englishBtn.addEventListener("click", function () {
        setLanguage("english");

        // Change englishBtn's background color to green and tamilBtn to white
        englishBtn.style.backgroundColor = 'green';
        tamilBtn.style.backgroundColor = 'white';
        btnRestart.style.backgroundColor = 'white';
    });
    btnRestart.addEventListener("click", function () {
     

        btnRestart.style.backgroundColor = 'green';
        englishBtn.style.backgroundColor = 'white';
        tamilBtn.style.backgroundColor = 'white';
        
    });


    function setLanguage(language) {
      const elements = document.querySelectorAll("[data-tamil], [data-english]");
      elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${language}`);
      });
    }

  'use strict';

let calculateButton = document.getElementById("calBtn");
let monthlyEMI = document.getElementById("monthlyEmi");
// let monthlyInterest = document.getElementById("monthlyInterest");
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
    // monthlyInterest.textContent = monthlyInterestRate.toFixed(5);

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
        taxArray.push(taxMonthly*month.toFixed(2));

        totalInterest.textContent = totalInterestPaid.toFixed(2);
    }

    let annuval = monthTotalEMI * 12;
    AnnuvalTotalEmi.textContent = annuval.toFixed(2);

    let wholeEMI = monthTotalEMI * months;
    TotalOfEmi.textContent = wholeEMI.toFixed(2);
    
//     anychart.onDocumentReady(function () {
//       // Create a Cartesian chart
//       let chart = anychart.cartesian();
    
//       // Prepare the data
//       let data = [];
//       for (let i = 0; i < months; i++) {
//           data.push({
//               x: monthData[i],
//               tax: parseFloat(taxArray[i]),
//               interest: parseFloat(interestArray[i]),
//               principal: parseFloat(principalArray[i]),
//               balance: parseFloat(balanceArray[i])
//           });// Ensure that there are no multiple charts


anychart.onDocumentReady(function () {
    // Create a Cartesian chart
    let chart = anychart.cartesian();

    // Prepare the data
    let data = [];
    for (let i = 0; i < months; i++) {
        data.push({
            x: monthData[i],          // X-axis data (months)
            tax: parseFloat(taxArray[i]),           // Taxes & Fees data
            interest: parseFloat(interestArray[i]), // Interest data
            principal: parseFloat(principalArray[i]), // Principal data
            balance: parseFloat(balanceArray[i])    // Balance data
        });
    }

    // Create data sets
    let dataSet = anychart.data.set(data);
    let taxData = dataSet.mapAs({ x: 'x', value: 'tax' });
    let interestData = dataSet.mapAs({ x: 'x', value: 'interest' });
    let principalData = dataSet.mapAs({ x: 'x', value: 'principal' });
    let balanceData = dataSet.mapAs({ x: 'x', value: 'balance' });

    // Create column series for tax, interest, and principal data
    chart.column(taxData).name('Taxes & Fees').color('#a8c0ff');
    chart.column(interestData).name('Interest').color('#668cff');
    chart.column(principalData).name('Principal').color('#002080');

    // Create line series for balance data
    let balanceScale = anychart.scales.linear();
    let lineSeries = chart.line(balanceData);
    lineSeries.yScale(balanceScale);
    lineSeries.name('Balance').color('rgba(0, 0, 0, 1)').markers(true);

    // Configure the Y-axis to support stacking
    chart.yScale().stackMode('value');

    // Configure the secondary Y-axis for line series (balance)
    let balanceAxis = chart.yAxis(1);
    balanceAxis.orientation('right');
    balanceAxis.scale(balanceScale);
    balanceAxis.title('Balance');

    // Configure the X-axis
    chart.xAxis().title('Year');
    chart.xAxis().labels().rotation(-45);
    chart.xAxis().labels().padding([0, 5, 5, 5]);
    chart.xAxis().labels().format(function() {
        return monthData[this.index];
    });

    // Configure the primary Y-axis for stacked columns
    chart.yAxis().title('Payments');
    chart.yAxis().labels().format(function () {
        return this.value / 1000 + 'k';
    });

    // Configure the tooltip
    chart.tooltip().format('{%seriesName}: ₹{%value}');

    // Enable the legend
    chart.legend().enabled(true).position('top');

    // Set the container and draw the chart
    chart.container('container');
    chart.draw();
});

//       }
    
//       // Create data sets
//       let dataSet = anychart.data.set(data);
//       let taxData = dataSet.mapAs({ x: 'x', value: 'tax' });
//       let interestData = dataSet.mapAs({ x: 'x', value: 'interest' });
//       let principalData = dataSet.mapAs({ x: 'x', value: 'principal' });
//       let balanceData = dataSet.mapAs({ x: 'x', value: 'balance' });
    
//       // Create column series for tax, interest, and principal data
//       chart.column(taxData).name('மாத வரி (ரூ)').color('#a8c0ff');
//       chart.column(interestData).name('மாத வட்டி (ரூ)').color('#668cff');
//       chart.column(principalData).name('அசல் (ரூ)').color('#002080');
    
//       let balanceScale = anychart.scales.linear();
//       balanceScale.minimum(0); // Adjust if needed based on your data
//       balanceScale.maximum(principal); // Adjust this based on your balance data range
    
//       let balanceAxis = chart.yAxis(1);
//       balanceAxis.orientation('left');
//       balanceAxis.scale(balanceScale);
//       balanceAxis.title('கட்ட வேண்டிய தொகை (ரூ)');
    
//       let lineSeries = chart.spline(balanceData);
//       lineSeries.yScale(balanceScale);
//     //   lineSeries.name('கட்ட வேண்டிய தொகை (ரூ)').color('rgba(0, 0, 0, 1)').markers(true);
//       // lineSeries.spline(true); // Enable spline interpolation
    
//       // Configure the Y-axis to support stacking
//       chart.yScale().stackMode('value');
        
//       // Configure the X-axis
//       chart.xAxis().title('Months');
//       chart.xAxis().labels().rotation(-45);
//       chart.xAxis().labels().padding([0, 5, 5, 5]);
//       chart.xAxis().labels().format(function() {
//           return monthData[this.index];
//       });
    
//       // Configure the primary Y-axis for stacked columns
//       // chart.yAxis().title('Payments (₹)');
//       // chart.yAxis().labels().format(function () {
//       //     return this.value / 1000 + 'k';
//       // });
    
//       // Configure the secondary Y-axis for line series (balance)
      
    
//       // Configure the tooltip
//       chart.tooltip().format('{%seriesName}: ₹{%value}');
      
//       // Enable the legend
//       chart.legend().enabled(true).position('top');
    
//       // Set the container and draw the chart
//       chart.container('container');
//       chart.draw();
//   });


    if (typeof anychart !== 'undefined' && anychart.charts) {
        if (anychart.charts[0]) {
            anychart.charts[0].dispose();
        }
    }

}

    calculateButton.addEventListener('click', calculateEMI);

    btnRestart.addEventListener('click', function() {
        location.reload();
    });
});

