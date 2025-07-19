import React, {useState, useEffect} from 'react'
import {usePlaidLink} from 'react-plaid-link'


import api from '../api.js'

function Integrations() {

    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLinkToken().catch(error => {
          console.error('Error fetching link token:', error);
        });
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            const institutionId = metadata.institution?.institution_id ?? null;
            try {
            await api.post("/integrations/plaid/exchange-token/", {
                public_token,
                institution_id: institutionId,
            });
            // success handling here
            alert("Plaid integration successful!");
            } catch (err) {
            console.error(
                "Exchange-token error:",
                err.response?.data || err.message
            );
            alert(
                JSON.stringify(err.response?.data ?? err.message, null, 2)
            );
            }
        },
        onExit: (error, metadata) => {
            if (error) console.error("User exited Plaid Link with error:", error);
        },
    });


  const getLinkToken = async () => {
    try {
      const response = await api.post('/integrations/plaid/link-token/');
        if (response.status === 200) {
          setLinkToken(response.data.link_token);
        }
    } catch (error) {
      console.error('Error fetching link token:', error);
      return null;
    }
  }

  const testTransactions = async () => {
    try {
      const response = await api.post('/integrations/plaid/sync/');
      if (response.status === 200) {
        alert('Test transactions created successfully!');
      }
    } catch (error) {
      console.error('Error creating test transactions:', error);
      alert('Failed to create test transactions.');
    }
  }

  const testSprints = async () => {
    try {
      const response = await api.get('/sprints/current/');
      if (response.status === 200) {
        alert('Test sprints created successfully!');
      }
    } catch (error) {
      console.error('Error creating test sprints:', error);
      alert('Failed to create test sprints.');
    }
  }

  return (
    <div>
      <h2>Integrations</h2>
        {error && <div>Error: {error.message}</div>}
        <button onClick={() => open()} disabled={!ready}>Connect to Plaid</button>
        <button onClick={testTransactions}>Create Test Transactions</button>
        <button onClick={testSprints}>Create Test Sprints</button>

    </div>
  )
}

export default Integrations