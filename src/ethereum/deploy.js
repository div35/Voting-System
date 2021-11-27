// https://rinkeby.infura.io/v3/78b1532a1f4c48deb702c0c2ccc93c89
// 0x99F81F365B7f9EEdB84b54af5C3aC6A163194feB
// 0x5B1287fbad7B49c368c0E252cEc6fd2e839c9eE6
// 0x5F9f51AB8f630cC438f7a71A4673692c71606F31
// 0x959d7419d86f92E9Cccdaa10461a6a47a27B5A3C
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ElectionFactory.json');

const provider = new HDWalletProvider(
    'parent harbor mercy suggest violin turtle era corn champion cost melody scrap',
    'https://rinkeby.infura.io/v3/78b1532a1f4c48deb702c0c2ccc93c89'
);

const web3 = new Web3(provider);

const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    // console.log('using account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '3000000'});

    console.log('Contract address',result.options.address);
}
deploy();
