# DEVOTP SDK

This repository contains example implementations of the DEVOTP user verification SDK for vanilla JavaScript applications with Node.js backend integration.

## Overview

The DEVOTP SDK provides a simple way to implement email and phone verification in your web applications. The SDK handles the verification process, including sending verification codes (OTP) and validating user inputs with cryptographic signatures for enhanced security.

## Installation

### Frontend SDK

For vanilla JavaScript applications, include the SDK directly from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/devotp-sdk@1.0.4/dist/devotp-sdk.bundle.js"></script>
```

### Backend Dependencies

Install the signature decryptor for server-side validation:

```bash
npm install user-verification-signature-decryptor express
```

## Usage

### Frontend Implementation

#### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>User Verification</title>
</head>
<body>
    <div id="email-verification"></div>
    <div id="phone-verification"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/devotp-sdk@1.0.4/dist/devotp-sdk.bundle.js"></script>
    <script>
        let emailData = null;
        let phoneData = null;

        // Initialize email verification
        window.UserVerification.initEmailVerification("#email-verification", {
            siteId: "YOUR_SITE_ID",
            onSuccess: (data) => {
                console.log("Email verification successful:", data);
                emailData = data; // Store verification data
            },
            onError: (error) => {
                console.error("Email verification error:", error);
            }
        });

        // Initialize phone verification
        window.UserVerification.initPhoneVerification("#phone-verification", {
            siteId: "YOUR_SITE_ID",
            onSuccess: (data) => {
                console.log("Phone verification successful:", data);
                phoneData = data; // Store verification data
            },
            onError: (error) => {
                console.error("Phone verification error:", error);
            }
        });
    </script>
</body>
</html>
```

#### Alternative API Structure

Some versions of the SDK may use the `Devotp` namespace:

```javascript
window.Devotp.initEmailVerification("#email-verification", {
    siteId: "YOUR_SITE_ID",
    onSuccess: (data) => {
        console.log("Email verification successful:", data);
    },
    onError: (error) => {
        console.error("Email verification error:", error);
    }
});
```

### Backend Implementation

#### Node.js with Express

```javascript
const express = require("express");
const { PayloadDecryptor } = require("user-verification-signature-decryptor");

const app = express();
app.use(express.json());

const CLIENT_DECRYPTION_KEY = "your_client_decryption_key_here";

app.post("/api/submit-form", async (req, res) => {
    const { email, phone, email_signature, phone_signature } = req.body;
    
    try {
        const decryptor = new PayloadDecryptor(CLIENT_DECRYPTION_KEY);
        
        let emailValidation = null;
        let phoneValidation = null;
        
        // Validate email if provided
        if (email && email_signature) {
            const result = decryptor.validateDecryption(email, email_signature);
            emailValidation = typeof result.then === "function" ? await result : result;
        }
        
        // Validate phone if provided
        if (phone && phone_signature) {
            const result = decryptor.validateDecryption(phone, phone_signature);
            phoneValidation = typeof result.then === "function" ? await result : result;
        }
        
        res.json({
            success: true,
            verifications: {
                email: emailValidation?.isValid || false,
                phone: phoneValidation?.isValid || false
            },
            data: {
                email: emailValidation?.isValid ? email : null,
                phone: phoneValidation?.isValid ? phone : null
            }
        });
        
    } catch (error) {
        console.error("Validation error:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
```

## Configuration

### Required Parameters

- **siteId**: Your unique site identifier provided by DEVOTP
- **clientDecryptionKey**: Server-side key for signature validation

### Callback Functions

- **onSuccess(data)**: Called when verification is successful
  - `data.identifier`: The verified email or phone number
  - `data.signature`: Cryptographic signature for server validation
- **onError(error)**: Called when verification fails

## Verification Data Structure

When verification is successful, the SDK returns an object with:

```javascript
{
    identifier: "user@example.com", // or phone number
    signature: "encrypted_signature_string"
}
```

## Security Features

- **Cryptographic Signatures**: Each verification includes a signature that must be validated server-side
- **Server-Side Validation**: Use the `PayloadDecryptor` to verify signatures before trusting verification data
- **Secure Communication**: All verification data is encrypted and signed

## Security Best Practices

1. **Always validate signatures server-side** before processing verification data
2. **Keep your client decryption key secure** and never expose it in frontend code
3. **Use HTTPS** for all communication between client and server
4. **Implement rate limiting** on your verification endpoints
5. **Never store verification signatures** in browser storage

## Error Handling

Common error scenarios:
- Invalid site ID
- Network connectivity issues
- Invalid phone number format
- Email delivery failures
- Signature validation failures

Handle errors gracefully in your `onError` callback:

```javascript
onError: (error) => {
    console.error("Verification failed:", error);
    // Display user-friendly error message
    showUserMessage("Verification failed. Please try again.");
}
```

## Browser Compatibility

The SDK is compatible with all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+

## Troubleshooting

**Verification emails not received:**
- Check spam/junk folders
- Verify email address format
- Check rate limits

**Phone verification issues:**
- Ensure phone number includes country code
- Check SMS delivery in your region
- Verify phone number format

**Signature validation fails:**
- Ensure correct client decryption key is used
- Check that verification data hasn't been modified
- Verify server-side decryptor implementation

**SDK not initializing:**
- Verify correct site ID
- Check browser console for errors
- Ensure SDK script loaded properly

## Example Project Structure

```
user-verification-app/
├── index.html              # Frontend with verification widgets
├── server.js               # Node.js backend with validation
├── package.json            # Dependencies
└── README.md              # This file
```

## Support

For technical support and questions:
- Check browser console for error messages
- Verify all required parameters are provided
- Ensure proper error handling is implemented