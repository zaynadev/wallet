import Web3 from 'web3';
import Wallet from "./contracts/Wallet.json";

const getWeb3 = () => {
    return new Promise( (resolve, reject) => {
        window.addEventListener('load', async() => {
            if(window.ethereum){
                const web3 = new Web3(window.ethereum);
                web3.eth.handleRevert = true;
                try{
                  await window.ethereum.enable();
                  resolve(web3);
                } catch(err){
                  reject(err)
                }
            } else if(window.web3){
                resolve(window.web3);
            } else {
                reject('Must install metamask');
            }
        })
    } );
}

const getWallet = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const contract = Wallet.networks[networkId];
    const wallet = await new web3.eth.Contract(Wallet.abi, contract && contract.address)
    wallet.handleRevert = true
    return wallet;
}

export { getWeb3, getWallet };