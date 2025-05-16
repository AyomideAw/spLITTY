import { AptosClient, AptosAccount, HexString, TxnBuilderTypes, BCS } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

// Replace with your deployed module address
const MODULE_ADDRESS = "0xf422b73d0fd463e73eed36ea4d92185428f7310bea29baa2063d4ed557dfe746";
const MODULE_NAME = "GroupSplitter";

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
