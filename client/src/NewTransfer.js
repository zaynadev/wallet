import React, {useState} from 'react'

function NewTransfer({createTransfer}) {

    const [transfer, setTransfer] = useState(undefined);

    const submit = (e) => {
        e.preventDefault();
        createTransfer(transfer);
    }

    const updateTransfer = (e, field) => {
      setTransfer({...transfer, [field]: e.target.value});
    }
  return (
    <div> 
         <h2> New Transfer </h2>
         <form onSubmit={(e => submit(e))}>
            <label htmlFor="amount">Amount</label>
            <input type="text" id="amount" onChange={e => updateTransfer(e, 'amount')} />
            <label htmlFor="to">To</label>
            <input type="text" id="to" onChange={e => updateTransfer(e, 'to')} />
            <button>Submit</button>
         </form>
    </div>
  )
}

export default NewTransfer