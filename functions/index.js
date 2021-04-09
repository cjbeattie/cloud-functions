// firebase emulators:start
// http://localhost:4000/

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
// const admin = require('@google-cloud/firestore');

admin.initializeApp();

// CREATE USER

exports.createUser = functions.https.onRequest(async (req, res) => {
    try {

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const name = req.body.name;
        const phone = req.body.phone;

        if (!name || !phone) {
            res.status(400).json({ Error: 'Name and phone must be present.' });
        }

        const writeResult = await admin.firestore().collection('users').add(
            {
                name: name,
                phone: phone,
            });

        res.status(201).json({ result: `User with ID: ${writeResult.id} added.` });

    } catch (err) {

        res.status(500).json({ Error: 'Unknown error' });

    }
})

// READ USER

exports.readUser = functions.https.onRequest(async (req, res) => {
    try {

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const id = req.query.id;

        const querySnapshot = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();

        if (querySnapshot.empty) {
            res.status(404).json({ Error: `A user with the id ${req.query.id} does not exist.` });
        }

        // Needs to be enumerated, see https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html
        querySnapshot.forEach(documentSnapshot => {
            res.status(200).json(documentSnapshot.data());
        });

    } catch (err) {

        res.status(500).json({ Error: 'Unknown error' });

    }


})

// UPDATE USER

exports.updateUser = functions.https.onRequest(async (req, res) => {
    try {

        if (req.method !== 'PUT') {
            console.log('method: ', req.method)
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const id = req.query.id;
        const name = req.body.name;
        const phone = req.body.phone;

        const querySnapshot = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();

        if (querySnapshot.empty) {
            res.status(404).json({ Error: `A user with the id ${req.query.id} does not exist.` });
        }

        querySnapshot.forEach(documentSnapshot => {
            documentSnapshot.ref.update({
                'name': name,
                'phone': phone,
            })

            res.status(200).json({ result: `User with ID: ${req.query.id} updated.` });
        });

    } catch (err) {

        res.status(500).json({ Error: 'Unknown error' });

    }

})

// DELETE USER

exports.deleteUser = functions.https.onRequest(async (req, res) => {
    try {

        if (req.method !== 'DELETE') {
            console.log('method: ', req.method)
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const id = req.query.id;

        const querySnapshot = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();

        if (querySnapshot.empty) {
            res.status(404).json({ Error: `A user with the id ${req.query.id} does not exist.` });
        }

        querySnapshot.forEach(documentSnapshot => {
            documentSnapshot.ref.delete()

            res.status(200).json({ result: `User with ID: ${req.query.id} deleted.` });
        });

    } catch (err) {

        res.status(500).json({ Error: 'Unknown error' });

    }
})

