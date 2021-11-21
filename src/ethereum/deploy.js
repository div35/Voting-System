// https://rinkeby.infura.io/v3/78b1532a1f4c48deb702c0c2ccc93c89
// 0x99F81F365B7f9EEdB84b54af5C3aC6A163194feB
// 0x5B1287fbad7B49c368c0E252cEc6fd2e839c9eE6
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ElectionFactory.json');

const provider = new HDWalletProvider(
    'impulse suggest economy bunker winter used spice zone arrange like normal festival',
    'https://rinkeby.infura.io/v3/78b1532a1f4c48deb702c0c2ccc93c89'
);

const web3 = new Web3(provider);

const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('using account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '3000000'});

    console.log('Contract address',result.options.address);
}
deploy();
