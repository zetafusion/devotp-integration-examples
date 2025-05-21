const express = require('express');
const path = require('path');
const { PayloadDecryptor } = require('user-verification-signature-decryptor');

const app = express();
const PORT = 3000;

// Enable JSON parsing for request bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle form submission with validation
app.post('/api/submit-form', async (req, res) => {
  try {
    const { 
      email, 
      phone, 
      email_signature: emailSignature, 
      phone_signature: phoneSignature 
    } = req.body;
    
    // Basic validation - require at least one field
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'At least one identifier (email or phone) is required'
      });
    }
    
    // Check if at least one signature is present
    if (!emailSignature && !phoneSignature) {
      return res.status(400).json({
        success: false,
        message: 'At least one verification signature is required'
      });
    }
    
    // The client decryption key
    const clientDecryptionKey = 'a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa';
    
    // Validate signatures
    let emailVerified = false;
    let phoneVerified = false;
    let emailDecryptedData = null;
    let phoneDecryptedData = null;
    
    // Validate email signature if present and email is provided
    if (emailSignature && email) {
      try {
        const cleanEmailSignature = emailSignature.trim().replace(/^["']|["']$/g, '');
        
        // First decrypt to check what the signature contains
        const decryptedData = await decryptPayload(clientDecryptionKey, cleanEmailSignature);
        emailDecryptedData = decryptedData;
        
        // Check if the identifier in the signature matches the email
        if (decryptedData.identifier === email) {
          emailVerified = true;
          console.log('Email verification successful');
        } else if (phone && (decryptedData.identifier === phone || normalizePhone(decryptedData.identifier) === normalizePhone(phone))) {
          // This is actually a phone verification signature stored in the email field
          phoneVerified = true;
          phoneDecryptedData = decryptedData;
          console.log('Phone verification stored in email field');
        }
      } catch (error) {
        console.error('Error validating email signature:', error.message);
      }
    }
    
    // Validate phone signature if present and phone is provided
    if (phoneSignature && phone && !phoneVerified) {
      try {
        const cleanPhoneSignature = phoneSignature.trim().replace(/^["']|["']$/g, '');
        
        // First decrypt to check what the signature contains
        const decryptedData = await decryptPayload(clientDecryptionKey, cleanPhoneSignature);
        phoneDecryptedData = decryptedData;
        
        // Check if the identifier in the signature matches the phone
        if (decryptedData.identifier === phone || normalizePhone(decryptedData.identifier) === normalizePhone(phone)) {
          phoneVerified = true;
          console.log('Phone verification successful');
        } else if (email && decryptedData.identifier === email && !emailVerified) {
          // This is actually an email verification signature stored in the phone field
          emailVerified = true;
          emailDecryptedData = decryptedData;
          console.log('Email verification stored in phone field');
        }
      } catch (error) {
        console.error('Error validating phone signature:', error.message);
      }
    }
    
    // Validation rules for optional fields:
    // 1. If a field is provided, it must be verified
    // 2. At least one field must be verified
    
    let validationPassed = true;
    let failureMessage = '';
    
    // Check if provided fields are verified
    if (email && !emailVerified) {
      validationPassed = false;
      failureMessage += 'Email could not be verified. ';
    }
    
    if (phone && !phoneVerified) {
      validationPassed = false;
      failureMessage += 'Phone number could not be verified. ';
    }
    
    // Ensure at least one field is verified
    if (!emailVerified && !phoneVerified) {
      validationPassed = false;
      failureMessage += 'No valid verification found. ';
    }
    
    if (!validationPassed) {
      return res.status(400).json({
        success: false,
        message: failureMessage.trim(),
        verifications: {
          email: emailVerified,
          phone: phoneVerified
        }
      });
    }
    
    // Form submission is valid, process it
    console.log('Form submission validated successfully');
    console.log('Email verified:', emailVerified);
    console.log('Phone verified:', phoneVerified);
    
    // Here you would typically save the data to your database
    
    // Return success response
    res.json({
      success: true,
      message: 'Form submitted successfully',
      verifications: {
        email: emailVerified,
        phone: phoneVerified
      },
      data: {
        id: generateId(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Helper function to decrypt payload without validation
async function decryptPayload(clientKey, encryptedData) {
  const crypto = require('crypto');
  
  // Split the IV and encrypted data
  const [ivHex, encryptedPayload] = encryptedData.split(':');

  if (!ivHex || !encryptedPayload) {
    throw new Error('Invalid encrypted data format');
  }

  // Convert IV and key to Buffer
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(clientKey, 'hex');

  try {
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the payload
    let decrypted = decipher.update(encryptedPayload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Parse the JSON string back to an object
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt payload: ' + error.message);
  }
}

// Helper function to normalize phone numbers for comparison
function normalizePhone(phoneNumber) {
  if (!phoneNumber) return '';
  // Remove all non-digit characters
  return phoneNumber.toString().replace(/\D/g, '');
}

// Helper function to generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`To test the OTP verification, open this URL in your browser`);
});