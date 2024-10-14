"use client"; // Ensure this runs in the client-side environment

import { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import DropdownField from '../components/DropdownField';

export default function FeedingCalculator() {
  // State variables
  const [ageRange, setAgeRange] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [feedsPerDay, setFeedsPerDay] = useState('');
  const [mlPerDay, setMlPerDay] = useState(null);
  const [mlPerDayUnit, setMlPerDayUnit] = useState('ml');
  const [mlPerDayInMl, setMlPerDayInMl] = useState(null); // Raw ml value
  const [mlsPerFeed, setMlsPerFeed] = useState(null);
  const [mlsPerFeedUnit, setMlsPerFeedUnit] = useState('ml');
  const [error, setError] = useState(null);

  const ageRangeOptions = [
    { value: 'newborn', label: 'Newborn' },
    { value: '<1-month', label: 'Less than 1 Month' },
    { value: '1-3-months', label: '1-3 Months' },
    { value: '3-6-months', label: '3-6 Months' },
    { value: '6-9-months', label: '6-9 Months' },
  ];

  // Helper functions for conversions
  const convertWeightToKg = (weight, unit) => {
    return unit === 'lb' ? (parseFloat(weight) * 0.453592).toFixed(2) : parseFloat(weight);
  };

  const convertMl = (ml, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return ml;
    return toUnit === 'oz' ? (ml * 0.033814).toFixed(2) : (ml / 0.033814).toFixed(2);
  };

  // Milk calculation function
  const calculateMilkPerDay = async () => {
    if (!ageRange || !weight) {
      clearCalculatedFields();
      return;
    }

    try {
      const weightInKg = convertWeightToKg(weight, weightUnit);
      const res = await fetch('/api/calculate-feeding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageRange, weight: parseFloat(weightInKg), feedsPerDay: feedsPerDay || 1 }),
      });

      const data = await res.json();
      if (res.ok) {
        const milkInMl = parseFloat(data.mlPerDay).toFixed(2);
        setMlPerDayInMl(milkInMl);
        setMlPerDay(convertMl(milkInMl, 'ml', mlPerDayUnit));
        setError(null);
      } else {
        handleError(data.error);
      }
    } catch {
      handleError('Failed to calculate. Please try again.');
    }
  };

  // Utility to clear calculated fields
  const clearCalculatedFields = () => {
    setMlPerDay(null);
    setMlPerDayInMl(null);
    setMlsPerFeed(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    clearCalculatedFields();
  };

  // Side effects for various triggers
  useEffect(() => {
    calculateMilkPerDay();
  }, [ageRange, weight]);

  useEffect(() => {
    if (mlPerDayInMl !== null) {
      setMlPerDay(convertMl(mlPerDayInMl, 'ml', mlPerDayUnit));
    }
  }, [mlPerDayUnit]);

  useEffect(() => {
    if (mlPerDayInMl !== null && feedsPerDay > 0) {
      const milkPerFeed = (mlPerDayInMl / feedsPerDay).toFixed(2);
      setMlsPerFeed(convertMl(milkPerFeed, 'ml', mlsPerFeedUnit));
    } else {
      setMlsPerFeed(null);
    }
  }, [mlPerDayInMl, feedsPerDay, mlsPerFeedUnit]);

  // Render the form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <form>
          <DropdownField
            label="Age Range"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            options={ageRangeOptions}
          />

          <InputField
            label="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            unit={weightUnit}
            units={['kg', 'lb']}
            onUnitChange={(e) => setWeightUnit(e.target.value)}
            type="number"
            step="any"
          />

          <InputField
            label="Total Milk per Day"
            value={mlPerDay !== null ? mlPerDay : ''}
            readOnly
            unit={mlPerDayUnit}
            units={['ml', 'oz']}
            onUnitChange={(e) => setMlPerDayUnit(e.target.value)}
          />

          <InputField
            label="Feeds per Day"
            value={feedsPerDay}
            onChange={(e) => setFeedsPerDay(e.target.value)}
            type="number"
            step="1"
            min="1"
            unit={null}
          />

          <InputField
            label="Milk per Feed"
            value={mlsPerFeed !== null ? mlsPerFeed : ''}
            readOnly
            unit={mlsPerFeedUnit}
            units={['ml', 'oz']}
            onUnitChange={(e) => setMlsPerFeedUnit(e.target.value)}
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
