export const calculateSignature = async (data: string, secretKey: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', keyBuffer, dataBuffer);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signature = signatureArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return signature;
  }
