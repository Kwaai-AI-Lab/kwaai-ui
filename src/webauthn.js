// webauthn.js
export const createCredential = async (email) => {
    const publicKeyCredentialCreationOptions = {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        rp: {
            name: "Kwaai"
        },
        user: {
            id: window.crypto.getRandomValues(new Uint8Array(32)),
            name: email,
            displayName: email
        },
        pubKeyCredParams: [
            {
                type: "public-key",
                alg: -7 // ES256 algorithm
            },
            {
                type: "public-key",
                alg: -257 // RS256 algorithm
            }
        ],
        authenticatorSelection: {
            authenticatorAttachment: "platform", 
            userVerification: "preferred"
        },
        timeout: 120000, 
        attestation: "direct"
    };

    console.log('PublicKeyCredentialCreationOptions:', publicKeyCredentialCreationOptions);

    try {
        console.log('Creating credential...');
        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        });
        console.log('Credential created:', credential);
        return credential;
    } catch (error) {
        console.error('Error creating credential:', error);
        throw error;
    }
};

export const getCredential = async (credentialId) => {
    let decodedId;
    try {
        // Ensure the credentialId is URL-safe Base64 encoded
        const base64CredentialId = credentialId.replace(/-/g, '+').replace(/_/g, '/');
        decodedId = Uint8Array.from(atob(base64CredentialId), c => c.charCodeAt(0));
    } catch (error) {
        console.error('Error decoding credentialId:', error);
        throw new Error('Invalid credentialId encoding');
    }

    const publicKeyCredentialRequestOptions = {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
            {
                type: "public-key",
                id: decodedId,
                transports: ["internal", "cross-platform", "hybrid", "usb", "nfc", "ble"] // Ensure compatibility with Safari
            }
        ],
        userVerification: "preferred",
        timeout: 60000
    };

    try {
        const assertion = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        });
        return assertion;
    } catch (error) {
        console.error('Error getting credential:', error);
        throw error;
    }
};
