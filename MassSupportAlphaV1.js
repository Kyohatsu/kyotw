/**
 * Mass Support AlphaV1
 * ------------------
 * Author: Kyohatsu.
 * Created: September 20, 2025
 * Description:
 *   A dynamic, TribalWars script for distributing support troops across villages.
 *   Features proportional and equal modes, input validation and per-village troop capping.
 *   Fully compatible accross all worlds.
 *
 * Reminder:
 *   Please obtain permission from the author (Kyohatsu.) before modifying or redistributing
 *   this script. Respect the creator's work and intellectual property.
 *
 * Usage:
 *   Paste the script into your in-game quickbar.
 */

(function() {
  const unitBoxes = Array.from(document.querySelectorAll('.overview_table .call-unit-box'));
  const troopTypes = [...new Set(unitBoxes.map(el =>
    Array.from(el.classList).find(cls => cls.startsWith('call-unit-box-'))
  ).filter(Boolean).map(cls => cls.replace('call-unit-box-', '')))].filter(type => type !== 'snob');

  const totals = {};
  troopTypes.forEach(type => totals[type] = 0);

  if (!location.href.includes('screen=place') || !location.href.includes('mode=call')) {
    const vid = game_data.village.id;
    window.location.href = `/game.php?village=${vid}&screen=place&mode=call&target=${vid}&order=distance&dir=1&group=0`;
    return;
  }

  const selectAllCheckbox = document.querySelector('input[type="checkbox"][name="select_all"]');
  if (selectAllCheckbox && !selectAllCheckbox.checked) selectAllCheckbox.click();

  document.querySelectorAll('input[type="checkbox"][name^="unit_select["]').forEach(cb => {
    if (!cb.checked) cb.click();
  });

  const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(row =>
    troopTypes.some(type => row.querySelector(`input[name*="${type}"]`))
  );
  if (!rows.length) return alert('No troop rows found.');

  rows.forEach(row => {
    troopTypes.forEach(type => {
      const input = row.querySelector(`input[name*="${type}"]`);
      if (input) {
        const countText = input.parentElement.textContent.replace(/\D/g, '');
        const count = parseInt(countText) || 0;
        totals[type] += count;
      }
    });
  });

  const darkTheme = {
    bg: '#1e1e1e', text: '#f0f0f0', border: '#444',
    headerBg: '#2c2c2c', headerText: '#fff',
    tdText: '#ddd', inputBg: '#2a2a2a', inputText: '#fff',
    btnBg: '#333', btnText: '#fff', btnBorder: '#555',
    warnBorder: 'red'
  };

  const lightTheme = {
    bg: '#f4e4c3', text: '#000', border: '#8b4513',
    headerBg: '#d2b48c', headerText: '#000',
    tdText: '#000', inputBg: '#fff', inputText: '#000',
    btnBg: '#f5deb3', btnText: '#000', btnBorder: '#8b4513',
    warnBorder: 'red'
  };

  let currentTheme = 'light';

  const popup = document.createElement('div');
  popup.id = 'massSupportPopup';
  popup.style.position = 'fixed';
  popup.style.top = '50px';
  popup.style.left = '50px';
  popup.style.zIndex = '9999';
  popup.style.fontFamily = 'Verdana';
  popup.style.fontSize = '12px';
  popup.style.width = 'auto';

  const header = document.createElement('div');
  header.innerHTML = `<span style="flex:1;text-align:center;">Mass Support</span>`;
  header.style.position = 'relative';
  header.style.cursor = 'move';
  header.style.padding = '5px';
  header.style.fontWeight = 'bold';
  header.style.display = 'flex';

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✖';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '2px';
  closeBtn.style.right = '5px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '14px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => popup.remove();
  header.appendChild(closeBtn);
  popup.appendChild(header);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.textAlign = 'center';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  troopTypes.forEach(type => {
    const th = document.createElement('th');
    th.style = 'border:1px solid transparent;padding:4px;height:40px;vertical-align:middle;';
    th.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;height:100%;">
        <img src="/graphic/unit/unit_${type}.png" style="width:20px;height:20px;" title="${type}">
      </div>`;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const totalRow = document.createElement('tr');
  troopTypes.forEach(type => {
    const td = document.createElement('td');
    td.innerHTML = `<strong>${totals[type]}</strong>`;
    totalRow.appendChild(td);
  });
  tbody.appendChild(totalRow);

  const inputRow = document.createElement('tr');
  troopTypes.forEach(type => {
    const td = document.createElement('td');
    td.innerHTML = `<input type="number" id="input_${type}" style="width:60px;">`;
    inputRow.appendChild(td);
  });
  tbody.appendChild(inputRow);
  table.appendChild(tbody);
  popup.appendChild(table);

    const buttonRow = document.createElement('div');
  const fillBtn = document.createElement('button');
  fillBtn.innerText = 'Fill Inputs';
  fillBtn.onclick = fillInputs;

  const clearBtn = document.createElement('button');
  clearBtn.innerText = 'Clear Inputs';
  clearBtn.onclick = clearInputs;

  buttonRow.appendChild(fillBtn);
  buttonRow.appendChild(clearBtn);
  popup.appendChild(buttonRow);

  const modeToggle = document.createElement('button');
  modeToggle.innerText = 'Mode: Proportional';
  modeToggle.dataset.mode = 'proportional';
  modeToggle.onclick = () => {
    modeToggle.dataset.mode = modeToggle.dataset.mode === 'equal' ? 'proportional' : 'equal';
    modeToggle.innerText = `Mode: ${modeToggle.dataset.mode.charAt(0).toUpperCase() + modeToggle.dataset.mode.slice(1)}`;
  };
  popup.appendChild(modeToggle);

  const themeToggle = document.createElement('button');
  themeToggle.innerText = 'Theme: Light';
  themeToggle.onclick = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeToggle.innerText = `Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
    applyTheme(currentTheme === 'dark' ? darkTheme : lightTheme);
  };
  popup.appendChild(themeToggle);

  const footer = document.createElement('div');
  footer.innerText = 'AlphaV1 – Kyohatsu.';
  footer.style = 'position:absolute;bottom:4px;right:8px;font-size:10px;font-style:italic;opacity:0.7;';
  popup.appendChild(footer);

  document.body.appendChild(popup);

  let offsetX, offsetY, isDragging = false;
  header.onmousedown = e => {
    if (e.target === closeBtn) return;
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    document.onmousemove = e => {
      if (isDragging) {
        popup.style.left = (e.clientX - offsetX) + 'px';
        popup.style.top = (e.clientY - offsetY) + 'px';
        popup.style.right = 'auto';
      }
    };
    document.onmouseup = () => isDragging = false;
  };

  function applyTheme(theme) {
    popup.style.background = theme.bg;
    popup.style.color = theme.text;
    popup.style.border = `2px solid ${theme.border}`;
    popup.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.5)';
    header.style.background = theme.headerBg;
    header.style.color = theme.headerText;
    closeBtn.style.color = theme.headerText;
    footer.style.color = theme.text;
    table.querySelectorAll('td').forEach(td => td.style = `border:1px solid ${theme.border};padding:4px;color:${theme.tdText};`);
    table.querySelectorAll('input').forEach(input => {
      input.style = `width:60px;background:${theme.inputBg};color:${theme.inputText};border:1px solid ${theme.border};`;
    });
    [fillBtn, clearBtn, modeToggle, themeToggle].forEach(btn => btn.style = `padding:5px 10px;margin:5px;background:${theme.btnBg};color:${theme.btnText};border:1px solid ${theme.btnBorder};`);
    buttonRow.style = 'margin-top:10px;text-align:center;';
  }

  applyTheme(lightTheme);

  function fillInputs() {
    const mode = modeToggle.dataset.mode || 'proportional';
    const villageCheckboxes = document.querySelectorAll('#village_troup_list input[type="checkbox"]');
    villageCheckboxes.forEach(cb => { if (!cb.checked) cb.click(); });

    const sendTotalObj = {};
    troopTypes.forEach(type => {
      const input = document.getElementById(`input_${type}`);
      let val = parseFloat(input?.value) || 0;
      if (val > totals[type]) {
        val = totals[type];
        input.value = val;
        input.style.borderColor = currentTheme === 'dark' ? darkTheme.warnBorder : lightTheme.warnBorder;
      } else {
        input.style.borderColor = currentTheme === 'dark' ? darkTheme.border : lightTheme.border;
      }
      sendTotalObj[type] = val;
    });

    const selectedRows = Array.from(document.querySelectorAll('.overview_table .selected'));
    const eligibleRows = selectedRows.filter(row =>
      troopTypes.some(type => row.querySelector(`.call-unit-box-${type}`))
    );
    if (eligibleRows.length === 0) return alert("No villages selected or visible.");

    const villageTroops = eligibleRows.map(row => {
      const troopData = {};
      troopTypes.forEach(type => {
        const input = row.querySelector(`.call-unit-box-${type}`);
        const countText = input?.parentElement?.textContent?.replace(/\D/g, '') || '0';
        troopData[type] = parseInt(countText) || 0;
      });
      return { row, troopData };
    });

    const totalAvailable = {};
    troopTypes.forEach(type => {
      totalAvailable[type] = villageTroops.reduce((sum, v) => sum + v.troopData[type], 0);
    });

    villageTroops.forEach(village => {
      troopTypes.forEach(type => {
        const input = village.row.querySelector(`.call-unit-box-${type}`);
        if (!input) return;

        let value = 0;
        if (mode === 'equal') {
          const eligibleForType = villageTroops.filter(v => v.troopData[type] > 0);
          value = eligibleForType.length > 0 ? Math.floor(sendTotalObj[type] / eligibleForType.length) : 0;
        } else if (totalAvailable[type] > 0) {
          const proportion = village.troopData[type] / totalAvailable[type];
          value = Math.floor(proportion * sendTotalObj[type]);
        }

        value = Math.min(value, village.troopData[type]);
        input.value = village.troopData[type] > 0 ? value : '';
      });

      const snobInput = village.row.querySelector('.call-unit-box-snob');
      if (snobInput) snobInput.value = '';
    });

    if (mode === 'proportional') {
      troopTypes.forEach(type => {
        const assigned = villageTroops.reduce((sum, v) => {
          const input = v.row.querySelector(`.call-unit-box-${type}`);
          return sum + (parseInt(input?.value) || 0);
        }, 0);

        let remainder = sendTotalObj[type] - assigned;
        if (remainder > 0) {
          villageTroops
            .filter(v => v.troopData[type] > 0)
            .sort((a, b) => b.troopData[type] - a.troopData[type])
            .some(v => {
              const input = v.row.querySelector(`.call-unit-box-${type}`);
              if (input) {
                const current = parseInt(input.value) || 0;
                const maxAdd = v.troopData[type] - current;
                const add = Math.min(remainder, maxAdd);
                input.value = current + add;
                remainder -= add;
                return remainder <= 0;
              }
              return false;
            });
        }
      });
    }
  }

  function clearInputs() {
    troopTypes.forEach(type => {
      const input = document.getElementById(`input_${type}`);
      if (input) {
        input.value = '';
        input.style.borderColor = currentTheme === 'dark' ? darkTheme.border : lightTheme.border;
      }
    });

    document.querySelectorAll('input[type="checkbox"][name^="unit_select["]').forEach(cb => {
      if (cb.checked) cb.click();
    });

    const selectAllCheckbox = document.querySelector('input[type="checkbox"][name="select_all"]');
    if (selectAllCheckbox && selectAllCheckbox.checked) selectAllCheckbox.click();

    const selectedRows = Array.from(document.querySelectorAll('.overview_table .selected'));
    selectedRows.forEach(row => {
      [...troopTypes, 'snob'].forEach(type => {
        const input = row.querySelector(`.call-unit-box-${type}`);
        if (input) input.value = '';
      });
    });
  }
})();
