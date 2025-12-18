const API_URL = 'http://localhost:8081';

// Alternar visualização entre Login e Painel
function toggleView(isLoggedIn) {
    document.getElementById('auth-container').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('main-content').style.display = isLoggedIn ? 'block' : 'none';
    if (isLoggedIn) listarClientes();
}

// 1. LOGIN
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailCliente = document.getElementById('login-email').value;
    const senhaCliente = document.getElementById('login-senha').value;

    const res = await fetch(`${API_URL}/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailCliente, senhaCliente })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Bem-vindo!");
        toggleView(true);
    } else {
        alert(data.erro);
    }
});

// 2. LISTAR CLIENTES (Usa o middleware verify.cliente)
async function listarClientes() {
    const res = await fetch(`${API_URL}/clientes`, { credentials: 'include' });
    if (res.status === 401 || res.status === 403) {
        return toggleView(false);
    }
    const clientes = await res.json();
    const tbody = document.getElementById('tabela-clientes');
    tbody.innerHTML = '';

    clientes.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.nomeCliente}</td>
                <td>${c.cpfCliente}</td>
                <td>${c.emailCliente}</td>
                <td>
                    <button onclick="prepararEdicao('${c.idCliente}', '${c.nomeCliente}', '${c.cpfCliente}', '${c.emailCliente}')">Editar</button>
                    <button onclick="deletarCliente('${c.idCliente}')">Excluir</button>
                </td>
            </tr>`;
    });
}

// 3. INSERIR OU ATUALIZAR
document.getElementById('cliente-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cliente-id').value;
    const payload = {
        nomeCliente: document.getElementById('nome').value,
        cpfCliente: document.getElementById('cpf').value,
        emailCliente: document.getElementById('email').value,
        senhaCliente: document.getElementById('senha').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/clientes/${id}` : `${API_URL}/clientes`;

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });

    if (res.ok) {
        alert("Operação realizada com sucesso!");
        document.getElementById('cliente-form').reset();
        document.getElementById('cliente-id').value = '';
        listarClientes();
    } else {
        const err = await res.json();
        alert(err.erro);
    }
});

// 4. DELETAR
async function deletarCliente(id) {
    if (!confirm("Deseja realmente excluir?")) return;
    const res = await fetch(`${API_URL}/clientes/${id}`, { 
        method: 'DELETE',
        credentials: 'include' 
    });
    if (res.ok) listarClientes();
}

// 5. LOGOUT
document.getElementById('btn-logout').addEventListener('click', async () => {
    await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    toggleView(false);
});

// Auxiliar para preencher o formulário na edição
function prepararEdicao(id, nome, cpf, email) {
    document.getElementById('cliente-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('cpf').value = cpf;
    document.getElementById('email').value = email;
    document.getElementById('senha').placeholder = "Deixe em branco para manter a atual";
}