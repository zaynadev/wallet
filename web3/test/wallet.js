const { expectRevert } = require('@openzeppelin/test-helpers');
const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
        wallet = await Wallet.new(
            [accounts[0], accounts[1], accounts[2]],
            1
        );
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000})
    });

    it('Should have correct approvers and limit', async () => {
        const approvers = await wallet.getApprovers();
        const limit = await wallet.limit();
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);   
        assert(limit.toNumber() === 1);
        
    })

    it('Should create a transfer', async () => {
        await wallet.createTransfer(accounts[0], {from: accounts[2], value: 10});
        const transfers = await wallet.getTransfers();
        assert(transfers.length === 1);
    })

    it('Should not create transfer when sender is not a approver', async () => {
        await expectRevert(
            wallet.createTransfer(accounts[0], {from: accounts[4], value: 10}),
            'only for approvers!'
        ) 
    })

    it('Should increment approvers', async () => {
        await wallet.createTransfer(accounts[0], {from: accounts[2], value: 10});
        await wallet.approveTransfer(0, {from: accounts[0]});
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        assert(transfers[0].approvals === '1');
        assert(transfers[0].sent === false);
        assert(balance === '1010');
    })

    it('Should withdraw if limit reached', async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await wallet.createTransfer(accounts[6], {from: accounts[2], value: 100});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.withdraw(0, {from: accounts[0]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
    })

    it('Should revet if withdraw already sent', async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await wallet.createTransfer(accounts[6], {from: accounts[2], value: 100});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.withdraw(0, {from: accounts[0]});
        await expectRevert(
            wallet.withdraw(0, {from: accounts[0]}),
            'already done!!!'
        ) 
    })
});