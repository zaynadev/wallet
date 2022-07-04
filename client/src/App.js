import { useEffect, useState } from 'react';
import Header from './Header.js';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';
import { getWeb3, getWallet } from './utils.js';

function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setapprovers] = useState([]);
  const [limit, setLimit] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  useEffect( () => {
    const init = async() => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const limit = await wallet.methods.limit().call();
      const transfers = await wallet.methods.getTransfers().call();
      console.log('transfers =====> ', transfers);
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setapprovers(approvers);
      setLimit(limit);
      setTransfers(transfers);
    }
    init();
  })

  const createTransfer = (transfer) => {
    console.log("transfer ====> ", transfer);
    wallet.methods.createTransfer(transfer.to).send({ from: accounts[0], value: transfer.amount });
  }

  const approveTransfer = (transferId) => {
    
    wallet.methods.approveTransfer(transferId).send({from: accounts[0]})
    .then(result => console.log('approve result ====> ', result))
    .catch(err => console.log('approve err ====> ', err?.message))
  }


  return (
    <>
    {
      typeof web3 === undefined || 
      typeof accounts === undefined ||  
      typeof wallet === undefined ||
      typeof approvers === undefined ||
      typeof limit === undefined 
      ?
      <div>Loading ...</div> 
      :(
      <div>
        Multisig wallet
        <Header approvers={approvers} limit={limit} />
        <NewTransfer createTransfer={createTransfer} />
        <TransferList transfers={transfers} approveTransfer={approveTransfer} />
      </div>
      )
    }
    </>
  );
}

export default App;
