import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "dbgerenciadoringresso",
  private_key_id: "4ca17a90358044697f75d48eaa9e6586612bfcf3",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQdIyQZ4xjF2Pm\nFutJeUi27kVih584vr3NyzYg2ZEbixq2q5g7S8v2HE5U3NQ8hlPrilb9DjM992Lm\nldPLr+kOn/0edocpHc8NYvqvNnu9fKsWBvOKYWgJa/8aoGvdyjCXAHjw3NETKtoN\nbi9VQHVCxFuDoIqrMmcvOcU7tY29/L2H2IiBPhxMpeg4ifOPzTD+y7h5m8Y3vJWT\ni+cYuRYP2I8sCeMNwijVJhlMI2wUwq5SOUBXLYLMvwV8jn+3SbTqOn+Mf2YXDotZ\nBBnuSGGVeBjg0H6hURiy2FM7QOH1bMquQIphXjdZNfOH3QJ+HhR3hZD838OcYgpn\nJDa1PP/dAgMBAAECggEAV2yB5TAgTxCou39iN0LP7bR5UgzaCITqemwe6+EDO/93\neSP3KOstg660ZV/l/OpDONYgjGnPsM3XYyh0FolUn2cW05dXMTXIt+8KfsBFXh9y\naz8IFcGrTcRGzYZ5Jp/dB/9ROYcKglTm9VoALOtnIlTSop4Keikd4E8Eunl2lDYw\nr3ymVEYhXCYO9M9cdEV8HLoVVJW0x4cSMKYs5iJa4F2Aj0Tz5Herk3RQ42vqIcve\nF5G4FXHKN3lFkT6sGwsSC36g46i5cX0U56VBCrJ9BrHtPjwaVU2P02knuCBmG8+q\n76Ei6YDnbINhrkz+wSRz1Er9X09FiwvNzH7D9bb6+wKBgQD1lofIDv4vyolNJZIj\n4V9tnINxJ1t23wrCbZjLFY6+klqIjKlHVqR89uIWKYqhkUZ3TTIVl68vRcAEIcr4\napKrGv3/oQDSBl+hvJoKdH7OpmKB5P47pCQ5jOtAC40aMfZrdArbr/VlDl1rB7H1\nOOF9maWIkvj46xXnMG3F6vxiawKBgQDZSwBiB+0UR/XlUmcY3psjML+n1zoUhF1e\nOQ3Niy4YXy+HNYrRXCszFUVAoh8PrDq0t6PEO2AiKSE0t2mfMVbpjyZUK1rW8A5a\npyWvQzYzekhUENNqfZMN7F7Q+tNZEu+qeiK7kEuUsLllCmG0tP0iH2ovmEsRU7Y0\n9ECDA1kI1wKBgHDfe46WXXtHoi1D7FPzXHG7cqoKBb6vqnlL9+K3CMFL8LI7u/2e\ns8D/k0/OTfoOFA32++LysUCP1T3Q7kGYccqUgFMCA6eD6GYkkcPmYPXHgRTkU3jD\n6yZMPz9TT8nPVstyLR9lUurcXFE52y+yseiROoR30FhPa+Sy3HEPnGn7AoGANHBt\nPzs6c9KJ/TXNu6q9Ndjl59OBKMJo5fxO4HPeQ/N0vOSnA6+CnWlctSRq6pVd9Y77\n7reFk7jpUpeQ3eJCX0s0rMtpuMVmMWp1Jb7KrdGs8ty8qM51Vr7cgwKFTtHLFRE0\noJ9KHjAoDcJbogirrjh2n9XZB+1z44Oure945TECgYArkaRUcgdve/JXzcQdWL+3\nNpwU+0ua4gHE0XM+JpG4+6cjE5nIfERkqAVv5v5o3hDx+ZwtrHBGOgHLnwVogbll\nOAHelh8Y0j2Yv8L+hKtND30+nkJxeDneBy0YBDJ1D54Ev2FyathfI0P4AtIkQ22c\n7SSSizVwlwFlNqu0TK518w==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fvx7r@dbgerenciadoringresso.iam.gserviceaccount.com",
  client_id: "115471932300243142723",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fvx7r%40dbgerenciadoringresso.iam.gserviceaccount.com",
};

const serviceAccountWithoutType = {
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientX509CertUrl: serviceAccount.client_x509_cert_url,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountWithoutType),
  });
}

export default admin;
