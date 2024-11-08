import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let body = await request.json();
  const initialQuantity = parseInt(body.initialQuantity);

  // Replace the uri string with your connection string.
  const uri = "mongodb+srv://ashwin:stock@cluster0.mvupi.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("accounts");
    const inventory = database.collection("inventory");

    const updateFilter = {productName: body.name};

    let newQuantity = body.action=="plus"? (initialQuantity+1) : (initialQuantity-1);

    const updateAction = {$set: {quantity: newQuantity}};

    const result = await inventory.updateOne(updateFilter, updateAction);
    return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
