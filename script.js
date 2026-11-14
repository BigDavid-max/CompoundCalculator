
const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const frequency = document.getElementById("frequency");

const total = document.getElementById("total");
const initial = document.getElementById("initial");
const interest = document.getElementById("interest");
const growth = document.getElementById("growth");

const calculateButton = document.getElementById("calculate");
const resetButton = document.getElementById("reset");

const money = value =>
    new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR"
    }).format(value);

function calculate() {
    const p = Number(amount.value);
    const r = Number(rate.value) / 100;
    const t = Number(years.value);
    const n = Number(frequency.value);

    if (
        amount.value === "" ||
        rate.value === "" ||
        years.value === "" ||
        !Number.isFinite(p) ||
        !Number.isFinite(r) ||
        !Number.isFinite(t) ||
        p < 0 || r < 0 || r > 1 || t < 0 || t > 1000
    ) {
        alert("Please enter valid values.");
        return;
    }

    const finalAmount = p * Math.pow(1 + r / n, n * t);
    const earned = finalAmount - p;

    total.textContent = money(finalAmount);
    initial.textContent = money(p);
    interest.textContent = money(earned);

    growth.textContent = p > 0
        ? ((earned / p) * 100).toFixed(2) + "%"
        : "0.00%";

    drawChart(p, r, t, n);
}

function drawChart(p, r, t, n) {
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (p === 0 || t === 0) {
        ctx.fillStyle = "#aab7cc";
        ctx.font = "16px Arial";
        ctx.fillText("Add an investment and duration to see growth.", 10, 100);
        return;
    }

    const values = [];

    for (let i = 0; i <= 100; i++) {
        const time = t * i / 100;
        values.push(p * Math.pow(1 + r / n, n * time));
    }

    const max = Math.max(...values) * 1.1;
    const min = Math.min(0, ...values);

    ctx.strokeStyle = "#263348";
    ctx.lineWidth = 1;

    for (let i = 0; i < 4; i++) {
        const y = height - i * height / 3 - 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.beginPath();

    values.forEach((value, i) => {
        const x = i / 100 * width;
        const y = height - 10 -
            (value - min) / (max - min) * (height - 20);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = "#20d985";
    ctx.lineWidth = 4;
    ctx.stroke();
}

calculateButton.addEventListener("click", calculate);

resetButton.addEventListener("click", () => {
    amount.value = 1000;
    rate.value = 5;
    years.value = 10;
    frequency.value = 1;

    total.textContent = "€1,628.89";
    initial.textContent = "€1,000.00";
    interest.textContent = "€628.89";
    growth.textContent = "62.89%";

    drawChart(1000, 0.05, 10, 1);
});

calculate();
