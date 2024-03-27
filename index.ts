const { Web3 } = require('web3');

const NODE_URL = "wss://ethereum-mainnet.core.chainstack.com/ws/673e14e04acb090649b2f13d15a74b34";
const web3 = new Web3(NODE_URL);

const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const SWAP_EXACT_ETH_FOR_TOKENS_SIGNATURE = "0x7ff36ab5";
const SWAP_EXACT_ETH_FOR_FEE_TOKENS_SIGNATURE = "0xb6f9de95";

async function subscribeTokenBlocks() {
    const sub = await web3.eth.subscribe("newBlockHeaders");
    sub.on('data', handleNewBlock);
}

async function handleNewBlock(blockHeader) {
    console.log(`Got new Block: ${blockHeader.number}`);
    const block = await web3.eth.getBlock(blockHeader.number, true);
    // console.log("Block Transactions:", block.transactions);
    block.transactions.forEach((tx) => {
        if (tx.to && tx.to.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase() &&
        (tx.input.startsWith(SWAP_EXACT_ETH_FOR_TOKENS_SIGNATURE) || 
         tx.input.startsWith(SWAP_EXACT_ETH_FOR_FEE_TOKENS_SIGNATURE))) {
            console.log("....................");
            console.log(`Incoming swap tx: ${tx.hash}`);
            console.log(`From: ${tx.from}`);
            console.log(`Value: ${web3.utils.fromWei(tx.value, "ether")}, ETH`);
            console.log("....................");
         }
    })
}

subscribeTokenBlocks(); 
