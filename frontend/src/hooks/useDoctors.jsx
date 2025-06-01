import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoints.doctors);

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const bodyData = await res.json();
        setDoctors(bodyData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { doctors, loading, error, refetch };
}
