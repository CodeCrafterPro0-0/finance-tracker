const el = Object.freeze({
    income: document.getElementById("income"),
    expense: document.getElementById("expense"),
    balance: document.getElementById("balance"),
    
    history: document.getElementById("history"),
    
    type: document.getElementById("type"),
    amount: document.getElementById("amount"),
    category: document.getElementById("category"),
    
    day: document.getElementById("day"),
    month: document.getElementById("month"),
    year: document.getElementById("year"),
    
    goalInput: document.getElementById("goalInput"),
    goal: document.getElementById("goal"),
    saved: document.getElementById("saved"),
    remaining: document.getElementById("remaining"),
    progress: document.getElementById("progress"),
    
    pages: document.querySelectorAll(".page"),
    sidebar: document.getElementById("sidebar"),
});

let data = JSON.parse(localStorage.getItem("finance")) || [] ;

let goal = Number(localStorage.getItem("goal")) || 0;
let saved = Number(localStorage.getItem("saved")) || 0;

function toggleMenu(){
    el.sidebar.classList.toggle("open");
}

function showPage(page) {
    el.pages.forEach(p => p.classList.add("hidden"));

    if(page === "home") document.getElementById("homePage").classList.remove("hidden");
    if(page === "transactions") document.getElementById("transactionPage").classList.remove("hidden");
    if(page === "savings") document.getElementById("savingsPage").classList.remove("hidden");

    el.sidebar.classList.remove("open");
    updateUI();
}

document.addEventListener("click", (e) => {
    if(!el.sidebar.contains(e.target) && !e.target.classList.contains("menuButton")) {
        el.sidebar.classList.remove("open");
    }
});

function loadDateInput() {
    for(let i =1; i<=31; i++) {
        el.day.innerHTML +=`<option>${i}</option>`;
    }

    const month = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep", "Oct", "Nov", "Dec"];

    month.forEach(m => {
        el.month.innerHTML += `<option>${m}</option>`;
    });

    for(let y = 2024; y<= 2100; y++){
        el.year.innerHTML +=`<option>${y}</option>`;
    }
}

function addEntry() {
    const type = el.type.value;
    const amount = Number(el.amount.value);
    let category = el.category.value;
    const date = `${el.day.value}-${el.month.value}-${el.year.value}`;

    if(!type || !amount){
        alert("Please fill all fields");
        return;
    }

    if(type === "savings"){
        category = "savings";
        saved += amount;
        localStorage.setItem("saved", saved);
    }

    if(type !== "savings" && category.toLowerCase() === "savings"){
        alert("❌ Savings category only allowed in Savings type");
        return;
    }

    data.push({type, amount, category, date});

    localStorage.setItem("finance", JSON.stringify(data));

    el.amount.value = "";
    el.category.value = "";

    updateUI();
}

function setGoal() {
    goal = Number(el.goalInput.value);

    localStorage.setItem("goal", goal);

    updateUI();
}

function updateUI() {
    let income = 0;
    let expense = 0;
    
    el.history.innerHTML = "";

    data.forEach(entry => {
        if(entry.type === "income"){
            income += entry.amount;
        }
        if(entry.type === "expense"){
            expense += entry.amount;
        }

        let li = document.createElement("li");
            li.className = entry.type;

            li.innerText = `${entry.date} | ${entry.category} | ${entry.amount}`;

            el.history.appendChild(li);
    });

    el.income.innerText = income;
    el.expense.innerText = expense;
    el.balance.innerText = income - expense;

    el.goal.innerText = goal;
    el.saved.innerText = saved;
    el.remaining.innerText = goal - saved;

    let percent = goal ? (saved/goal) * 100 : 0;

    el.progress.style.width = percent + "%";
}

loadDateInput();
updateUI();