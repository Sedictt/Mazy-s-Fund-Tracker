# Firebase Storage Setup Instructions

## Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **aetheria-4a391**
3. Click on **"Storage"** in the left menu
4. If Storage is not enabled, click **"Get Started"**
5. Select **"Start in production mode"**
6. Click **"Done"**

## Step 2: Update Security Rules

In the Firebase Console Storage section:
1. Go to the **"Rules"** tab
2. Replace the rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/profile-pictures/{fileName} {
      // Allow anyone to read profile pictures
      allow read: if true;
      
      // Allow uploads (you can add authentication later)
      allow write: if request.resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click **"Publish"**

## Step 3: Configure CORS (if needed)

If you still get CORS errors after enabling Storage, you may need to configure CORS settings:

1. Install Google Cloud SDK if you haven't: https://cloud.google.com/sdk/docs/install
2. Create a file named `cors.json` with:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

3. Run this command:
```bash
gsutil cors set cors.json gs://aetheria-4a391.firebasestorage.app
```

## Verification

After completing these steps:
1. Try uploading a profile picture again
2. The image should upload successfully
3. The image URL should be accessible

## Alternative: Use Base64 Storage in Firestore

If you prefer not to use Firebase Storage, we can store images as base64 strings directly in Firestore (not recommended for production due to size limits).
