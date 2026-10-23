const apiUrl = 'http://localhost:5000/tarefas';

async function listarRegistros() {
    try {
        const resposta = await fetch(apiUrl); // Requisição GET[cite: 2]
        if (!resposta.ok) throw new Error('Erro ao buscar dados');
        
        const tarefas = await resposta.json();
        const lista = document.getElementById('lista-tarefas');
        lista.innerHTML = ''; 
        
        if (tarefas.length === 0) {
            lista.innerHTML = '<li>Nenhuma tarefa cadastrada.</li>';
            return;
        }

        tarefas.forEach(tarefa => {
            const li = document.createElement('li');
            li.textContent = `${tarefa.id} - ${tarefa.titulo}`;
            lista.appendChild(li);
        });
    } catch (erro) {
        console.error('Erro na listagem:', erro);
        alert('Falha ao carregar a lista.');
    }
}

async function cadastrarRegistro(evento) {
    evento.preventDefault(); 
    const inputTitulo = document.getElementById('titulo');
    const dados = { titulo: inputTitulo.value };

    try {
        const resposta = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Cabeçalho configurado corretamente[cite: 1, 2]
            body: JSON.stringify(dados) // Corpo convertido para JSON[cite: 1, 2]
        });

        if (!resposta.ok) throw new Error('Erro ao cadastrar');

        inputTitulo.value = ''; 
        await listarRegistros(); // Atualiza a lista automaticamente sem recarregar a página[cite: 1, 2, 4]
    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        alert('Falha ao cadastrar a tarefa.');
    }
}

document.getElementById('form-tarefa').addEventListener('submit', cadastrarRegistro);
window.addEventListener('DOMContentLoaded', listarRegistros);