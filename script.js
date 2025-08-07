document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const tableBody = document.querySelector("#expense-table tbody");
  const chartCanvas = document.getElementById("expenseChart");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let expenseChart;

  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function renderTable() {
    tableBody.innerHTML = "";
    expenses.forEach((exp, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${exp.title}</td>
        <td>$${exp.amount.toFixed(2)}</td>
        <td>${exp.category}</td>
        <td>${exp.date}</td>
        <td><button data-index="${index}" class="delete-btn">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  function getCategoryTotals() {
    const totals = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  }

  function renderChart() {
    const totals = getCategoryTotals();
    const labels = Object.keys(totals);
    const data = Object.values(totals);

    if (expenseChart) {
      expenseChart.destroy(); // Destroy old chart to avoid duplicates
    }

    expenseChart = new Chart(chartCanvas, {
      type: "bar", // Change to "pie" if preferred
      data: {
        labels: labels,
        datasets: [{
          label: "Total Spending ($)",
          data: data,
          backgroundColor: [
            "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!title || isNaN(amount) || amount <= 0 || !category) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const expense = {
      title,
      amount,
      category,
      date: new Date().toLocaleDateString()
    };

    expenses.push(expense);
    saveExpenses();
    renderTable();
    renderChart();
    form.reset();
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      expenses.splice(index, 1);
      saveExpenses();
      renderTable();
      renderChart();
    }
  });

  // Initial render
  renderTable();
  renderChart();
});
