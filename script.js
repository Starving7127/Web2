const state = {
    criteria: [
        { id: 'c1', name: 'コスト効率', weight: 5 },
        { id: 'c2', name: '時間的対価', weight: 3 },
        { id: 'c3', name: 'リスク', weight: 2 }
    ],
    options: [
        { id: 'o1', name: '戦略A', scores: { 'c1': 8, 'c2': 6, 'c3': 5 } },
        { id: 'o2', name: '戦略B', scores: { 'c1': 4, 'c2': 9, 'c3': 8 } }
    ]
};


const generateId = () => 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2);

function render() {
    renderCriteria();
    renderTable();
}

function renderCriteria() {
    const container = document.getElementById('criteria-list');
    container.innerHTML = '';

    state.criteria.forEach(c => {
        const row = document.createElement('div');
        row.className = 'criteria-row';
        row.innerHTML = `
            <input type="text" value="${c.name}" oninput="updateCriterion('${c.id}', 'name', this.value)" placeholder="基準名">
            <input type="number" value="${c.weight}" oninput="updateCriterion('${c.id}', 'weight', this.value)" placeholder="重み">
            <button class="icon-btn" onclick="removeCriterion('${c.id}')">×</button>
        `;
        container.appendChild(row);
    });
}

function renderTable() {
    const thead = document.getElementById('table-header');
    const tbody = document.getElementById('table-body');

    //head
    let headerHTML = '<th>選択肢名</th>';
    state.criteria.forEach(c => {
        headerHTML += `<th class="num">${c.name} <br><span style="font-size:0.7em; opacity:0.7">(x${c.weight})</span></th>`;
    });
    headerHTML += '<th class="num">合計スコア</th><th style="width: 40px"></th>';
    thead.innerHTML = headerHTML;

    //body
    tbody.innerHTML = '';
    state.options.forEach(opt => {
        let total = 0;
        let cellsHTML = `<td><input type="text" value="${opt.name}" oninput="updateOptionName('${opt.id}', this.value)"></td>`;
        
        state.criteria.forEach(c => {
            const score = opt.scores[c.id] || 0;
            total += score * c.weight;
            cellsHTML += `
                <td class="num">
                    <input type="number" class="score-input" value="${score}" 
                        oninput="updateScore('${opt.id}', '${c.id}', this.value)">
                </td>
            `;
        });

        cellsHTML += `<td class="num total-score">${total}</td>`;
        cellsHTML += `<td><button class="icon-btn" onclick="removeOption('${opt.id}')">×</button></td>`;

        const tr = document.createElement('tr');
        tr.innerHTML = cellsHTML;
        tbody.appendChild(tr);
    });
}

window.addCriterion = () => {
    const newId = generateId();
    state.criteria.push({ id: newId, name: '新しい基準', weight: 1 });

    state.options.forEach(opt => opt.scores[newId] = 0);
    render();
};

window.removeCriterion = (id) => {
    state.criteria = state.criteria.filter(c => c.id != id);
    state.options.forEach(opt => { delete opt.scores[id]; });
    render();
};

window.updateCriterion = (id, field, value) => {
    const item = state.criteria.find(c => c.id == id);
    if (item) {
        item[field] = field === 'weight' ? Number(value) : value;
        renderTable();
    }
};

window.addOption = () => {
    const newOpt = { id: generateId(), name: '新しい選択肢', scores: {} };
    state.criteria.forEach(c => newOpt.scores[c.id] = 0);
    state.options.push(newOpt);
    render();
};

window.removeOption = (id) => {
    state.options = state.options.filter(o => o.id != id);
    render();
};

window.updateOptionName = (id, val) => {
    const opt = state.options.find(o => o.id == id);
    if (opt) opt.name = val;
};

window.updateScore = (optId, critId, val) => {
    const opt = state.options.find(o => o.id == optId);
    if (opt) {
        opt.scores[critId] = Number(val);
        renderTable();
    }
};
render();