import { useState, useEffect } from 'react';

const useScanLimit = () => {
  const [scanCount, setScanCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const MAX_FREE_SCANS = 2;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Load scan count from localStorage
    const savedCount = localStorage.getItem('freeScanCount');
    if (savedCount) {
      setScanCount(parseInt(savedCount, 10));
    }
  }, []);

  const incrementScanCount = () => {
    const newCount = scanCount + 1;
    setScanCount(newCount);
    localStorage.setItem('freeScanCount', newCount.toString());
  };

  const canScan = () => {
    return isLoggedIn || scanCount < MAX_FREE_SCANS;
  };

  const getRemainingScans = () => {
    if (isLoggedIn) return Infinity; // Unlimited scans for logged in users
    return Math.max(0, MAX_FREE_SCANS - scanCount);
  };

  const resetFreeScans = () => {
    setScanCount(0);
    localStorage.removeItem('freeScanCount');
  };

  return {
    scanCount,
    canScan,
    getRemainingScans,
    incrementScanCount,
    isLoggedIn,
    setIsLoggedIn,
    resetFreeScans
  };
};

export default useScanLimit;