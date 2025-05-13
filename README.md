# DEVOTP SDK

This repository contains example implementations of the user verification SDK for both React.js and vanilla JavaScript applications.

## Overview

The User Verification SDK provides a simple way to implement email and phone verification in your web applications. The SDK handles the verification process, including sending verification codes (OTP) and validating user inputs.

## Installation

Install the SDK via npm:

bash
npm install user-verification


For vanilla JavaScript applications, you can include the SDK directly from CDN:

html
<script src="https://cdn.jsdelivr.net/npm/user-verification@0.1.6/dist/user-verification.cjs.production.min.js"></script>


## Usage

### Initialization

Both implementations require initializing the SDK with your site ID:

javascript
devInit('YOUR_SITE_ID'); // Replace with your actual site ID


### HTML Markup

To use the SDK, add the following data attributes to your form elements:

- `data-verify="email"` - For email input fields
- `data-verify="phone"` - For phone number input fields
- `data-verify="verify-button"` - For verification buttons

### Event Handling

The SDK dispatches a `dev-otp-verified` event when verification is complete. The event contains details about the verification status.

## Examples

### React Implementation

The repository includes a complete React implementation in `App.js`. Key features:

- React hooks for state management
- Event listener setup and cleanup
- Status message display

### Vanilla JavaScript Implementation

A standalone HTML file demonstrates the vanilla JavaScript implementation. Key features:

- Simple HTML structure with data attributes
- Minimal JavaScript code for initialization and event handling
- Basic styling for the verification interface

## Security Considerations

- The site ID should be treated as a public key and can be included in frontend code
- Verification signatures should be validated on your backend for secure operations
- Never store sensitive verification information in localStorage or sessionStorage

## Browser Compatibility

The SDK is compatible with all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+

## Troubleshooting

Common issues:
- Verification emails not receiving: Check spam folders
- SDK not initializing: Ensure the correct site ID is used
- Events not firing: Verify correct data attributes are applied to elements
