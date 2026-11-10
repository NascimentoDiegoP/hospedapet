document.addEventListener('DOMContentLoaded', () => {
    // A página deve ser servida pelo próprio Laravel (mesma origem).
    const API_BASE = '/api';

    const viewCliente = document.getElementById('viewCliente');
    const viewDono = document.getElementById('viewDono');
    const modalLogin = document.getElementById('modalLogin');

    const btnAbrirLogin = document.getElementById('btnAbrirLogin');
    const btnCancelarLogin = document.getElementById('btnCancelarLogin');
    const loginForm = document.getElementById('loginForm');
    const adminUser = document.getElementById('adminUser');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');
    const bookingList = document.getElementById('bookingList');

    const mainContainer = document.getElementById('mainContainer');
    const calendarScreen = document.getElementById('calendarScreen');
    const formScreen = document.getElementById('formScreen');
    const successScreen = document.getElementById('successScreen');

    const monthYearTitle = document.getElementById('monthYearTitle');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const calendarGrid = document.getElementById('calendarGrid');

    const btnDalmata = document.getElementById('btnDalmata');
    const btnVoltarInicio = document.getElementById('btnVoltarInicio');
    const btnVoltarCalendar = document.getElementById('btnVoltarCalendar');
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const btnAvancarForm = document.getElementById('btnAvancarForm');
    const selectedSummary = document.getElementById('selectedSummary');

    const bookingForm = document.getElementById('bookingForm');
    const selectedDateText = document.getElementById('selectedDateText');

    const cepInput = document.getElementById('tutorCep');
    const addressInput = document.getElementById('tutorAddress');
    const cepError = document.getElementById('cepError');

    const modalSobre = document.getElementById('modalSobre');
    const btnAbrirSobre = document.getElementById('btnAbrirSobre');
    const btnFecharSobre = document.getElementById('btnFecharSobre');
    const btnEntendidoSobre = document.getElementById('btnEntendidoSobre');

    let currentDate = new Date();
    let selectedDates = new Set();
    let reservedDates = new Set();
    let filtroSituacao = 'todas';

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    async function requestJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...(options.headers || {})
            }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const validationMessages = data.errors
                ? Object.values(data.errors).flat().join('\n')
                : '';
            throw new Error(validationMessages || data.message || `Erro HTTP ${response.status}`);
        }

        return data;
    }

    async function getReservedDates() {
        const result = await requestJson(`${API_BASE}/disponibilidade`);
        const dates = Array.isArray(result.datas_ocupadas) ? result.datas_ocupadas : [];
        reservedDates = new Set(dates);
        return reservedDates;
    }

    function formatDateToBR(dateStr) {
        if (!dateStr) return '';

        const datePart = String(dateStr).substring(0, 10);
        const [year, month, day] = datePart.split('-');

        if (!year || !month || !day) return datePart;

        return `${day}/${month}/${year}`;
    }

// ======================================
// PAINEL ADMINISTRATIVO - HOSPEDAGENS
// ======================================

// Evita que dados cadastrados pelos usuários sejam interpretados como HTML.
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return entities[character];
    });
}

