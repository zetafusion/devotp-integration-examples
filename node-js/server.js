const express = require("express");
const path = require("path");
const { PayloadDecryptor } = require("user-verification-signature-decryptor");

const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Simple form submission endpoint
app.post("/api/submit-form", async (req, res) => {
  console.log("\n=== FORM SUBMISSION RECEIVED ===");
  console.log("Request body:", req.body);

  // Extract form data
  const formData = req.body;
  const clientDecryptionKey =
    "a0fa422246b3a13d720ddab1453c5a6bfbe3d120554500be2156d8e5d5b4c3fa";

  let validationResult = null;

  try {
    // Create decryptor instance
    const decryptor = new PayloadDecryptor(clientDecryptionKey);

    console.log("🔐 Starting validation...");
    console.log("Email:", formData.email);
    console.log("Signature:", formData.email_signature);

    // Handle both sync and async cases
    const result = decryptor.validateDecryption(
      formData.email,
      formData.email_signature
    );

    // Check if result is a Promise
    if (result && typeof result.then === "function") {
      console.log("⏳ Waiting for async validation...");
      validationResult = await result;
    } else {
      console.log("⚡ Sync validation completed");
      validationResult = result;
    }

    console.log("\n✅ Validation Results:", validationResult);
    console.log("🎯 Validation successful:", validationResult?.isValid);

    if (validationResult?.isValid) {
      console.log("🔓 Decrypted data:", validationResult.decryptedData);
    } else {
      console.log("❌ Validation failed");
    }
  } catch (error) {
    console.error("💥 Error during decryption:", error);
    validationResult = { isValid: false, error: error.message };
  }

  // Create response
  const response = {
    success: true,
    message: "Form data received successfully!",
    receivedData: formData,
    validation: validationResult,
    timestamp: new Date().toISOString(),
    dataCount: Object.keys(formData).length,
  };

  console.log("📤 Sending response:", {
    ...response,
    receivedData: {
      ...response.receivedData,
      email_signature:
        response.receivedData.email_signature?.substring(0, 50) + "...",
    },
  });
  console.log("=================================\n");

  // Send success response back to client
  res.json(response);
});

// Catch all other routes
app.get("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Ready to receive form submissions at /api/submit-form`);
});
