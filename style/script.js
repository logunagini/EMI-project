document.addEventListener("DOMContentLoaded", function() {
    function setLanguage(language) {
      const elements = document.querySelectorAll('[data-tamil], [data-english]');
      elements.forEach((el) => {
        el.textContent = el.getAttribute(`data-${language}`);
      });
    }
  
    document.getElementById('english-option').addEventListener('click', () => setLanguage('english'));
    document.getElementById('tamil-option').addEventListener('click', () => setLanguage('tamil'));
  
    document.getElementById("calBtn").addEventListener("click", function(event) {
      event.preventDefault();
  
      let principal = parseFloat(document.getElementById("Principal").value) || 0;
      let paymentInAdvance = parseFloat(document.getElementById("paymentInAdvance").value) || 0;
      let interestRate = parseFloat(document.getElementById("InterestRate").value) || 0;
      let months = parseInt(document.getElementById("month").value) || 0;
      let tax = parseFloat(document.getElementById("tax").value) || 0;
  
      let loanAmountCalculate = principal - paymentInAdvance;
      document.getElementById("loanAmount").textContent = loanAmountCalculate.toFixed(2);
  
      let monthlyInterestRate = interestRate / 12 / 100;
      let EMI = (loanAmountCalculate * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                (Math.pow(1 + monthlyInterestRate, months) - 1);
  
      let taxMonthly = tax / 12;
      let monthTotalEMI = EMI + taxMonthly;
  
      document.getElementById("monthlyEmi").textContent = monthTotalEMI.toFixed(2);
    });
  });
  