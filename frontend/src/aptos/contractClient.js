// import { AptosClient, AptosAccount, HexString, TxnBuilderTypes, BCS } from "aptos";

// const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
// const client = new AptosClient(NODE_URL);

// // Replace with your deployed module address
// const MODULE_ADDRESS = "0xf422b73d0fd463e73eed36ea4d92185428f7310bea29baa2063d4ed557dfe746";
// const MODULE_NAME = "GroupSplitter";

// export const logExpense = async (account, description, amount) => {
//   const payload = {
//     type: "entry_function_payload",
//     function: `${MODULE_ADDRESS}::${MODULE_NAME}::log_expense`,
//     type_arguments: [],
//     arguments: [description, amount],
//   };

//   const txnRequest = await client.generateTransaction(account.address(), payload);
//   const signedTxn = await client.signTransaction(account, txnRequest);
//   const txResult = await client.submitTransaction(signedTxn);
//   await client.waitForTransaction(txResult.hash);
//   return txResult.hash;
// };

// export const settlePayment = async (account, toAddress, amount) => {
//   const payload = {
//     type: "entry_function_payload",
//     function: `${MODULE_ADDRESS}::${MODULE_NAME}::settle`,
//     type_arguments: [],
//     arguments: [toAddress, amount],
//   };

//   const txnRequest = await client.generateTransaction(account.address(), payload);
//   const signedTxn = await client.signTransaction(account, txnRequest);
//   const txResult = await client.submitTransaction(signedTxn);
//   await client.waitForTransaction(txResult.hash);
//   return txResult.hash;
// };


import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

// ✅ Your deployed module address
const MODULE_ADDRESS = "0x81da4f271a18f52dde0b0868e3bd644fbb980d1953305c715a874a2ec0bdbf05";
const MODULE_NAME = "splitty_v2"; // ✅ correct

// ✅ 0. Register AptosCoin (needed for zkLogin wallets to see balance)
export const registerAptosCoin = async (account) => {
  const payload = {
    type: "entry_function_payload",
    function: "0x1::managed_coin::register",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [],
  };

  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txResult.hash);

  return txResult.hash;
};

// ✅ 1. Create group (MUST be called before logging expenses)
export const createGroup = async (account, members = []) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_group`,
    type_arguments: [],
    arguments: [members],
  };

  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txResult.hash);
  return txResult.hash;
};

// ✅ 2. Log expense
export const logExpense = async (account, description, amount) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::log_expense`,
    type_arguments: [],
    arguments: [description, amount],
  };

  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txResult.hash);
  return txResult.hash;
};

// ✅ 3. Settle payment
export const settlePayment = async (account, toAddress, amount) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::settle`,
    type_arguments: [],
    arguments: [toAddress, amount],
  };

  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txResult.hash);
  return txResult.hash;
};
