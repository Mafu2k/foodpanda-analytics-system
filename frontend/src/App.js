import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('zamowienia');
  const [activeSubTab, setActiveSubTab] = useState({
    zamowienia: 'najdrozsze',
    klienci: 'top',
    restauracje: 'liczba',
    oceny: 'restauracje',
    lojalnosc: 'statystyki'
  });
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'dostawy') {
      fetchTabData(activeTab, activeSubTab[activeTab]);
    } else {
      fetchDostawyData();
    }
  }, [activeTab, activeSubTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/statystyki-ogolne`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const fetchTabData = async (tab, subTab) => {
    setLoading(true);
    const mapping = {
      'zamowienia-najdrozsze': '/api/zamowienia/najdrozsze',
      'zamowienia-platnosci': '/api/zamowienia/platnosci',
      'zamowienia-daty': '/api/zamowienia/daty',
      'zamowienia-dania': '/api/zamowienia/popularne-dania',
      'klienci-top': '/api/klienci/top',
      'klienci-plec': '/api/klienci/plec',
      'klienci-wiek': '/api/klienci/wiek',
      'klienci-miasto': '/api/klienci/miasto',
      'restauracje-liczba': '/api/restauracje/liczba',
      'restauracje-wartosc': '/api/restauracje/wartosc',
      'restauracje-srednia': '/api/restauracje/srednia',
      'oceny-restauracje': '/api/oceny/restauracje',
      'oceny-rozklad': '/api/oceny/rozklad',
      'oceny-dania': '/api/oceny/dania',
      'lojalnosc-statystyki': '/api/lojalnosc/statystyki',
      'lojalnosc-top': '/api/lojalnosc/top-klienci',
      'lojalnosc-aktywnosc': '/api/lojalnosc/aktywnosc'
    };

    try {
      const url = mapping[`${tab}-${subTab}`];
      const response = await fetch(`${API_URL}${url}`);
      const result = await response.json();
      setData(prev => ({ ...prev, [`${tab}-${subTab}`]: result }));
    } catch (error) {
      console.error('Błąd:', error);
    }
    setLoading(false);
  };

  const fetchDostawyData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/dostawy/statusy`);
      const result = await response.json();
      setData(prev => ({ ...prev, 'dostawy': result }));
    } catch (error) {
      console.error('Błąd:', error);
    }
    setLoading(false);
  };

  const changeSubTab = (tab, subTab) => {
    setActiveSubTab(prev => ({ ...prev, [tab]: subTab }));
  };

  const renderTable = (tab, subTab) => {
    const key = tab === 'dostawy' ? 'dostawy' : `${tab}-${subTab}`;
    const tableData = data[key];

    if (!tableData || loading) {
      return <div className="loading">⏳ Ładowanie danych...</div>;
    }

    if (key === 'lojalnosc-statystyki') {
      return (
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Średnia częstotliwość</div>
            <div className="info-value">{tableData.srednia_czestotliwosc.toFixed(2)}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Średnie punkty</div>
            <div className="info-value">{tableData.srednie_punkty.toFixed(2)}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Aktywni</div>
            <div className="info-value">{tableData.aktywni}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Nieaktywni</div>
            <div className="info-value">{tableData.nieaktywni}</div>
          </div>
        </div>
      );
    }

    const headers = getHeaders(key);
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {getRowData(key, row).map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getHeaders = (key) => {
    const headers = {
      'zamowienia-najdrozsze': ['ID Zam.', 'ID Klienta', 'Restauracja', 'Danie', 'Wartość'],
      'zamowienia-platnosci': ['Metoda', 'Liczba', 'Wartość'],
      'zamowienia-daty': ['Data', 'Liczba', 'Wartość'],
      'zamowienia-dania': ['Danie', 'Kategoria', 'Zamówień'],
      'klienci-top': ['ID', 'Płeć', 'Wiek', 'Miasto', 'Zamówień', 'Wartość'],
      'klienci-plec': ['Płeć', 'Klienci', 'Zamówienia', 'Wartość'],
      'klienci-wiek': ['Grupa', 'Klienci', 'Zamówienia', 'Wartość'],
      'klienci-miasto': ['Miasto', 'Klienci', 'Zamówienia', 'Wartość'],
      'restauracje-liczba': ['Restauracja', 'Zamówień'],
      'restauracje-wartosc': ['Restauracja', 'Wartość'],
      'restauracje-srednia': ['Restauracja', 'Zamówień', 'Średnia'],
      'oceny-restauracje': ['Restauracja', 'Średnia ocena', 'Liczba ocen'],
      'oceny-rozklad': ['Ocena', 'Liczba', 'Procent'],
      'oceny-dania': ['Danie', 'Kategoria', 'Średnia', 'Ocen'],
      'lojalnosc-top': ['ID', 'Płeć', 'Miasto', 'Punkty', 'Częst.', 'Status'],
      'lojalnosc-aktywnosc': ['Status', 'Liczba', 'Procent', 'Śr. częst.'],
      'dostawy': ['Status', 'Liczba', 'Procent']
    };
    return headers[key] || [];
  };

  const getRowData = (key, row) => {
    const formatters = {
      'zamowienia-najdrozsze': (r) => [r.id_zamowienia, r.id_klienta, r.restauracja, r.danie, `${r.wartosc.toFixed(2)} PLN`],
      'zamowienia-platnosci': (r) => [r.metoda, r.liczba, `${r.wartosc.toFixed(2)} PLN`],
      'zamowienia-daty': (r) => [r.data, r.liczba, `${r.wartosc.toFixed(2)} PLN`],
      'zamowienia-dania': (r) => [r.danie, r.kategoria, r.liczba_zamowien],
      'klienci-top': (r) => [r.id, r.plec, r.wiek, r.miasto, r.liczba_zamowien, `${r.wartosc.toFixed(2)} PLN`],
      'klienci-plec': (r) => [r.plec, r.liczba_klientow, r.liczba_zamowien, `${r.wartosc.toFixed(2)} PLN`],
      'klienci-wiek': (r) => [r.grupa, r.liczba_klientow, r.liczba_zamowien, `${r.wartosc.toFixed(2)} PLN`],
      'klienci-miasto': (r) => [r.miasto, r.liczba_klientow, r.liczba_zamowien, `${r.wartosc.toFixed(2)} PLN`],
      'restauracje-liczba': (r) => [r.restauracja, r.liczba_zamowien],
      'restauracje-wartosc': (r) => [r.restauracja, `${r.wartosc.toFixed(2)} PLN`],
      'restauracje-srednia': (r) => [r.restauracja, r.liczba, `${r.srednia.toFixed(2)} PLN`],
      'oceny-restauracje': (r) => [r.restauracja, `${r.srednia_ocena.toFixed(2)} ⭐`, r.liczba_ocen],
      'oceny-rozklad': (r) => [`${r.ocena} ⭐`, r.liczba, `${r.procent}%`],
      'oceny-dania': (r) => [r.danie, r.kategoria, `${r.srednia_ocena.toFixed(2)} ⭐`, r.liczba_ocen],
      'lojalnosc-top': (r) => [r.id, r.plec, r.miasto, r.punkty, r.czestotliwosc, r.status],
      'lojalnosc-aktywnosc': (r) => [r.status, r.liczba, `${r.procent}%`, r.srednia_czestotliwosc.toFixed(2)],
      'dostawy': (r) => [r.status, r.liczba, `${r.procent}%`]
    };
    return formatters[key] ? formatters[key](row) : [];
  };

  return (
    <div className="App">
      <header className="header">
        <h1>System Analizy Zamówień FoodPanda</h1>
        <p className="subtitle">Dashboard analityczny</p>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Liczba zamówień</div>
            <div className="stat-value">{stats.liczba_zamowien.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Wartość zamówień</div>
            <div className="stat-value">{stats.wartosc_zamowien.toFixed(2)} PLN</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Liczba klientów</div>
            <div className="stat-value">{stats.liczba_klientow.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Liczba restauracji</div>
            <div className="stat-value">{stats.liczba_restauracji.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Średnia wartość</div>
            <div className="stat-value">{stats.srednia_wartosc.toFixed(2)} PLN</div>
          </div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${activeTab === 'zamowienia' ? 'active' : ''}`} onClick={() => setActiveTab('zamowienia')}>
          📦 Zamówienia
        </button>
        <button className={`tab ${activeTab === 'klienci' ? 'active' : ''}`} onClick={() => setActiveTab('klienci')}>
          👥 Klienci
        </button>
        <button className={`tab ${activeTab === 'restauracje' ? 'active' : ''}`} onClick={() => setActiveTab('restauracje')}>
          🍽️ Restauracje
        </button>
        <button className={`tab ${activeTab === 'dostawy' ? 'active' : ''}`} onClick={() => setActiveTab('dostawy')}>
          🚚 Dostawy
        </button>
        <button className={`tab ${activeTab === 'oceny' ? 'active' : ''}`} onClick={() => setActiveTab('oceny')}>
          ⭐ Oceny
        </button>
        <button className={`tab ${activeTab === 'lojalnosc' ? 'active' : ''}`} onClick={() => setActiveTab('lojalnosc')}>
          💎 Lojalność
        </button>
      </div>

      <div className="content-panel">
        {activeTab === 'zamowienia' && (
          <>
            <h2>📦 Analiza Zamówień</h2>
            <div className="subtabs">
              <button className={`subtab ${activeSubTab.zamowienia === 'najdrozsze' ? 'active' : ''}`} onClick={() => changeSubTab('zamowienia', 'najdrozsze')}>Najdroższe</button>
              <button className={`subtab ${activeSubTab.zamowienia === 'platnosci' ? 'active' : ''}`} onClick={() => changeSubTab('zamowienia', 'platnosci')}>Płatności</button>
              <button className={`subtab ${activeSubTab.zamowienia === 'daty' ? 'active' : ''}`} onClick={() => changeSubTab('zamowienia', 'daty')}>Według dat</button>
              <button className={`subtab ${activeSubTab.zamowienia === 'dania' ? 'active' : ''}`} onClick={() => changeSubTab('zamowienia', 'dania')}>Popularne dania</button>
            </div>
            {renderTable('zamowienia', activeSubTab.zamowienia)}
          </>
        )}

        {activeTab === 'klienci' && (
          <>
            <h2>👥 Analiza Klientów</h2>
            <div className="subtabs">
              <button className={`subtab ${activeSubTab.klienci === 'top' ? 'active' : ''}`} onClick={() => changeSubTab('klienci', 'top')}>Top klienci</button>
              <button className={`subtab ${activeSubTab.klienci === 'plec' ? 'active' : ''}`} onClick={() => changeSubTab('klienci', 'plec')}>Według płci</button>
              <button className={`subtab ${activeSubTab.klienci === 'wiek' ? 'active' : ''}`} onClick={() => changeSubTab('klienci', 'wiek')}>Według wieku</button>
              <button className={`subtab ${activeSubTab.klienci === 'miasto' ? 'active' : ''}`} onClick={() => changeSubTab('klienci', 'miasto')}>Według miasta</button>
            </div>
            {renderTable('klienci', activeSubTab.klienci)}
          </>
        )}

        {activeTab === 'restauracje' && (
          <>
            <h2>🍽️ Analiza Restauracji</h2>
            <div className="subtabs">
              <button className={`subtab ${activeSubTab.restauracje === 'liczba' ? 'active' : ''}`} onClick={() => changeSubTab('restauracje', 'liczba')}>Wg liczby</button>
              <button className={`subtab ${activeSubTab.restauracje === 'wartosc' ? 'active' : ''}`} onClick={() => changeSubTab('restauracje', 'wartosc')}>Wg wartości</button>
              <button className={`subtab ${activeSubTab.restauracje === 'srednia' ? 'active' : ''}`} onClick={() => changeSubTab('restauracje', 'srednia')}>Średnia</button>
            </div>
            {renderTable('restauracje', activeSubTab.restauracje)}
          </>
        )}

        {activeTab === 'dostawy' && (
          <>
            <h2>🚚 Analiza Dostaw</h2>
            {renderTable('dostawy', '')}
          </>
        )}

        {activeTab === 'oceny' && (
          <>
            <h2>⭐ Ranking Ocen</h2>
            <div className="subtabs">
              <button className={`subtab ${activeSubTab.oceny === 'restauracje' ? 'active' : ''}`} onClick={() => changeSubTab('oceny', 'restauracje')}>Najlepsze restauracje</button>
              <button className={`subtab ${activeSubTab.oceny === 'rozklad' ? 'active' : ''}`} onClick={() => changeSubTab('oceny', 'rozklad')}>Rozkład ocen</button>
              <button className={`subtab ${activeSubTab.oceny === 'dania' ? 'active' : ''}`} onClick={() => changeSubTab('oceny', 'dania')}>Najlepsze dania</button>
            </div>
            {renderTable('oceny', activeSubTab.oceny)}
          </>
        )}

        {activeTab === 'lojalnosc' && (
          <>
            <h2>💎 Program Lojalnościowy</h2>
            <div className="subtabs">
              <button className={`subtab ${activeSubTab.lojalnosc === 'statystyki' ? 'active' : ''}`} onClick={() => changeSubTab('lojalnosc', 'statystyki')}>Statystyki</button>
              <button className={`subtab ${activeSubTab.lojalnosc === 'top' ? 'active' : ''}`} onClick={() => changeSubTab('lojalnosc', 'top')}>Top klienci</button>
              <button className={`subtab ${activeSubTab.lojalnosc === 'aktywnosc' ? 'active' : ''}`} onClick={() => changeSubTab('lojalnosc', 'aktywnosc')}>Aktywność</button>
            </div>
            {renderTable('lojalnosc', activeSubTab.lojalnosc)}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