// Consulta as hospedagens cadastradas no Laravel.
async function renderBookings() {
    if (!bookingList) return;

    const token = sessionStorage.getItem('adminToken');

    if (!token) {
        bookingList.textContent = 'Faça login para visualizar as hospedagens.';
        return;
    }

    bookingList.textContent = 'Carregando hospedagens...';

    try {
        const hospedagens = await requestJson(`${API_BASE}/hospedagens`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!Array.isArray(hospedagens) || hospedagens.length === 0) {
            bookingList.textContent = 'Nenhuma hospedagem cadastrada.';
            return;
        }

        // Ordena as hospedagens por data.
        hospedagens.sort((a, b) =>
            String(a.data_hospedagem).localeCompare(String(b.data_hospedagem))
        );

        // Aplica o filtro selecionado.
        const hospedagensFiltradas = filtroSituacao === 'todas'
            ? hospedagens
            : hospedagens.filter(h =>
                h.situacao_hospedagem === filtroSituacao
            );

        let html = `
            <div class="booking-admin-list">

                <h2>Hospedagens cadastradas</h2>

                <div class="booking-filter">
                    <label for="filtroHospedagem">
                        Filtrar hospedagens:
                    </label>

                    <select id="filtroHospedagem">
                        <option value="todas"
                            ${filtroSituacao === 'todas' ? 'selected' : ''}>
                            Todas
                        </option>

                        <option value="pendente"
                            ${filtroSituacao === 'pendente' ? 'selected' : ''}>
                            Pendentes
                        </option>

                        <option value="confirmada"
                            ${filtroSituacao === 'confirmada' ? 'selected' : ''}>
                            Confirmadas
                        </option>

                        <option value="cancelada"
                            ${filtroSituacao === 'cancelada' ? 'selected' : ''}>
                            Canceladas
                        </option>
                    </select>
                </div>

                <p>
                    Exibindo ${hospedagensFiltradas.length}
                    de ${hospedagens.length} hospedagem(ns).
                </p>
        `;

        if (hospedagensFiltradas.length === 0) {
            html += `
                <p class="booking-empty">
                    Nenhuma hospedagem encontrada para esta situação.
                </p>
            `;
        }

        hospedagensFiltradas.forEach(hospedagem => {
            const pet = hospedagem.pet || {};
            const tutor = pet.tutor || {};

            const situacao = hospedagem.situacao_hospedagem || 'pendente';

            let botoes = '';
            let classeSituacao = '';

            if (situacao === 'pendente') {
                classeSituacao = 'status-pendente';

                botoes = `
                    <button type="button"
                        class="btn-wa booking-action"
                        data-booking-id="${escapeHTML(hospedagem.id)}"
                        data-new-status="confirmada">
                        Confirmar
                    </button>

                    <button type="button"
                        class="btn-cancel booking-action"
                        data-booking-id="${escapeHTML(hospedagem.id)}"
                        data-new-status="cancelada">
                        Cancelar
                    </button>
                `;

            } else if (situacao === 'confirmada') {
                classeSituacao = 'status-confirmado';

                botoes = `
                    <button type="button"
                        class="btn-cancel booking-action"
                        data-booking-id="${escapeHTML(hospedagem.id)}"
                        data-new-status="cancelada">
                        Cancelar
                    </button>
                `;

            } else if (situacao === 'cancelada') {
                classeSituacao = 'status-cancelado';

                botoes = `
                    <button type="button"
                        class="btn-wa booking-action"
                        data-booking-id="${escapeHTML(hospedagem.id)}"
                        data-new-status="confirmada">
                        Confirmar novamente
                    </button>
                `;
            }

            // Botão Excluir: disponível para todas as situações.
            botoes += `
                <button type="button"
                    class="btn-delete booking-action"
                    data-booking-id="${escapeHTML(hospedagem.id)}"
                    data-action="delete">
                    Excluir
                </button>
            `;

            html += `
                <div class="booking-admin-card">

                    <h3>Hospedagem #${escapeHTML(hospedagem.id)}</h3>

                    <p>
                        <strong>Data:</strong>
                        ${escapeHTML(formatDateToBR(hospedagem.data_hospedagem))}
                    </p>

                    <p>
                        <strong>Tutor:</strong>
                        ${escapeHTML(tutor.nome_tutor || 'Não informado')}
                    </p>

                    <p>
                        <strong>Telefone:</strong>
                        ${escapeHTML(tutor.telefone || 'Não informado')}
                    </p>

                    <p>
                        <strong>E-mail:</strong>
                        ${escapeHTML(tutor.email || 'Não informado')}
                    </p>

                    <p>
                        <strong>Pet:</strong>
                        ${escapeHTML(pet.nome_pet || 'Não informado')}
                    </p>

                    <p>
                        <strong>Espécie:</strong>
                        ${escapeHTML(pet.especie || 'Não informado')}
                    </p>

                    <p>
                        <strong>Situação:</strong>
                        <span class="status-badge ${classeSituacao}">
                            ${escapeHTML(situacao.toUpperCase())}
                        </span>
                    </p>

                    <p>
                        <strong>Observação:</strong>
                        ${escapeHTML(hospedagem.observacao || 'Nenhuma observação')}
                    </p>

                    <div class="booking-admin-actions">
                        ${botoes}
                    </div>

                </div>
            `;
        });

        html += '</div>';

        bookingList.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar hospedagens:', error);

        bookingList.textContent =
            `Não foi possível carregar as hospedagens: ${error.message}`;
    }
}

