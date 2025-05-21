// Standalone test script for signature validation
const { PayloadDecryptor } = require('user-verification-signature-decryptor');

async function testSignatureFormats() {
  // The client decryption key
  const clientDecryptionKey = 'a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa';
  
  // The email to verify
  const email = 'priyanka@invizid.com';
  
  // The signature from your screenshot (cleaned up)
  const signatureFromScreenshot = '6d448e2b5708a7deda76ae9c8029b684:8fea701ab6cf5b955d49eef8d987dd92e3e11ac6f1813cf19ded8bde3b95f93b635445c25cb3964ea786d55a81af01bf80d654b8e52ece8acbff627ed5ef16c9c72b62e2249ca471d541fb45b5f16ce7';
  
  // Alternative format - try without the colon part
  const signatureWithoutColon = '8fea701ab6cf5b955d49eef8d987dd92e3e11ac6f1813cf19ded8bde3b95f93b635445c25cb3964ea786d55a81af01bf80d654b8e52ece8acbff627ed5ef16c9c72b62e2249ca471d541fb45b5f16ce7';
  
  // The example signature you provided earlier
  const exampleSignature = '92d277ff72c54afb2186dc4855889ab1:5e2ead214023a4faab2eb912415bcb2494a45e8aafcb6244df86262186fd9d42cf9e1f0050071a885d1285141e766211b63d4dc964eafd755f8f63d983f7124bff6773170e8b530be741d14a4d9bfeb6';
  
  const decryptor = new PayloadDecryptor(clientDecryptionKey);
  
  console.log('Testing different signature formats:');
  console.log('---------------------------------');
  
  // Test the signature from the screenshot
  console.log('\nTesting signature from screenshot:');
  try {
    const result1 = await decryptor.validateDecryption(email, signatureFromScreenshot);
    console.log('Valid:', result1.isValid);
    if (result1.isValid) {
      console.log('Decrypted data:', result1.decryptedData);
    }
  } catch (error) {
    console.error('Error with screenshot signature:', error.message);
  }
  
  // Test without the colon part
  console.log('\nTesting without colon part:');
  try {
    const result2 = await decryptor.validateDecryption(email, signatureWithoutColon);
    console.log('Valid:', result2.isValid);
    if (result2.isValid) {
      console.log('Decrypted data:', result2.decryptedData);
    }
  } catch (error) {
    console.error('Error without colon part:', error.message);
  }
  
  // Test the example signature
  console.log('\nTesting example signature:');
  try {
    const result3 = await decryptor.validateDecryption(email, exampleSignature);
    console.log('Valid:', result3.isValid);
    if (result3.isValid) {
      console.log('Decrypted data:', result3.decryptedData);
    }
  } catch (error) {
    console.error('Error with example signature:', error.message);
  }
}

testSignatureFormats().catch(console.error);