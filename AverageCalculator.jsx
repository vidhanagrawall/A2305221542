import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/numbers/'; // Replace with your microservice URL

function AverageCalculator() {
  const [numberType, setNumberType] = useState('p');
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNumberTypeChange = (event) => {
    setNumberType(event.target.value);
  };

  const fetchAverage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(BASE_URL + numberType);
      setWindowPrevState(response.data.windowPrevState);
      setWindowCurrState(response.data.windowCurrState);
      setFetchedNumbers(response.data.numbers);
      setAverage(response.data.avg);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAverage();
  }, [numberType]); // Re-fetch data on number type change

  const renderResultsTable = () => {
    if (windowPrevState.length === 0) {
      return null; // No data yet
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Previous Window</th>
            <th>Current Window</th>
            <th>Fetched Numbers</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{windowPrevState.join(', ')}</td>
            <td>{windowCurrState.join(', ')}</td>
            <td>{fetchedNumbers.join(', ')}</td>
            <td>{average}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="average-calculator">
      <h1>Average Calculator</h1>
      <select value={numberType} onChange={handleNumberTypeChange}>
        <option value="p">Prime Numbers</option>
        <option value="f">Fibonacci Numbers</option>
        <option value="e">Even Numbers</option>
        <option value="r">Random Numbers</option>
      </select>
      <button onClick={fetchAverage} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Calculate Average'}
      </button>
      {error && <p className="error">{error}</p>}
      {renderResultsTable()}
    </div>
  );
}

export default AverageCalculator;
