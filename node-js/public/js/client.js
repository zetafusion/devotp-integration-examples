// Final client.js - with optional field verification
document.addEventListener('DOMContentLoaded', () => {
  // Get the site ID 
  const SITE_ID = '01JSDXTE94AKXHHVDVCPZDSJAX';
  
  // DOM Elements
  const emailInput = document.getElementById('email-input');
  const phoneInput = document.getElementById('phone-input');
  const emailSignature = document.getElementById('email-signature');
  const phoneSignature = document.getElementById('phone-signature');
  const submitBtn = document.getElementById('submit-btn');
  const otpForm = document.getElementById('otp-form');
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  
  // Initialize the SDK
  if (typeof devInit === 'function') {
      devInit(SITE_ID);
      console.log('OTP SDK initialized with site ID:', SITE_ID);
  } else {
      showStatus('SDK not loaded properly. Please check the console for errors.', 'error');
      console.error('devInit function not found. Make sure the SDK is loaded correctly.');
  }
  
  // Add event listener for verification success
  document.addEventListener('dev-otp-verified', handleVerificationSuccess);
  
  // Add event listener for the form submission
  otpForm.addEventListener('submit', handleFormSubmit);
  
  // Handle successful verification
  function handleVerificationSuccess(event) {
      console.log('Verification successful!', event.detail);
      
      // Extract verification signature from the event
      let verificationSignature = '';
      
      // Log the full event.detail to see its structure
      console.log('Full event detail:', JSON.stringify(event.detail, null, 2));
      
      // Check where the signature might be located in the event
      if (event.detail && event.detail.verification_signature) {
          verificationSignature = event.detail.verification_signature;
          console.log('Found signature in event.detail.verification_signature');
      } else if (event.detail && event.detail.signature) {
          verificationSignature = event.detail.signature;
          console.log('Found signature in event.detail.signature');
      } else if (typeof event.detail === 'string') {
          verificationSignature = event.detail;
          console.log('event.detail is a string, using it as signature');
      } else {
          console.log('Couldn\'t find signature in event');
          
          // For debugging only - you can see the whole event structure
          if (event.detail && typeof event.detail === 'object') {
              Object.keys(event.detail).forEach(key => {
                  console.log(`event.detail[${key}]:`, event.detail[key]);
              });
          }
          
          showStatus('No signature found in verification result', 'error');
          return;
      }
      
      // Determine which field was verified by checking which was most recently focused
      const activeElement = document.activeElement || document.querySelector(':focus');
      
      // Check if the active element or a parent of it has the data-devotp attribute
      let devotpElement = activeElement;
      while (devotpElement && !devotpElement.dataset?.devotp) {
          devotpElement = devotpElement.parentElement;
      }
      
      const devotpType = devotpElement?.dataset?.devotp;
      
      if (devotpType === 'email' || activeElement === emailInput || activeElement.id === 'email-input') {
          // Email was verified
          emailSignature.value = verificationSignature;
          showStatus('Email verified successfully!', 'success');
      } else if (devotpType === 'phone' || activeElement === phoneInput || activeElement.id === 'phone-input') {
          // Phone was verified
          phoneSignature.value = verificationSignature;
          showStatus('Phone verified successfully!', 'success');
      } else {
          // If we can't determine, let's try a last resort
          if (document.activeElement === emailInput || document.activeElement.id === 'email-input') {
              emailSignature.value = verificationSignature;
              showStatus('Email verified successfully!', 'success');
          } else if (document.activeElement === phoneInput || document.activeElement.id === 'phone-input') {
              phoneSignature.value = verificationSignature;
              showStatus('Phone verified successfully!', 'success');
          } else {
              // If all else fails, store based on most recent interaction
              const lastFocusedEmail = emailInput.dataset.lastFocused || 0;
              const lastFocusedPhone = phoneInput.dataset.lastFocused || 0;
              
              if (lastFocusedEmail > lastFocusedPhone) {
                  emailSignature.value = verificationSignature;
                  showStatus('Email verified successfully!', 'success');
              } else {
                  phoneSignature.value = verificationSignature;
                  showStatus('Phone verified successfully!', 'success');
              }
          }
      }
      
      // Show verification status
      updateVerificationStatus();
  }
  
  // Track focus events to help determine which field was last active
  emailInput.addEventListener('focus', function() {
      this.dataset.lastFocused = Date.now();
  });
  
  phoneInput.addEventListener('focus', function() {
      this.dataset.lastFocused = Date.now();
  });
  
  // Handle form submission
  function handleFormSubmit(event) {
      // Prevent default form submission
      event.preventDefault();
      
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const emailSig = emailSignature.value;
      const phoneSig = phoneSignature.value;
      
      // Make sure at least one field is filled
      if (!email && !phone) {
          showStatus('Please fill in at least one field (email or phone).', 'error');
          return false;
      }
      
      // Make sure filled fields are verified
      let validationPassed = true;
      let errorMessage = '';
      
      if (email && !emailSig) {
          validationPassed = false;
          errorMessage += 'Email must be verified. ';
      }
      
      if (phone && !phoneSig) {
          validationPassed = false;
          errorMessage += 'Phone number must be verified. ';
      }
      
      // Make sure at least one field is verified
      if (!emailSig && !phoneSig) {
          validationPassed = false;
          errorMessage = 'At least one field must be verified.';
      }
      
      if (!validationPassed) {
          showStatus(errorMessage.trim(), 'error');
          return false;
      }
      
      // Update button state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Prepare form data
      const formData = new FormData(otpForm);
      const formDataObj = Object.fromEntries(formData);
      
      // Log what's being sent
      console.log('Submitting form data:', formDataObj);
      
      // Send data to server
      fetch('/api/submit-form', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataObj),
      })
      .then(response => response.json())
      .then(result => {
          if (result.success) {
              showStatus('Form submitted successfully!', 'success');
              // Show the server response in the result div
              displayServerResponse(formDataObj, result);
          } else {
              showStatus('Form submission failed: ' + (result.message || 'Unknown error'), 'error');
              // Show the error response
              displayServerResponse(formDataObj, result, false);
          }
          
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
      })
      .catch(error => {
          console.error('Error submitting form:', error);
          showStatus('Error submitting form: ' + error.message, 'error');
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
      });
      
      return false;
  }
  
  // Update verification status display
  function updateVerificationStatus() {
      if (!resultDiv) return;
      
      resultDiv.classList.remove('hidden');
      
      const emailVerified = !!emailSignature.value;
      const phoneVerified = !!phoneSignature.value;
      
      let html = `
          <h3>Verification Status</h3>
          <div class="data-section">
              <div class="data-row">
                  <div class="data-label">Email:</div>
                  <div class="data-value ${emailVerified ? 'success-text' : 'error-text'}">
                      ${emailVerified ? '✅ Verified' : '❌ Not Verified'}
                  </div>
              </div>
              <div class="data-row">
                  <div class="data-label">Phone:</div>
                  <div class="data-value ${phoneVerified ? 'success-text' : 'error-text'}">
                      ${phoneVerified ? '✅ Verified' : '❌ Not Verified'}
                  </div>
              </div>
          </div>
      `;
      
      resultDiv.innerHTML = html;
  }
  
  // Display the server response in the result div
  function displayServerResponse(formData, serverResponse, isSuccess = true) {
      if (!resultDiv) return;
      
      resultDiv.classList.remove('hidden');
      
      let html = `
          <h3>Form Data</h3>
          <div class="data-section">
              <div class="data-row">
                  <div class="data-label">Email:</div>
                  <div class="data-value">${formData.email || '(not provided)'}</div>
              </div>
              <div class="data-row">
                  <div class="data-label">Phone:</div>
                  <div class="data-value">${formData.phone || '(not provided)'}</div>
              </div>
          </div>
          
          <h3>Form Status</h3>
          <div class="data-section">
              <div class="data-row">
                  <div class="data-label">Status:</div>
                  <div class="data-value ${isSuccess ? 'success-text' : 'error-text'}">
                      ${isSuccess ? '✅ Success' : '❌ Failed'}
                  </div>
              </div>
              ${serverResponse.message ? `
              <div class="data-row">
                  <div class="data-label">Message:</div>
                  <div class="data-value">${serverResponse.message}</div>
              </div>` : ''}
          </div>
      `;
      
      // Add verification status if available
      if (serverResponse.verifications) {
          html += `
              <h3>Verification Results</h3>
              <div class="data-section">
                  <div class="data-row">
                      <div class="data-label">Email Verified:</div>
                      <div class="data-value">${serverResponse.verifications.email ? '✅ Yes' : '❌ No'}</div>
                  </div>
                  <div class="data-row">
                      <div class="data-label">Phone Verified:</div>
                      <div class="data-value">${serverResponse.verifications.phone ? '✅ Yes' : '❌ No'}</div>
                  </div>
              </div>
          `;
      }
      
      // Add signature details in collapsible section
      html += `
          <details>
              <summary>Signature Details</summary>
              <div class="data-section">
                  ${formData.email_signature ? `
                  <div class="data-row">
                      <div class="data-label">Email Signature:</div>
                      <div class="data-value">
                          <textarea readonly class="signature-text">${formData.email_signature}</textarea>
                      </div>
                  </div>` : ''}
                  ${formData.phone_signature ? `
                  <div class="data-row">
                      <div class="data-label">Phone Signature:</div>
                      <div class="data-value">
                          <textarea readonly class="signature-text">${formData.phone_signature}</textarea>
                      </div>
                  </div>` : ''}
              </div>
          </details>
      `;
      
      // Add server response details in collapsible section
      html += `
          <details>
              <summary>Full Server Response</summary>
              <div class="data-section">
                  <pre class="json-response">${JSON.stringify(serverResponse, null, 2)}</pre>
              </div>
          </details>
      `;
      
      resultDiv.innerHTML = html;
  }
  
  // Show status message
  function showStatus(message, type = 'info') {
      statusDiv.className = `status-container ${type}`;
      statusDiv.textContent = message;
      
      // Automatically clear success messages after 5 seconds
      if (type === 'success') {
          setTimeout(() => {
              if (statusDiv.textContent === message) {
                  statusDiv.className = 'status-container';
                  statusDiv.textContent = '';
              }
          }, 5000);
      }
  }
});