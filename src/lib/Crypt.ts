

export async function GenerateKeyPair() {
  return await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  )
}

export async function deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey
    },
    privateKey,
    {
      name: "AES-GCM", length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}


export async function encryptMessage(text: string, sharedKey: CryptoKey) {

  const encodedText = new TextEncoder().encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    sharedKey,
    encodedText
  )



  const ciphertextArray = new Uint8Array(ciphertextBuffer)
  const combined = new Uint8Array(iv.length + ciphertextArray.length);
  combined.set(iv);
  combined.set(ciphertextArray, iv.length)
  return btoa(String.fromCharCode(...combined))
}





export async function decryptMessage(base64Cipher: string, sharedKey: CryptoKey) {
  const binaryStr = atob(base64Cipher);
  const combined = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    combined[i] = binaryStr.charCodeAt(i)
  }


  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)


  const decryptBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    sharedKey,
    ciphertext
  );

  return new TextDecoder().decode(decryptBuffer)
}
















export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedArray = new Uint8Array(exported);
  return btoa(String.fromCharCode(...exportedArray));
}

export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const binaryStr = atob(base64Key);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey(
    "spki",
    bytes,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}


function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SecureChatDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("keys");
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function savePrivateKey(privateKey: CryptoKey): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("keys", "readwrite");
    const store = transaction.objectStore("keys");
    const request = store.put(privateKey, "my_private_key");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getPrivateKey(): Promise<CryptoKey | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("keys", "readonly");
    const store = transaction.objectStore("keys");
    const request = store.get("my_private_key");
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => reject(request.error);
  });
}
