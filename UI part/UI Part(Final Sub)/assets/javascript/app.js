const invoiceTable = document.getElementById('myTable');
const addInvoiceForm = document.getElementById('addInvoiceForm');
const editInvoiceForm = document.getElementById('editInvoiceForm');
const searchInput = document.getElementById('searchInput');
const selectAllCheckbox = document.getElementById('selectAllCheckboxes');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const openEditModalButton = document.getElementById('openEditModalButton');

let invoices = [];
let selectedInvoiceId = null;
let filteredInvoices = [];
let currentPage = 1;
const pageSize = 8;

function renderTable() {
  const data = filteredInvoices.length ? filteredInvoices : invoices;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = data.slice(start, end);
  invoiceTable.innerHTML = '';

  pageItems.forEach(invoice => {
    const row = document.createElement('tr');
    row.dataset.id = invoice.id;
    row.innerHTML = `
      <td>
        <input type="checkbox" class="row-checkbox" data-id="${invoice.id}" ${invoice.selected ? 'checked' : ''}>
      </td>
      <td>${invoice.customerNo}</td>
      <td>${invoice.invoiceNo}</td>
      <td>${invoice.amount}</td>
      <td>${invoice.dueDate}</td>
      <td>${invoice.predictedDate}</td>
      <td>${invoice.notes}</td>
    `;
    invoiceTable.appendChild(row);
  });

  updateSelectAllState();
  attachRowCheckboxListeners();
}

function attachRowCheckboxListeners() {
  const checkboxes = document.querySelectorAll('.row-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const invoice = invoices.find(item => item.id === checkbox.dataset.id);
      if (invoice) {
        invoice.selected = checkbox.checked;
      }
      updateSelectAllState();
    });
  });
}

function updateSelectAllState() {
  const checkboxes = document.querySelectorAll('.row-checkbox');
  if (!checkboxes.length) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }

  const checked = Array.from(checkboxes).filter(ch => ch.checked).length;
  selectAllCheckbox.checked = checked === checkboxes.length;
  selectAllCheckbox.indeterminate = checked > 0 && checked < checkboxes.length;
}

function calculatePredictedPaymentDate(dueDate) {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

function getSelectedInvoices() {
  return invoices.filter(invoice => invoice.selected);
}

function clearSelection() {
  invoices.forEach(invoice => { invoice.selected = false; });
  selectedInvoiceId = null;
}

function updatePaginationButtons() {
  const totalItems = filteredInvoices.length ? filteredInvoices.length : invoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const nextButton = document.querySelector('.nextButton');
  const prevButton = document.querySelector('.prevButton');
  nextButton.disabled = currentPage >= totalPages;
  prevButton.disabled = currentPage <= 1;
}

function refreshDisplay() {
  const query = searchInput.value.trim().toLowerCase();
  filteredInvoices = query ? invoices.filter(inv => inv.invoiceNo.toLowerCase().includes(query) || inv.customerNo.toLowerCase().includes(query)) : [];
  currentPage = 1;
  renderTable();
  updatePaginationButtons();
}

addInvoiceForm.addEventListener('submit', event => {
  event.preventDefault();
  const customerName = document.getElementById('custName').value.trim();
  const customerNo = document.getElementById('custNo').value.trim();
  const invoiceNo = document.getElementById('invNo').value.trim();
  const invAmount = document.getElementById('invAmount').value.trim();
  const dueDate = document.getElementById('dueDate').value;
  const notes = document.getElementById('notes').value.trim();

  if (!customerName || !customerNo || !invoiceNo || !invAmount || !dueDate) {
    alert('Please complete all required fields.');
    return;
  }

  const invoice = {
    id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName,
    customerNo,
    invoiceNo,
    amount: Number(invAmount).toFixed(2),
    dueDate,
    predictedDate: calculatePredictedPaymentDate(dueDate),
    notes,
    selected: false
  };

  invoices.unshift(invoice);
  addInvoiceForm.reset();
  closeModal(document.getElementById('modal'));
  refreshDisplay();
});

editInvoiceForm.addEventListener('submit', event => {
  event.preventDefault();

  const selected = getSelectedInvoices();
  if (selected.length !== 1) {
    alert('Please select exactly one invoice to edit.');
    return;
  }

  const invoice = selected[0];
  const amount = document.getElementById('editInvAmount').value.trim();
  const notes = document.getElementById('editNotes').value.trim();

  if (!amount) {
    alert('Invoice amount is required.');
    return;
  }

  invoice.amount = Number(amount).toFixed(2);
  invoice.notes = notes;
  clearSelection();
  closeEdit(document.getElementById('edit'));
  refreshDisplay();
});

openEditModalButton.addEventListener('click', () => {
  const selected = getSelectedInvoices();
  if (selected.length !== 1) {
    alert('Select exactly one invoice to edit.');
    return;
  }

  const invoice = selected[0];
  document.getElementById('editInvAmount').value = invoice.amount;
  document.getElementById('editNotes').value = invoice.notes;
  openEdit(document.getElementById('edit'));
});

confirmDeleteButton.addEventListener('click', () => {
  invoices = invoices.filter(invoice => !invoice.selected);
  filteredInvoices = [];
  clearSelection();
  closeErase(document.getElementById('erase'));
  refreshDisplay();
});

searchInput.addEventListener('input', refreshDisplay);

selectAllCheckbox.addEventListener('change', () => {
  invoices.forEach(invoice => {
    invoice.selected = selectAllCheckbox.checked;
  });
  renderTable();
});

const nextButton = document.querySelector('.nextButton');
const prevButton = document.querySelector('.prevButton');
nextButton.addEventListener('click', () => {
  const totalItems = filteredInvoices.length ? filteredInvoices.length : invoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (currentPage < totalPages) {
    currentPage += 1;
    renderTable();
    updatePaginationButtons();
  }
});
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderTable();
    updatePaginationButtons();
  }
});

function initializeDemoData() {
  invoices = [
    {
      id: 'inv-1',
      customerName: 'Alpha Corp',
      customerNo: '1001',
      invoiceNo: '5001',
      amount: '3100.00',
      dueDate: '2026-08-05',
      predictedDate: calculatePredictedPaymentDate('2026-08-05'),
      notes: 'Recurring monthly payment',
      selected: false
    },
    {
      id: 'inv-2',
      customerName: 'Beta Traders',
      customerNo: '1002',
      invoiceNo: '5002',
      amount: '1450.00',
      dueDate: '2026-08-10',
      predictedDate: calculatePredictedPaymentDate('2026-08-10'),
      notes: 'Pending approval',
      selected: false
    }
  ];
  refreshDisplay();
}

window.addEventListener('DOMContentLoaded', () => {
  renderTable();
  updatePaginationButtons();
  initializeDemoData();
});
