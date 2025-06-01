import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

export function useMedicalCentres() {
  const [medicalCentres, setMedicalCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchMedicalCentres = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoints.medicalCentres);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMedicalCentres(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load medical centres: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalCentres();
  }, [refetchTrigger]);

  // Function to manually trigger a refetch
  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { medicalCentres, loading, error, refetch };
}
