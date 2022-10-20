import React, {useState, useEffect} from 'react'

function App() {
  const [backendData, setBackendData] = useState<any>([]);

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  const apiErr: JSX.Element = (
    <p>Loading...</p>
  )
  
  return (
    <div>
      {(typeof backendData.users === 'undefined') ? apiErr : (
        backendData.users.map((user: string, i: any) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  )
}

export default App