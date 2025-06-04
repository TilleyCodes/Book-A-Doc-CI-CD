import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import magnifyingGlass from '../assets/search-icon.png';
import { endpoints } from '../config/api';
import '../styles/searchBar.css';

export function SearchBar() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [medicalCentres, setMedicalCentres] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch(endpoints.doctors);
        if (!res.ok) {
          throw new Error(`Failed to fetch doctors: ${res.status}`);
        }
        const bodyData = await res.json();
        const doctorAndSpecialty = bodyData.map((doc) => (
          `${doc.doctorName} (${doc.specialtyId.specialtyName})`
        ));
        setDoctors(doctorAndSpecialty);
      } catch (error) {
        // Handle error silently - search will just have fewer suggestions
      }
    }

    async function fetchMedicalCentres() {
      try {
        const res = await fetch(endpoints.medicalCentres);
        if (!res.ok) {
          throw new Error(`Failed to fetch medical centers: ${res.status}`);
        }
        const bodyData = await res.json();
        const centreNames = bodyData.map((centre) => centre.medicalCentreName);
        setMedicalCentres(centreNames);
      } catch (error) {
        // Handle error silently - search will just have fewer suggestions
      }
    }

    fetchDoctors();
    fetchMedicalCentres();
  }, []);

  useEffect(() => {
    if (doctors.includes(input) || medicalCentres.includes(input)) {
      setSuggestions([]);
      return;
    }
    if (!input) {
      setSuggestions([]);
      return;
    }

    const filteredDocs = doctors.filter((docString) => (
      docString.toLowerCase().includes(input.toLowerCase())
    ));
    const filteredCentres = medicalCentres.filter((centreString) => (
      centreString.toLowerCase().includes(input.toLowerCase())
    ));
    const filtered = [...filteredDocs, ...filteredCentres];
    setSuggestions(filtered);
  }, [input, doctors, medicalCentres]);

  const handleSelect = (data) => {
    setInput(data);
    setSelected(data);
    setSuggestions([]);

    if (data.includes(' (')) {
      // This is a doctor selection
      const doctorName = data.split(' (')[0];
      // Navigate to doctors page with search query parameter - same behavior as GP page search
      navigate(`/doctors?search=${encodeURIComponent(doctorName)}&exact=true`);
    } else {
      // Medical centre selection
      navigate(`/medical-centres?search=${encodeURIComponent(data)}&exact=true`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="search-container">
      <input
        id="searchBar"
        name="searchBar"
        type="text"
        placeholder="Search GP, Specialty or Medical Centre"
        className="input-field"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search for doctors or medical centers"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
      />
      <button
        type="button"
        className="home-search-button"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <img
          className="input-icon"
          alt="magnifying glass icon"
          src={magnifyingGlass}
        />
      </button>
      {suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          className="dropdown"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((data) => (
            <li
              key={data}
              onClick={() => handleSelect(data)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(data);
                }
              }}
              role="option"
              tabIndex={0}
              aria-selected={data === selected}
            >
              {data}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
