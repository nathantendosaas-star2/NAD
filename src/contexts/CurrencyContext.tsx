import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  exchangeRate: number; // Rate from KES to target currency
  loading: boolean;
  countryCode: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static exchange rates for simplicity (in a real app, fetch from an API)
const EXCHANGE_RATES: Record<string, number> = {
  KES: 1,
  USD: 0.0077, // Example: 1 KES = 0.0077 USD
  EUR: 0.0071,
  GBP: 0.0061,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  KES: 'KShs',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('KES');
  const [symbol, setSymbol] = useState('KShs');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [countryCode, setCountryCode] = useState('KE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Fetch from our local proxy to avoid CORS/network issues
        const response = await fetch('/api/location');
        if (!response.ok) throw new Error('Proxy error');
        
        const data = await response.json();
        
        if (data.currency) {
          const detectedCurrency = data.currency;
          const rate = EXCHANGE_RATES[detectedCurrency] || EXCHANGE_RATES['USD'];
          const detectedSymbol = CURRENCY_SYMBOLS[detectedCurrency] || '$';
          
          setCurrency(detectedCurrency);
          setSymbol(detectedSymbol);
          setExchangeRate(rate);
          setCountryCode(data.country_code || 'KE');
        }
      } catch (error) {
        console.error('Failed to detect location/currency:', error);
        // Default to KES if detection fails
        setCurrency('KES');
        setSymbol('KShs');
        setExchangeRate(1);
        setCountryCode('KE');
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, symbol, exchangeRate, loading, countryCode }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const formatPrice = (amount: number, symbol: string, exchangeRate: number, showDecimals: boolean = true) => {
  const converted = amount * exchangeRate;
  if (symbol === 'KShs') {
    return `${symbol} ${Math.round(converted).toLocaleString()}${showDecimals ? '.00' : ''}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { 
    minimumFractionDigits: showDecimals ? 2 : 0, 
    maximumFractionDigits: 2 
  })}`;
};
