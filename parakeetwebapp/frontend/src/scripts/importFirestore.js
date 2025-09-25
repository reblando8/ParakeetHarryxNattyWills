// Usage: node scripts/importFirestore.js ./data/users.json users
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const [,, jsonPath, collectionName] = process.argv;
if (!jsonPath || !collectionName) {
  console.error('Usage: node scripts/importFirestore.js <jsonPath> <collectionName>');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve('serviceAccountKey.json'))),
});
const db = admin.firestore();

async function run() {
  const raw = fs.readFileSync(path.resolve(jsonPath), 'utf-8');
  const data = JSON.parse(raw);

  const batches = [];
  let batch = db.batch();
  let ops = 0;

  const put = (docId, docData) => {
    const ref = docId ? db.collection(collectionName).doc(String(docId)) : db.collection(collectionName).doc();
    batch.set(ref, docData, { merge: true });
  };

  const commitIfNeeded = async () => {
    if (ops >= 450) { // stay under 500 writes per batch
      batches.push(batch.commit());
      batch = db.batch();
      ops = 0;
    }
  };

  if (Array.isArray(data)) {
    for (const item of data) {
      const { id, ...rest } = item || {};
      put(id, rest);
      ops += 1;
      await commitIfNeeded();
    }
  } else if (data && typeof data === 'object') {
    for (const [id, doc] of Object.entries(data)) {
      put(id, doc);
      ops += 1;
      await commitIfNeeded();
    }
  } else {
    throw new Error('JSON must be an array of docs or an object keyed by docId.');
  }

  batches.push(batch.commit());
  await Promise.all(batches);
  console.log(`Imported to collection '${collectionName}'.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});