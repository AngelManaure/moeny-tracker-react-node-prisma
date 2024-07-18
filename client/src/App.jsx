import { useEffect, useState } from "react"

import './App.css'

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([]);

  
  const addTransaction = (e) => {
    e.preventDefault();
    
    const url = 'http://localhost:3000/api/transaction';
    const date = new Date(datetime);
    const isoDate = date.toISOString();

    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        name: name.substring(price.length+1),
        price,
        description,
        datetime: isoDate
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDescription('');
        setDateTime('');
        console.log('result', json);
      })
    })
  }

  useEffect(() => {
    loadTransactions().then(transactions => {
      setTransactions(transactions);
    })
  }, [])

  const loadTransactions = async () => {
    const url = 'http://localhost:3000/api/transactions';
    const response = await fetch(url)
    return await response.json();
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2)
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0]

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addTransaction}>
        <div className={'basic'}>
        <input 
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={'+200 new samsung tv'}
        />

        <input 
        type="datetime-local"
        value={datetime}
        onChange={e => setDateTime(e.target.value)}
        />
        </div>

        <div className={'desciption'}>
        <input 
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder={'description'}
        />
        </div>
        <button type='submit'>Add new transaction</button>
          </form>
        <div className="transactions">
        {transactions.map((transaction) => (
                <div className="transaction" key={transaction.id}>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div 
                    className={`price ` + (transaction.price<0 ? 'red':'green')}>{transaction.price}</div>
                    <div className="datetime">{transaction.datetime}</div>
                  </div>
                </div>

        ))}
      </div>

    </main>
  )
}

export default App