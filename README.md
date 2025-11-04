# 📊 FoodPanda Analytics System

Kompleksowy system analityczny do zarządzania i analizy zamówień FoodPanda. Aplikacja webowa zbudowana z wykorzystaniem **React** (frontend) i **Flask** (backend) z bazą danych **MySQL**.

## 🎯 Funkcjonalności

### 📦 Analiza Zamówień
- Najdroższe zamówienia
- Analiza według metod płatności
- Zamówienia według dat
- Najpopularniejsze dania

### 👥 Analiza Klientów
- Top klienci według wartości zamówień
- Statystyki według płci
- Statystyki według grup wiekowych
- Analiza według miast

### 🍽️ Analiza Restauracji
- Ranking według liczby zamówień
- Ranking według wartości sprzedaży
- Średnia wartość zamówienia

### 🚚 Analiza Dostaw
- Statusy dostaw
- Statystyki realizacji zamówień

### ⭐ Oceny
- Najlepsze restauracje (min. 5 ocen)
- Rozkład ocen 1-5 gwiazdek
- Najlepiej ocenione dania

### 💎 Program Lojalnościowy
- Statystyki programu
- Top klienci według punktów
- Analiza aktywności klientów

## 🛠️ Technologie

### Backend
- **Flask 3.0.0** - Framework Python do budowy API
- **Flask-CORS** - Obsługa Cross-Origin Resource Sharing
- **PyMySQL** - Connector do MySQL
- **Python 3.x**

### Frontend
- **React 19.x** - Biblioteka JavaScript do budowy UI
- **React Hooks** - useState, useEffect
- **CSS3** - Stylowanie (stonowane kolory: szary, niebieski, biały)
- **Fetch API** - Komunikacja z backendem

### Baza Danych
- **MySQL/MariaDB** - Relacyjna baza danych
- Struktura tabel: `orders`, `customers`, `restaurants`, `dishes`, `ratings`, `loyalty`

## 📁 Struktura Projektu

```
foodpanda-analytics-system/
├── backend/                 # Flask API
│   ├── app.py              # Główna aplikacja Flask
│   └── requirements.txt    # Zależności Python
├── frontend/               # React App
│   ├── src/
│   │   ├── App.js         # Główny komponent React
│   │   ├── App.css        # Style aplikacji
│   │   └── index.js       # Entry point
│   ├── public/            # Pliki statyczne
│   └── package.json       # Zależności Node.js
├── database/              # Skrypty SQL 
├── docs/                  # Dokumentacja
└── README.md             # Ten plik
```

## 🚀 Instalacja

### Wymagania
- Python 3.8+
- Node.js 16+
- MySQL 5.7+ / MariaDB 10.3+
- Git

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/YOUR_USERNAME/foodpanda-analytics-system.git
cd foodpanda-analytics-system
```

### 2. Konfiguracja bazy danych

Utwórz bazę danych MySQL:

```sql
CREATE DATABASE foodpanda_db;
```

Zaimportuj dane (jeśli masz plik SQL) lub utwórz tabele:

```sql
-- Tabele: orders, customers, restaurants, dishes, ratings, loyalty
-- (struktura według Twojego schematu bazy danych)
```

### 3. Instalacja backendu (Flask)

```bash
cd backend
pip install -r requirements.txt
```

**Konfiguracja połączenia z bazą danych:**

Edytuj `backend/app.py` i zaktualizuj dane połączenia:

```python
def get_db():
    return pymysql.connect(
        host="localhost",      # Adres serwera MySQL
        user="root",           # Użytkownik MySQL
        password="",           # Hasło MySQL
        database="foodpanda_db",  # Nazwa bazy danych
        charset='utf8mb4'
    )
```

**Uruchomienie serwera Flask:**

```bash
python app.py
```

Serwer uruchomi się na `http://localhost:5000`

### 4. Instalacja frontendu (React)

```bash
cd frontend
npm install
```

**Uruchomienie aplikacji React:**

```bash
npm start
```

Aplikacja uruchomi się na `http://localhost:3000`

## 🎨 Design

