// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
// const admin = require('@google-cloud/firestore');

admin.initializeApp();

// CREATE USER

exports.createUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const name = req.body.name;
    const phone = req.body.phone;

    const writeResult = await admin.firestore().collection('users').add(
        {
            name: name,
            phone: phone,
        });

    res.status(201).json({ result: `User with ID: ${writeResult.id} added.` });

})

// READ USER

exports.readUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
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

    } catch (err) {
        console.log(err);
        res.json(err);
    }


})

// UPDATE USER

exports.updateUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'PUT') {
        console.log('method: ', req.method)
        return res.status(405).json({ error: 'Method not allowed' });
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

                res.status(200).json({ result: `User with ID: ${req.query.id} updated.` });
            });

        } catch (err) {
            console.log(err);
            res.json(err);
        }

    } catch (err) {
        console.log(err);
        res.json(err);
    }

})

// DELETE USER

exports.deleteUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'DELETE') {
        console.log('method: ', req.method)
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const id = req.query.id;

    try {

        const doc = await admin
            .firestore()
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), '==', id)
            .get();

        try {
            doc.forEach(documentSnapshot => {
                documentSnapshot.ref.delete()

                res.status(200).json({ result: `User with ID: ${req.query.id} deleted.` });
            });

        } catch (err) {
            console.log(err);
            res.json(err);
        }

    } catch (err) {
        console.log(err);
        res.json(err);
    }
})

