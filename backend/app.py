from flask import Flask, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

def get_db():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="foodpanda_db",
        charset='utf8mb4'
    )

@app.route('/api/statystyki-ogolne')
def statystyki_ogolne():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM orders")
    liczba_zamowien = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(price * quantity) FROM orders")
    wartosc_zamowien = float(cursor.fetchone()[0] or 0)

    cursor.execute("SELECT COUNT(*) FROM customers")
    liczba_klientow = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM restaurants")
    liczba_restauracji = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(price * quantity) FROM orders")
    srednia_wartosc = float(cursor.fetchone()[0] or 0)

    cursor.close()
    conn.close()

    return jsonify({
        'liczba_zamowien': liczba_zamowien,
        'wartosc_zamowien': wartosc_zamowien,
        'liczba_klientow': liczba_klientow,
        'liczba_restauracji': liczba_restauracji,
        'srednia_wartosc': srednia_wartosc
    })

@app.route('/api/zamowienia/najdrozsze')
def najdrozsze_zamowienia():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT o.id, c.id, r.name, d.name, (o.price * o.quantity) as total
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN restaurants r ON o.restaurant_id = r.id
        JOIN dishes d ON o.dish_id = d.id
        ORDER BY total DESC
        LIMIT 10
    """)
    result = [{'id_zamowienia': r[0], 'id_klienta': r[1], 'restauracja': r[2],
               'danie': r[3], 'wartosc': float(r[4])} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/zamowienia/platnosci')
def wedlug_platnosci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT payment_method, COUNT(*) as liczba, SUM(price * quantity) as wartosc
        FROM orders
        GROUP BY payment_method
        ORDER BY liczba DESC
    """)
    result = [{'metoda': r[0], 'liczba': r[1], 'wartosc': float(r[2])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/zamowienia/daty')
def wedlug_daty():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT order_date, COUNT(*) as liczba, SUM(price * quantity) as wartosc
        FROM orders
        GROUP BY order_date
        ORDER BY order_date DESC
        LIMIT 20
    """)
    result = [{'data': str(r[0]), 'liczba': r[1], 'wartosc': float(r[2])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/zamowienia/popularne-dania')
def popularne_dania():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT d.name, d.category, COUNT(*) as liczba_zamowien
        FROM orders o
        JOIN dishes d ON o.dish_id = d.id
        GROUP BY d.id, d.name, d.category
        ORDER BY liczba_zamowien DESC
        LIMIT 15
    """)
    result = [{'danie': r[0], 'kategoria': r[1], 'liczba_zamowien': r[2]}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/klienci/top')
def top_klienci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.gender, c.age_group, c.city,
               COUNT(o.id) as liczba_zamowien,
               SUM(o.price * o.quantity) as wartosc
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id
        ORDER BY wartosc DESC
        LIMIT 10
    """)
    result = [{'id': r[0], 'plec': r[1], 'wiek': r[2], 'miasto': r[3],
               'liczba_zamowien': r[4], 'wartosc': float(r[5])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/klienci/plec')
def wedlug_plci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.gender, COUNT(DISTINCT c.id) as liczba_klientow,
               COUNT(o.id) as liczba_zamowien,
               SUM(o.price * o.quantity) as wartosc
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.gender
    """)
    result = [{'plec': r[0], 'liczba_klientow': r[1], 'liczba_zamowien': r[2],
               'wartosc': float(r[3] or 0)} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/klienci/wiek')
def wedlug_wieku():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.age_group, COUNT(DISTINCT c.id) as liczba_klientow,
               COUNT(o.id) as liczba_zamowien,
               SUM(o.price * o.quantity) as wartosc
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.age_group
    """)
    result = [{'grupa': r[0], 'liczba_klientow': r[1], 'liczba_zamowien': r[2],
               'wartosc': float(r[3] or 0)} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/klienci/miasto')
def wedlug_miasta():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.city, COUNT(DISTINCT c.id) as liczba_klientow,
               COUNT(o.id) as liczba_zamowien,
               SUM(o.price * o.quantity) as wartosc
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.city
        ORDER BY wartosc DESC
    """)
    result = [{'miasto': r[0], 'liczba_klientow': r[1], 'liczba_zamowien': r[2],
               'wartosc': float(r[3] or 0)} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/restauracje/liczba')
def restauracje_wg_liczby():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.name, COUNT(o.id) as liczba_zamowien
        FROM restaurants r
        JOIN orders o ON r.id = o.restaurant_id
        GROUP BY r.id
        ORDER BY liczba_zamowien DESC
    """)
    result = [{'restauracja': r[0], 'liczba_zamowien': r[1]}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/restauracje/wartosc')
def restauracje_wg_wartosci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.name, SUM(o.price * o.quantity) as wartosc
        FROM restaurants r
        JOIN orders o ON r.id = o.restaurant_id
        GROUP BY r.id
        ORDER BY wartosc DESC
    """)
    result = [{'restauracja': r[0], 'wartosc': float(r[1])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/restauracje/srednia')
def restauracje_srednia():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.name, COUNT(o.id) as liczba,
               AVG(o.price * o.quantity) as srednia
        FROM restaurants r
        JOIN orders o ON r.id = o.restaurant_id
        GROUP BY r.id
        ORDER BY srednia DESC
    """)
    result = [{'restauracja': r[0], 'liczba': r[1], 'srednia': float(r[2])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/dostawy/statusy')
def statusy_dostaw():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT delivery_status, COUNT(*) as liczba,
               ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as procent
        FROM orders
        GROUP BY delivery_status
    """)
    result = [{'status': r[0], 'liczba': r[1], 'procent': float(r[2])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/oceny/restauracje')
def najlepsze_restauracje():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.name, AVG(rat.rating) as srednia_ocena, COUNT(rat.id) as liczba_ocen
        FROM restaurants r
        JOIN orders o ON r.id = o.restaurant_id
        JOIN ratings rat ON o.id = rat.order_id
        GROUP BY r.id
        HAVING liczba_ocen >= 5
        ORDER BY srednia_ocena DESC
    """)
    result = [{'restauracja': r[0], 'srednia_ocena': float(r[1]), 'liczba_ocen': r[2]}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/oceny/rozklad')
def rozklad_ocen():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT rating, COUNT(*) as liczba,
               ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ratings), 2) as procent
        FROM ratings
        GROUP BY rating
        ORDER BY rating DESC
    """)
    result = [{'ocena': r[0], 'liczba': r[1], 'procent': float(r[2])}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/oceny/dania')
def najlepsze_dania():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT d.name, d.category, AVG(rat.rating) as srednia_ocena, COUNT(rat.id) as liczba_ocen
        FROM dishes d
        JOIN orders o ON d.id = o.dish_id
        JOIN ratings rat ON o.id = rat.order_id
        GROUP BY d.id
        HAVING liczba_ocen >= 3
        ORDER BY srednia_ocena DESC
        LIMIT 20
    """)
    result = [{'danie': r[0], 'kategoria': r[1], 'srednia_ocena': float(r[2]), 'liczba_ocen': r[3]}
              for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/lojalnosc/statystyki')
def statystyki_lojalnosci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            AVG(order_frequency) as srednia_czestotliwosc,
            AVG(loyalty_points) as srednie_punkty,
            SUM(CASE WHEN churned = 'Active' THEN 1 ELSE 0 END) as aktywni,
            SUM(CASE WHEN churned = 'Inactive' THEN 1 ELSE 0 END) as nieaktywni
        FROM loyalty
    """)
    row = cursor.fetchone()
    result = {
        'srednia_czestotliwosc': float(row[0] or 0),
        'srednie_punkty': float(row[1] or 0),
        'aktywni': row[2],
        'nieaktywni': row[3]
    }
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/lojalnosc/top-klienci')
def top_klienci_lojalnosci():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.gender, c.city, l.loyalty_points, l.order_frequency, l.churned
        FROM loyalty l
        JOIN customers c ON l.customer_id = c.id
        ORDER BY l.loyalty_points DESC
        LIMIT 20
    """)
    result = [{'id': r[0], 'plec': r[1], 'miasto': r[2], 'punkty': r[3],
               'czestotliwosc': r[4], 'status': r[5]} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/lojalnosc/aktywnosc')
def aktywnosc_klientow():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT churned, COUNT(*) as liczba,
               ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM loyalty), 2) as procent,
               AVG(order_frequency) as srednia_czestotliwosc
        FROM loyalty
        GROUP BY churned
    """)
    result = [{'status': r[0], 'liczba': r[1], 'procent': float(r[2]),
               'srednia_czestotliwosc': float(r[3])} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