Aplikacja wykorzystuje stonowaną paletę kolorów:

- **Tło główne:** `#f5f7fa` (jasny szary)
- **Kolor primary:** `#2c5282` (ciemny niebieski)
- **Kolor akcent:** `#4299e1` (jasny niebieski)
- **Tekst:** `#2d3748` (ciemny szary)
- **Tekst secondary:** `#718096` (średni szary)

## 📡 API Endpoints

### Statystyki Ogólne
- `GET /api/statystyki-ogolne` - Podstawowe statystyki systemu

### Zamówienia
- `GET /api/zamowienia/najdrozsze` - Top 10 najdroższych zamówień
- `GET /api/zamowienia/platnosci` - Analiza według metod płatności
- `GET /api/zamowienia/daty` - Ostatnie 20 dni zamówień
- `GET /api/zamowienia/popularne-dania` - Top 15 najpopularniejszych dań

### Klienci
- `GET /api/klienci/top` - Top 10 klientów
- `GET /api/klienci/plec` - Statystyki według płci
- `GET /api/klienci/wiek` - Statystyki według grup wiekowych
- `GET /api/klienci/miasto` - Statystyki według miast

### Restauracje
- `GET /api/restauracje/liczba` - Ranking według liczby zamówień
- `GET /api/restauracje/wartosc` - Ranking według wartości
- `GET /api/restauracje/srednia` - Średnia wartość zamówienia

### Dostawy
- `GET /api/dostawy/statusy` - Statusy dostaw

### Oceny
- `GET /api/oceny/restauracje` - Najlepsze restauracje
- `GET /api/oceny/rozklad` - Rozkład ocen
- `GET /api/oceny/dania` - Najlepiej ocenione dania

### Lojalność
- `GET /api/lojalnosc/statystyki` - Statystyki programu lojalnościowego
- `GET /api/lojalnosc/top-klienci` - Top 20 klientów według punktów
- `GET /api/lojalnosc/aktywnosc` - Aktywność klientów

## 🔧 Konfiguracja

### Backend (Flask)

W pliku `backend/app.py` możesz skonfigurować:
- Host i port serwera (domyślnie: `0.0.0.0:5000`)
- Parametry połączenia z bazą danych
- Limity wyników zapytań SQL

### Frontend (React)

W pliku `frontend/src/App.js` możesz zmienić:
- URL API (domyślnie: `http://localhost:5000`)
- Kolory i style w `App.css`

## 📊 Wymagania Systemowe

### Minimalne
- 2 GB RAM
- 1 GHz CPU
- 500 MB wolnego miejsca na dysku

### Zalecane
- 4 GB RAM
- 2 GHz CPU (2 rdzenie)
- 1 GB wolnego miejsca na dysku
- SSD dla szybszych zapytań do bazy

## 🐛 Rozwiązywanie Problemów

### Problem: Flask nie uruchamia się
**Rozwiązanie:**
```bash
pip install --upgrade flask flask-cors pymysql
python app.py
```

### Problem: React nie łączy się z API
**Rozwiązanie:**
1. Sprawdź czy Flask działa na porcie 5000
2. Sprawdź konsolę przeglądarki (F12) czy nie ma błędów CORS
3. Upewnij się że `flask-cors` jest zainstalowany

### Problem: Błąd połączenia z bazą danych
**Rozwiązanie:**
1. Sprawdź czy MySQL działa
2. Zweryfikuj dane logowania w `app.py`
3. Upewnij się że baza `foodpanda_db` istnieje

## 📝 Licencja

Ten projekt jest udostępniony na licencji MIT.

## 👥 Autorzy

- **Łukasz** - Backend (Flask) & Frontend (React)

## 🤝 Kontakt

W razie pytań lub problemów, otwórz Issue na GitHub.

## 📸 Screenshots

<img width="1845" height="949" alt="image" src="https://github.com/user-attachments/assets/2ea47b1e-d1e8-4a73-a552-f4476f55419a" />


## ⭐ Wsparcie

Jeśli projekt Ci się podoba, zostaw ⭐ na GitHub!

---

**Zbudowano z ❤️ używając React + Flask**
