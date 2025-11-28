/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10, region: "asia-east2"});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendChatNotification = onDocumentCreated(
    "messages/{messageId}",
    async (event) => {
      const snap = event.data;
      if (!snap) {
        return;
      }
      const messageData = snap.data();
      const senderName = messageData.userName;
      const messageText = messageData.message;

      // Get all members with an FCM token
      const membersSnapshot = await admin.firestore()
          .collection("members")
          .get();

      console.log(`Found ${membersSnapshot.size} members total.`);

      const tokens = [];
      membersSnapshot.forEach((doc) => {
        const member = doc.data();
        if (member.fcmToken) {
          // For debugging: Allow sending to self
          // if (member.name !== senderName) {
          tokens.push(member.fcmToken);
          console.log(`Added token for member: ${member.name}`);
          // } else {
          //   console.log(`Skipping sender's token: ${member.name}`);
          // }
        } else {
          console.log(`No token for member: ${member.name}`);
        }
      });

      if (tokens.length === 0) {
        console.log("No tokens to send to.");
        return;
      }

      // Prepare notification payload with visual enhancements
      const senderProfilePic = messageData.profilePicture;

      const message = {
        tokens: tokens,
        notification: {
          title: `💬 ${senderName}`,
          body: messageText,
        },
        webpush: {
          notification: {
            icon: "/logo.png", // App icon (always use static for reliability)
            badge: "/logo.png", // Small badge icon
            // Large image in notification (only if profile pic exists and is accessible)
            ...(senderProfilePic && {image: senderProfilePic}),
            requireInteraction: false, // Auto-dismiss after a few seconds
            tag: "chat-message", // Group notifications by tag
            renotify: true, // Alert even if previous notification exists
            // Action buttons (only supported on some browsers)
            actions: [
              {
                action: "view",
                title: "View Chat",
                icon: "/logo.png",
              },
              {
                action: "dismiss",
                title: "Dismiss",
              },
            ],
          },
          fcmOptions: {
            link: "https://aetheria-4a391.web.app", // Click opens this URL
          },
        },
      };

      try {
        const response = await admin.messaging().sendEachForMulticast(message);

        response.responses.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error(
                `Failure sending notification to token ${tokens[index]}:`,
                error,
            );
          }
        });

        console.log("Notifications sent summary:", {
          successCount: response.successCount,
          failureCount: response.failureCount,
        });
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    });
