
                let generatedOtp;  // Variable to store the generated OTP
                let otpExpiryTime; // Variable to store OTP expiry time in milliseconds
                let timerInterval; // Variable to store the timer interval
            
                (function() {
                  emailjs.init("TTsuokc3Hr20cYq5R"); // Replace 'YOUR_USER_ID' with your EmailJS user ID
                })();
            
                document.getElementById('otp-form').addEventListener('submit', function(event) {
                  event.preventDefault();
            
                  // Generate a random 6-digit OTP
                  generatedOtp = Math.floor(100000 + Math.random() * 900000);
            
                  // Set OTP expiry time (e.g., 5 minutes)
                  otpExpiryTime = Date.now() + 5 * 60 * 1000;
            
                  const email = document.getElementById('email').value;
            
                  const templateParams = {
                    to_email: email,
                    otp: generatedOtp
                  };
            
                  emailjs.send('service_tecruct', 'template_trmh1kg', templateParams)
                    .then(function(response) {
                      showAlert('OTP sent successfully!', 'success');
                      document.getElementById('otp-verification').style.display = 'block';  // Show the OTP verification section
                      startTimer(); // Start the countdown timer
                    }, function(error) {
                      showAlert('Failed to send OTP. Please try again.', 'danger');
                    });
                });
            
                document.getElementById('verify-btn').addEventListener('click', function() {
                  const enteredOtp = document.getElementById('otp-input').value;
            
                  // Check if the OTP has expired
                  if (Date.now() > otpExpiryTime) {
                    document.getElementById('verification-message').innerHTML = '<div class="alert alert-danger">OTP has expired. Please request a new one.</div>';
                  } else if (enteredOtp == generatedOtp) {
                    clearInterval(timerInterval); // Stop the timer on successful verification
                    document.getElementById('verification-message').innerHTML = '<div class="alert alert-success">OTP verified successfully!</div>';
                  } else {
                    document.getElementById('verification-message').innerHTML = '<div class="alert alert-danger">Invalid OTP. Please try again.</div>';
                  }
                });
            
                function startTimer() {
                  const timerElement = document.getElementById('timer');
            
                  timerInterval = setInterval(function() {
                    const timeLeft = otpExpiryTime - Date.now();
            
                    if (timeLeft <= 0) {
                      clearInterval(timerInterval);
                      timerElement.innerHTML = "Expired";
                    } else {
                      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                      timerElement.innerHTML = `${minutes}m ${seconds}s`;
                    }
                  }, 1000);
                }
            
                function showAlert(message, type) {
                  const alertModal = new bootstrap.Modal(document.getElementById('alertModal'), {});
                  const alertModalBody = document.getElementById('alertModalBody');
                  alertModalBody.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
                  alertModal.show();
                }
          