// ======================================
// FILTRO DE HOSPEDAGENS
// ======================================

if (bookingList) {
    bookingList.addEventListener('change', event => {

        if (event.target.id === 'filtroHospedagem') {

            filtroSituacao = event.target.value;

            renderBookings();
        }

    });
}

// ======================================
// AÇÕES DOS BOTÕES DO PAINEL
// ======================================

if (bookingList) {
    bookingList.addEventListener('click', async event => {

        const button = event.target.closest('button[data-booking-id]');

        if (!button) return;

        const id = button.dataset.bookingId;
        const token = sessionStorage.getItem('adminToken');

        if (!token) {
            alert('Sua sessão expirou. Faça login novamente.');
            return;
        }

        // ======================================
        // EXCLUIR HOSPEDAGEM
        // ======================================

        if (button.dataset.action === 'delete') {

            const confirmacao = confirm(
                `ATENÇÃO!\n\nDeseja realmente EXCLUIR a hospedagem #${id}?\n\nEssa operação não poderá ser desfeita.`
            );

            if (!confirmacao) return;

            button.disabled = true;

            try {
                await requestJson(`${API_BASE}/hospedagens/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                alert('Hospedagem excluída com sucesso!');

                await renderBookings();

            } catch (error) {
                console.error('Erro ao excluir hospedagem:', error);

                alert(
                    `Não foi possível excluir a hospedagem.\n${error.message}`
                );

                button.disabled = false;
            }

            return;
        }

        // ======================================
        // CONFIRMAR OU CANCELAR HOSPEDAGEM
        // ======================================

        const novaSituacao = button.dataset.newStatus;

        const confirmacao = confirm(
            `Deseja realmente alterar a situação desta hospedagem para ${novaSituacao.toUpperCase()}?`
        );

        if (!confirmacao) return;

        button.disabled = true;

        try {
            await requestJson(`${API_BASE}/hospedagens/${id}/situacao`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    situacao_hospedagem: novaSituacao
                })
            });

            alert('Situação da hospedagem atualizada com sucesso!');

            await renderBookings();

        } catch (error) {
            console.error('Erro ao atualizar hospedagem:', error);

            alert(
                `Não foi possível atualizar a hospedagem.\n${error.message}`
            );

            button.disabled = false;
        }
    });
}

    function updateSelectedSummary() {
        if (!selectedSummary || !btnAvancarForm) return;

        if (selectedDates.size === 0) {
            selectedSummary.innerText = 'Nenhuma data selecionada';
            btnAvancarForm.disabled = true;
            return;
        }

        const sortedDates = Array.from(selectedDates).sort();
        selectedSummary.innerText =
            `Selecionada(s) (${selectedDates.size}): ${sortedDates.map(formatDateToBR).join(', ')}`;
        btnAvancarForm.disabled = false;
    }

    async function renderCalendar() {
        if (!calendarGrid || !monthYearTitle) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYearTitle.innerText = `${monthNames[month]} ${year}`;

        const headers = Array.from(calendarGrid.querySelectorAll('.day-header'));
        calendarGrid.innerHTML = '';
        headers.forEach(header => calendarGrid.appendChild(header));

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            calendarGrid.appendChild(document.createElement('span'));
        }

        try {
            await getReservedDates();
        } catch (error) {
            console.error('Não foi possível consultar a disponibilidade:', error);
            alert(`Não foi possível carregar as datas disponíveis.\n${error.message}`);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= totalDays; day++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerText = day;

            const dateKey =
                `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            button.dataset.date = dateKey;
            button.classList.add('day');

            const dateValue = new Date(year, month, day);
            dateValue.setHours(0, 0, 0, 0);

            if (reservedDates.has(dateKey)) {
                button.classList.add('reserved');
                button.disabled = true;
                button.title = 'Data reservada';
            } else if (dateValue < today) {
                button.classList.add('reserved');
                button.disabled = true;
                button.title = 'Data passada';
            } else if (selectedDates.has(dateKey)) {
                button.classList.add('selected');
            } else {
                button.classList.add('available');
            }

            calendarGrid.appendChild(button);
        }

        updateSelectedSummary();
    }

// ======================================
// LOGIN ADMINISTRATIVO - LARAVEL SANCTUM
// ======================================

if (btnAbrirLogin) {
    btnAbrirLogin.addEventListener('click', () => {
        if (adminUser) adminUser.value = '';
        if (adminPassword) adminPassword.value = '';

        if (loginError) {
            loginError.textContent = '';
            loginError.classList.add('hidden');
        }

        if (modalLogin) modalLogin.classList.remove('hidden');
    });
}

if (btnCancelarLogin) {
    btnCancelarLogin.addEventListener('click', () => {
        if (modalLogin) modalLogin.classList.add('hidden');
    });
}

// Realiza o login pela API Laravel.
if (loginForm) {
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (loginError) {
            loginError.textContent = '';
            loginError.classList.add('hidden');
        }

        try {
            const resultado = await requestJson(`${API_BASE}/login`, {
                method: 'POST',
                body: JSON.stringify({
                    usuario: adminUser.value.trim(),
                    senha: adminPassword.value
                })
            });

            // Guarda o token somente durante a sessão da aba.
            sessionStorage.setItem('adminToken', resultado.token);

            if (modalLogin) modalLogin.classList.add('hidden');
            if (viewCliente) viewCliente.classList.add('hidden');
            if (viewDono) viewDono.classList.remove('hidden');

            // Carrega as hospedagens após o login.
            await renderBookings();

        } catch (error) {
            console.error('Erro ao realizar login:', error);

            if (loginError) {
                loginError.textContent = error.message ||
                    'Não foi possível realizar o login.';
                loginError.classList.remove('hidden');
            }
        }
    });
}

// Encerra a sessão administrativa.
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        const token = sessionStorage.getItem('adminToken');

        try {
            if (token) {
                await requestJson(`${API_BASE}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao encerrar sessão:', error);
        } finally {
            sessionStorage.removeItem('adminToken');

            if (viewDono) viewDono.classList.add('hidden');
            if (viewCliente) viewCliente.classList.remove('hidden');
        }
    });
}

    if (btnAbrirSobre && modalSobre) {
        btnAbrirSobre.addEventListener('click', () => modalSobre.classList.remove('hidden'));
    }

    const fecharModalSobre = () => {
        if (modalSobre) modalSobre.classList.add('hidden');
    };

    if (btnFecharSobre) btnFecharSobre.addEventListener('click', fecharModalSobre);
    if (btnEntendidoSobre) btnEntendidoSobre.addEventListener('click', fecharModalSobre);

    if (modalSobre) {
        modalSobre.addEventListener('click', event => {
            if (event.target === modalSobre) fecharModalSobre();
        });
    }

    if (btnPrevMonth) {
        btnPrevMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (btnNextMonth) {
        btnNextMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if (btnDalmata) {
        btnDalmata.addEventListener('click', event => {
            event.preventDefault();
            if (mainContainer) mainContainer.classList.add('hidden');
            if (calendarScreen) calendarScreen.classList.remove('hidden');
            renderCalendar();
        });
    }

    if (btnVoltarInicio) {
        btnVoltarInicio.addEventListener('click', () => {
            if (calendarScreen) calendarScreen.classList.add('hidden');
            if (mainContainer) mainContainer.classList.remove('hidden');
        });
    }

    if (calendarGrid) {
        calendarGrid.addEventListener('click', event => {
            const target = event.target.closest('button.day');
            if (!target || target.disabled || target.classList.contains('reserved')) return;

            const dateKey = target.dataset.date;
            if (selectedDates.has(dateKey)) {
                selectedDates.delete(dateKey);
                target.classList.remove('selected');
                target.classList.add('available');
            } else {
                selectedDates.add(dateKey);
                target.classList.remove('available');
                target.classList.add('selected');
            }
            updateSelectedSummary();
        });
    }

    if (btnAvancarForm) {
        btnAvancarForm.addEventListener('click', () => {
            if (selectedDates.size === 0) return;

            const formattedList = Array.from(selectedDates)
                .sort()
                .map(formatDateToBR)
                .join(', ');

            if (selectedDateText) {
                selectedDateText.innerText =
                    `Data(s) Selecionada(s) (${selectedDates.size}):\n${formattedList}`;
            }

            if (calendarScreen) calendarScreen.classList.add('hidden');
            if (formScreen) formScreen.classList.remove('hidden');
        });
    }

    if (btnVoltarCalendar) {
        btnVoltarCalendar.addEventListener('click', () => {
            if (formScreen) formScreen.classList.add('hidden');
            if (calendarScreen) calendarScreen.classList.remove('hidden');
            renderCalendar();
        });
    }

    // Consulta de CEP pelo serviço ViaCEP.
    if (cepInput) {
        cepInput.addEventListener('blur', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) return;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error('Falha na consulta do CEP.');

                const data = await response.json();
                if (data.erro) throw new Error('CEP não encontrado.');

                if (addressInput) {
                    addressInput.value =
                        [data.logradouro, data.bairro].filter(Boolean).join(', ') +
                        ` - ${data.localidade}/${data.uf}`;
                }
                if (cepError) cepError.classList.add('hidden');
            } catch (error) {
                if (cepError) {
                    cepError.textContent = error.message || 'CEP não encontrado';
                    cepError.classList.remove('hidden');
                }
                if (addressInput) addressInput.value = '';
            }
        });
    }

    // Envia os campos com os nomes esperados por HospedagemController@store.
    if (bookingForm) {
        bookingForm.addEventListener('submit', async event => {
            event.preventDefault();

            if (selectedDates.size === 0) {
                alert('Selecione pelo menos uma data no calendário.');
                return;
            }

            const payload = {
                nome_tutor: document.getElementById('tutorName')?.value.trim() || '',
                telefone: document.getElementById('tutorPhone')?.value.trim() || '',
                email: document.getElementById('tutorEmail')?.value.trim() || '',
                cep: cepInput?.value.trim() || '',
                endereco: addressInput?.value.trim() || '',
                numero: document.getElementById('numeroEnd')?.value.trim() || '',
                nome_pet: document.getElementById('petName')?.value.trim() || '',
                especie: document.getElementById('petEspecie')?.value.trim() || '',
                datas: Array.from(selectedDates).sort(),
                observacao: document.getElementById('tutorDetails')?.value.trim() || ''
            };

            const submitButton = bookingForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'ENVIANDO...';
            }

            try {
                await requestJson(`${API_BASE}/hospedagens`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                selectedDates.clear();
                bookingForm.reset();
                if (addressInput) addressInput.value = '';
                if (cepError) cepError.classList.add('hidden');

                if (formScreen) formScreen.classList.add('hidden');
                if (successScreen) successScreen.classList.remove('hidden');
            } catch (error) {
                console.error('Erro ao enviar solicitação:', error);
                alert(`Não foi possível enviar a solicitação.\n${error.message}`);
                // Reconsulta para refletir uma eventual reserva feita simultaneamente.
                renderCalendar();
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'ENVIAR SOLICITAÇÃO';
                }
            }
        });
    }

    if (btnNovoAgendamento) {
        btnNovoAgendamento.addEventListener('click', () => {
            window.location.href = '/miAuspedagem.html';
        });
    }

    // Inicializa o resumo e mantém o botão de avanço bloqueado sem datas.
    updateSelectedSummary();
});