---
title: "PDF Digital Signer"
description: "Web-based PDF digital signature tool with PFX certificate support and custom signature positioning"
year: 2025
tags: ["Node.js", "Next.js", "PDF", "Digital Signature", "Cryptography"]
category: "personal"
---

Web application for digitally signing PDF documents using PFX certificates with customizable signature placement and Adobe Acrobat compatibility.

## Features

- PDF document upload and preview
- Digital signature using PFX (PKCS#12) certificates
- Custom signature position selection on document
- Adobe Acrobat Document (AcroForm) support
- Private key certificate management
- Signed PDF download

## Implementation

Users upload a PDF file and their PFX certificate (private key), then visually select the signature location on the document. The application applies the digital signature with proper cryptographic validation, creating a legally valid signed PDF compatible with Adobe Acrobat.

## Technical Details

- **Frontend**: Next.js for interactive PDF preview and signature positioning
- **Backend**: Node.js for PDF processing and cryptographic operations
- **Certificate Format**: PFX/PKCS#12 for private key storage
- **PDF Standards**: AcroForm compliance for signature fields
- **Security**: Client-side certificate handling with secure signing process

## Use Cases

- Document authentication and verification
- Legal document signing workflows
- Contract and agreement validation
- Secure document approval processes

## Technologies

- Next.js
- Node.js
- PDF Processing Libraries
- Digital Signature Standards (PKCS#12)
- Adobe Acrobat Document Format (AcroForm)

[View on GitHub](https://github.com/hardikhari96/pdf-signer)
