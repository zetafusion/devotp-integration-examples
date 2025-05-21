// Interactive decrypt-signature.js with improved error handling
const readline = require('readline');
const { PayloadDecryptor } = require('user-verification-signature-decryptor');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function decryptSignature(email, signature) {
  try {
    console.log('\nAttempting to decrypt signature...');
    
    // Hardcoded client decryption key
    const clientDecryptionKey = 'a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa';
    
    // Create decryptor instance
    const decryptor = new PayloadDecryptor(clientDecryptionKey);
    
    // Clean the signature - trim spaces and remove quotes
    const cleanSignature = signature.trim().replace(/^["']|["']$/g, '');
    
    console.log('Using client key:', clientDecryptionKey.substring(0, 10) + '...');
    console.log('Using signature:', cleanSignature.substring(0, 20) + '...');
    
    // Wait for the Promise to resolve
    const result = await decryptor.validateDecryption(email, cleanSignature);
    
    console.log('\nDecryption Results:');
    console.log('-------------------');
    console.log('Validation successful:', result.isValid);
    
    if (result.isValid) {
      console.log('Decrypted data:', result.decryptedData);
    } else {
      console.log('Validation failed. The signature may be invalid or tampered with.');
    }
    
    return result;
  } catch (error) {
    console.error('\nError during decryption:', error.message);
    
    // Try with the working example as a fallback
    console.log('\nTrying with known working example as fallback...');
    const workingSignature = '92d277ff72c54afb2186dc4855889ab1:5e2ead214023a4faab2eb912415bcb2494a45e8aafcb6244df86262186fd9d42cf9e1f0050071a885d1285141e766211b63d4dc964eafd755f8f63d983f7124bff6773170e8b530be741d14a4d9bfeb6';
    
    try {
      const clientDecryptionKey = 'a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa';
      const decryptor = new PayloadDecryptor(clientDecryptionKey);
      const fallbackResult = await decryptor.validateDecryption(email, workingSignature);
      
      console.log('\nFallback Decryption Results:');
      console.log('----------------------------');
      console.log('Fallback validation successful:', fallbackResult.isValid);
      
      if (fallbackResult.isValid) {
        console.log('Fallback decrypted data:', fallbackResult.decryptedData);
        console.log('\nNOTE: Your signature failed but the example worked. This suggests a site ID or key mismatch.');
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError.message);
    }
    
    return { isValid: false, error: error.message };
  }
}

// Main function to run the decryption utility
async function runDecryptionUtility() {
  console.log('OTP Signature Decryption Utility');
  console.log('================================\n');
  
  // You can hard-code values for testing
  const hardcodedEmail = ''; // e.g. 'priyanka@invizid.com'
  const hardcodedSignature = ''; // Leave empty to use interactive mode
  
  if (hardcodedEmail && hardcodedSignature) {
    // Use hardcoded values
    console.log('Using hardcoded values:');
    console.log('Email:', hardcodedEmail);
    console.log('Signature:', hardcodedSignature.substring(0, 20) + '...');
    
    await decryptSignature(hardcodedEmail, hardcodedSignature);
    rl.close();
  } else {
    // Get values from user input
    rl.question('Enter the email: ', async (email) => {
      rl.question('Enter the verification signature: ', async (signature) => {
        await decryptSignature(email, signature);
        rl.close();
      });
    });
  }
}

// Run the utility with proper error handling
runDecryptionUtility().catch(error => {
  console.error('Unexpected error:', error);
  rl.close();
});