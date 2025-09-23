// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js'; // Import html2pdf for PDF generation
import TextResult from '../subComponents/TextResult';
import TableResult from '../subComponents/TableResult';
import { sendQuery } from '../../../mcp/sendquery'; // a new helper that wraps the API call


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [resultsHistory, setResultsHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const resultsRef = useRef(null); // Ref for the results section to export

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery((prevQuery) => prevQuery + ' ' + transcript);
      };

      recognition.onend = () => setIsListening(false);

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleCheckboxChange = (e) => setSelectedFormat(e.target.value);

  const handleSpeechToText = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    console.log("handleSearch");
    e.preventDefault();
    if (query.trim() === '' || !selectedFormat) return;
  
    const newEntry = { format: selectedFormat, data: null, query };
    setResultsHistory((prevResults) => [newEntry, ...prevResults]);
  
    try {
      const response = await sendQuery(query);
      const data = response.content;// assuming response has a .content field
  
      setResultsHistory((prevResults) => {
        const updatedResults = [...prevResults];
        updatedResults[0] = { ...updatedResults[0], data };
        return updatedResults;
      });
    } catch (error) {
      console.error('Error sending query to MCP client:', error);
    }
  
    setQuery('');
    setSelectedFormat('');
  };

  // Voice recognition logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prevQuery) => `${prevQuery} ${transcript}`);
    };

    recognition.start();
  };
  const handleExportToPDF = () => {
    const element = resultsRef.current;
    const options = {
      margin: 0.5,
      filename: 'SearchHistory.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="flex flex-col h-screen w-full text-gray-700 p-6">
      <div ref={resultsRef} className="flex-1 overflow-auto p-8">
        <h1 className="mb-1 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">Parakeet Search</h1>

        {/* Search Results */}
        <div className=" rounded-lg p-6 max-w-full mx-auto text-gray-800 space-y-4 overflow-y-auto h-[75vh]">
          {resultsHistory.length === 0 && (
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 text-center">Your search results will appear here...</p>
          )}
          
          {resultsHistory.map((result, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg mb-4">
              <div className="bg-gray-200 px-4 py-2 w-full rounded-t-lg text-gray-500 italic">
                User Query: "{result.query}"
              </div>
              <div className="p-4 pt-6">
                {result.data ? (
                  <>
                    {result.format === 'text' && <TextResult data={result.data} />}
                    {result.format === 'table' && <TableResult data={result.data} />}
                  </>
                ) : (
                  <p className="text-gray-400 italic">Loading result...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Format Selection, Search Bar, Speech-to-Text, and Export to PDF Button on the Same Line */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-3xl  rounded-t-lg p-6 fixed bottom-0 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center gap-4">
          {/* Format Selection */}
          <div className="flex items-center gap-4">
            {['text', 'table', 'graph'].map((format) => (
              <label key={format} className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={selectedFormat === format}
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedFormat === format ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-600'
                  } hover:bg-gray-400 transition`}
                >
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </span>
              </label>
            ))}
          </div>

          {/* Search Input and Voice Button */}
          <div className="flex flex-grow items-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter your query..."
              className="flex-grow bg-white text-gray-800 rounded-lg py-2 px-4 shadow-none transition focus:outline-none focus:ring focus:ring-gray-200"
            />

            {/* Microphone Button */}
            <button
              type="button"
              onClick={startListening}
              className={`ml-2 bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition ${
                isListening ? 'bg-blue-500 text-white' : ''
              }`}
              title="Use voice input"
            >
              🎤
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition duration-200 shadow-md"
            disabled={!selectedFormat}
          >
            Search
          </button>

          {/* Speech-to-Text Button */}
          {/* <button
            type="button"
            onClick={handleSpeechToText}
            className={`${
              isListening ? 'bg-red-600' : 'bg-green-600'
            } text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md`}
          >
            {isListening ? 'Stop' : 'Talk'}
          </button> */}

          {/* Export to PDF Button */}
          <button
            type="button"
            onClick={handleExportToPDF}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
          >
            PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;