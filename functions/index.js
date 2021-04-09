// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
// const admin = require('@google-cloud/firestore');

admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({ original: original });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        // Grab the current value of what was written to Firestore.
        const original = snap.data().original;

        // Access the parameter `{documentId}` with `context.params`
        functions.logger.log('Uppercasing', context.params.documentId, original);

        const uppercase = original.toUpperCase();

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to Firestore.
        // Setting an 'uppercase' field in Firestore document returns a Promise.
        return snap.ref.set({ uppercase }, { merge: true });
    });






// /**
// * Copyright 2016 Google Inc. All Rights Reserved.
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *      http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
// 'use strict';

// // [START functionsimport]
// const functions = require('firebase-functions');
// // [END functionsimport]
// // [START additionalimports]
// // Moments library to format dates.
// const moment = require('moment');
// // CORS Express middleware to enable CORS Requests.
// const cors = require('cors')({
//     origin: true,
// });
// // [END additionalimports]

// // [START all]
// /**
//  * Returns the server's date. You must provide a `format` URL query parameter or `format` value in
//  * the request body with which we'll try to format the date.
//  *
//  * Format must follow the Node moment library. See: http://momentjs.com/
//  *
//  * Example format: "MMMM Do YYYY, h:mm:ss a".
//  * Example request using URL query parameters:
//  *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
//  * Example request using request body with cURL:
//  *   curl -H 'Content-Type: application/json' /
//  *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
//  *        https://us-central1-<project-id>.cloudfunctions.net/date
//  *
//  * This endpoint supports CORS.
//  */
// // [START trigger]
// exports.date = functions.https.onRequest((req, res) => {
//     // [END trigger]
//     // [START sendError]
//     // Forbidding PUT requests.
//     if (req.method === 'PUT') {
//         return res.status(403).send('Forbidden!');
//     }
//     // [END sendError]

//     // [START usingMiddleware]
//     // Enable CORS using the `cors` express middleware.
//     return cors(req, res, () => {
//         // [END usingMiddleware]
//         // Reading date format from URL query parameter.
//         // [START readQueryParam]
//         let format = req.query.format;
//         // [END readQueryParam]
//         // Reading date format from request body query parameter
//         if (!format) {
//             // [START readBodyParam]
//             format = req.body.format;
//             // [END readBodyParam]
//         }
//         // [START sendResponse]
//         const formattedDate = moment().format(`${format}`);
//         functions.logger.log('Sending Formatted date:', formattedDate);
//         res.status(200).send(formattedDate);
//         // [END sendResponse]
//     });
// });
// // [END all]



// USERS

exports.createUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    // Grab the name and phone number
    const name = req.body.name;
    const phone = req.body.phone;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('users').add(
        {
            name: name,
            phone: phone,
        });
    // Send back a message that we've successfully written the message
    res.status(201).json({ result: `User with ID: ${writeResult.id} added.` });

})

exports.readUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }
    const id = req.query.id;

    try {

        const doc = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();

        doc.forEach(documentSnapshot => {
            res.status(200).json(documentSnapshot.data());
        });

        //res.json(doc.data());

    } catch (err) {
        console.log(err);
        res.json(err);
    }

    // const doc = await admin
    //     .firestore()
    //     .collection('users')
    //     .where(admin.firestore.FieldPath.documentId(), '==', id)
    //     .get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach(documentSnapshot => {
    //             if (!documentSnapshot) {
    //                 res.err('No document found')
    //             }
    //             res.status(200).json(documentSnapshot.data());
    //         });
    //     })
    // // .catch((err) => {
    // //     console.log(err)
    // //     res.send(err);
    // // })
})

exports.updateUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'PUT') {
        console.log('method: ', req.method)
        return res.status(405).send('Method Not Allowed');
    }

    const id = req.query.id;
    const name = req.body.name;
    const phone = req.body.phone;

    try {

        const doc = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();


        try {
            doc.forEach(documentSnapshot => {
                documentSnapshot.ref.update({
                    'name': name,
                    'phone': phone,
                })

                res.status(200).send('Document updated');
            });

        } catch (err) {
            console.log(err);
            res.json(err);
        }

    } catch (err) {
        console.log(err);
        res.json(err);
    }

    // const doc = await admin
    //     .firestore()
    //     .collection('users')
    //     .where(admin.firestore.FieldPath.documentId(), '==', id)
    //     .get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach(documentSnapshot => {

    //             documentSnapshot.ref.update({
    //                 'name': name,
    //                 'phone': phone,
    //             }).then(() => {
    //                 res.status(200).send('Document updated');
    //             }).catch()


    //         });
    //     })

})

