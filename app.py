from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) # Ativa o CORS corretamente na API[cite: 1, 2]

def init_db():
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/tarefas', methods=['GET'])
def listar_tarefas():
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, titulo FROM tarefas')
    tarefas = [{'id': row[0], 'titulo': row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(tarefas), 200

@app.route('/tarefas', methods=['POST'])
def cadastrar_tarefa():
    dados = request.get_json()
    if not dados or not dados.get('titulo'):
        return jsonify({'erro': 'Título é obrigatório'}), 400
    
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tarefas (titulo) VALUES (?)', (dados['titulo'],))
    conn.commit()
    novo_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': novo_id, 'titulo': dados['titulo']}), 201

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)