const { PayloadDecryptor } = require('user-verification-signature-decryptor');

function testPublishedSignatureDecryptor() {
    const clientDecryptionKey = 'a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa'; // Replace with your actual client decryption key
    const email = 'priyanka@invizid.com'; // Replace with the email you want to decrypt
    const signature = '92d277ff72c54afb2186dc4855889ab1:5e2ead214023a4faab2eb912415bcb2494a45e8aafcb6244df86262186fd9d42cf9e1f0050071a885d1285141e766211b63d4dc964eafd755f8f63d983f7124bff6773170e8b530be741d14a4d9bfeb6' // Replace with the signature you want to decrypt

    try {
        // Create decryptor instance
        const decryptor = new PayloadDecryptor(clientDecryptionKey);
        const result = decryptor.validateDecryption(email, signature);

        console.log('\nResults:', result);
        console.log('Validation successful:', result.isValid);
        if (result.isValid) {
            console.log('Decrypted data:', result.decryptedData);
        }
    } catch (error) {
        console.error('Error during decryption:', error);
    }
}

testPublishedSignatureDecryptor();