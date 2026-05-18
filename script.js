let gold = 0;
let damage = 40; 
let critChance = 0; 
let creepRegen = 15; // Кріп буде відновлювати 15 ХП кожну секунду

let creepMaxHP = 500;
let creepCurrentHP = 500;
let creepArmor = 10; // Базова броня кріпа

const btnHit = document.getElementById('hitCreep');
const displayGold = document.getElementById('goldCounter');
const displayDamage = document.getElementById('damageText');
const msg = document.getElementById('message');
const hpText = document.getElementById('hpText');
const hpBar = document.getElementById('hpBar');
const armorText = document.getElementById('armorText'); // Новий елемент - текст броні

const btnBuyBlade = document.getElementById('buyQuellingBlade');
const btnBuyDemon = document.getElementById('buyDemonEdge');
const btnBuyCrystalys = document.getElementById('buyCrystalys');
const btnBuyDesolator = document.getElementById('buyDesolator'); // Нова кнопка
const btnBuySkadi = document.getElementById('buySkadi');

// 1. ЛОГІКА УДАРУ
btnHit.addEventListener('click', function() {
    let finalDamage = damage; 
    let isCrit = false; 

    // Перевірка на кріт
    if (Math.random() < critChance) {
        finalDamage = damage * 2;
        isCrit = true;
    }

    // --- НОВЕ: РОЗРАХУНОК ШКОДИ З УРАХУВАННЯМ БРОНІ ---
    // Формула: Шкода мінус броня
    let actualDamage = finalDamage - creepArmor;
    
    // Якщо броні більше, ніж шкоди (наприклад, 10 шкоди - 20 броні = -10),
    // ми не даємо шкоді впасти нижче 1, щоб завжди завдавати хоч якусь шкоду.
    if (actualDamage < 1) {
        actualDamage = 1;
    }
    // ----------------------------------------------------

    // Віднімаємо вже ACTUAL damage (фактичну шкоду)
    creepCurrentHP = creepCurrentHP - actualDamage;

    if (creepCurrentHP <= 0) {
        gold = gold + 100; 
        creepCurrentHP = creepMaxHP; 
        
        if (isCrit) {
            msg.textContent = `КРИТ-ЛАСТХІТ на ${actualDamage} (Блоковано: ${creepArmor})! +100 золота.`;
            msg.style.color = "#ff0000"; 
        } else {
            msg.textContent = `Ластхіт на ${actualDamage}! +100 золота.`;
            msg.style.color = "#ffd700"; 
        }
    } else {
        if (isCrit) {
            msg.textContent = `КРІТ! Шкода: ${actualDamage} (Броня поглинула ${creepArmor}).`;
            msg.style.color = "#ff0000"; 
        } else {
            msg.textContent = `Шкода: ${actualDamage} (Броня поглинула ${creepArmor}).`;
            msg.style.color = "#00ff00"; 
        }
    }

    displayGold.textContent = gold;
    hpText.textContent = creepCurrentHP;
    hpBar.value = creepCurrentHP;
});

// Крамниця
btnBuyBlade.addEventListener('click', function() {
    if (gold >= 200) {
        gold = gold - 200; 
        damage = damage + 20; 
        displayGold.textContent = gold; 
        displayDamage.textContent = damage;
        msg.textContent = "Куплено Quelling Blade!";
        btnBuyBlade.disabled = true; 
    } else {
        msg.textContent = "Не вистачає голди!";
    }
});

btnBuyDemon.addEventListener('click', function() {
    if (gold >= 1000) {
        gold = gold - 1000; 
        damage = damage + 100; 
        displayGold.textContent = gold; 
        displayDamage.textContent = damage;
        msg.textContent = "Куплено Demon Edge!";
        btnBuyDemon.disabled = true; 
    } else {
        msg.textContent = "Не вистачає голди!";
    }
});

btnBuyCrystalys.addEventListener('click', function() {
    if (gold >= 300) {
        gold = gold - 300;
        critChance = 0.30; 
        displayGold.textContent = gold;
        msg.textContent = "Куплено Crystalys!";
        btnBuyCrystalys.disabled = true;
    } else {
        msg.textContent = "Не вистачає голди!";
    }
});

// 2. ЛОГІКА DESOLATOR
btnBuyDesolator.addEventListener('click', function() {
    if (gold >= 800) {
        gold = gold - 800;
        creepArmor = creepArmor - 15; // Зменшуємо броню кріпа (може стати мінусовою!)
        
        displayGold.textContent = gold;
        armorText.textContent = creepArmor; // Оновлюємо текст броні на екрані
        
        msg.textContent = "Куплено Desolator! Броня кріпа знижена на 15.";
        btnBuyDesolator.disabled = true;
    } else {
        msg.textContent = "Не вистачає голди на Desolator!";
    }
});

// Знаходимо кнопку Мідаса
const btnBuyMidas = document.getElementById('buyMidas');

// ЛОГІКА HAND OF MIDAS (Таймери)
btnBuyMidas.addEventListener('click', function() {
    if (gold >= 1500) {
        gold = gold - 1500;
        displayGold.textContent = gold;
        msg.textContent = "Куплено Hand of Midas! Автоматичний фарм запущено.";
        msg.style.color = "#ffd700"; // Робимо повідомлення золотим
        
        btnBuyMidas.disabled = true; // Вимикаємо кнопку

        // Запускаємо таймер!
        // setInterval буде виконувати функцію всередині себе кожні 1000 мілісекунд (1 сек)
        setInterval(function() {
            gold = gold + 50; // Додаємо 50 голди
            displayGold.textContent = gold; // Оновлюємо цифру на екрані
            
            // Ми не виводимо повідомлення, щоб не спамити,
            // але голда буде красиво капати сама собою.
        }, 1000); 

    } else {
        msg.textContent = "Не вистачає голди на Hand of Midas!";
    }
});

// --- ПАСИВНИЙ РЕГЕН КРІПА ---
// Цей таймер запускається одразу, як тільки сторінка завантажується
setInterval(function() {
    // Якщо кріп поранений (його поточне ХП менше за максимальне)
    if (creepCurrentHP < creepMaxHP) {
        
        // Додаємо реген
        creepCurrentHP = creepCurrentHP + creepRegen;

        // Перевірка: якщо після регену ХП стало більше за максимум (наприклад 510/500)
        // ми примусово обрізаємо його назад до 500.
        if (creepCurrentHP > creepMaxHP) {
            creepCurrentHP = creepMaxHP;
        }

        // Оновлюємо візуал на екрані
        hpText.textContent = creepCurrentHP;
        hpBar.value = creepCurrentHP;
    }
}, 1000); // Таймер спрацьовує кожні 1000 мілісекунд (1 сек)

btnBuySkadi.addEventListener('click', function() {
    if (gold >= 1200) {
        gold = gold - 1200;
        creepRegen = creepRegen - 10;

        displayGold.textContent = gold;
        msg.textContent = 'Куплено Eye Of Skadi ! хп реген ворога зменшено';
        btnBuySkadi.disabled = true;

    } else {
        msg.textContent = "Не вистачає голди на Eye Of Skadi";
    }
})