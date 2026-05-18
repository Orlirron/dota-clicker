let gold = 0;
let damage = 40; 
let critChance = 0; 
let creepRegen = 15; // Кріп буде відновлювати 15 ХП кожну секунду
let creepLevel = 1;

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
const levelText = document.getElementById('levelText');
const btnBuyBlade = document.getElementById('buyQuellingBlade');
const btnBuyDemon = document.getElementById('buyDemonEdge');
const btnBuyCrystalys = document.getElementById('buyCrystalys');
const btnBuyDesolator = document.getElementById('buyDesolator'); // Нова кнопка
const btnBuySkadi = document.getElementById('buySkadi');
const maxHpText = document.getElementById('maxHpText');

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
        // --- НОВА ЛОГІКА ПРОКАЧКИ КРІПА ---
        creepLevel = creepLevel + 1; // Підвищуємо рівень
        
        // Покращуємо його статі (Баланс можеш придумати свій)
        creepMaxHP = creepMaxHP + 200; // Кожен левел +200 ХП
        creepArmor = creepArmor + 2; // Кожен левел +2 броні
        
        // Відновлюємо ХП до НОВОГО максимуму
        creepCurrentHP = creepMaxHP; 
        
        // Даємо БІЛЬШЕ голди за вбивство товстого кріпа (наприклад, +50 за кожен левел)
        let killReward = 100 + (creepLevel * 50); 
        gold = gold + killReward;
        // ------------------------------------

// --- НОВИЙ ВІЗУАЛ ---
        maxHpText.textContent = creepMaxHP; // Оновлюємо праву цифру (наприклад, стане 700)
        hpBar.max = creepMaxHP; // Збільшуємо місткість самої смужки!
        armorText.textContent = creepArmor;
        // --------------------
        
        msg.textContent = `Кріп помер! Наступний рівень: ${creepLevel}. Нагорода: ${killReward} голди.`;
        msg.style.color = "#ffd700";
        
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

// Знаходимо кнопку Дагону
const btnCastDagon = document.getElementById('castDagon');

// ЛОГІКА ДАГОНУ
btnCastDagon.addEventListener('click', function() {
    
    // 1. Завдаємо шкоди (Дагон ігнорує броню!)
    let dagonDamage = 300;
    creepCurrentHP = creepCurrentHP - dagonDamage;

    // Перевіряємо, чи вбили ми кріпа Дагоном
if (creepCurrentHP <= 0) {
        // --- НОВА ЛОГІКА ПРОКАЧКИ КРІПА ---
        creepLevel = creepLevel + 1; // Підвищуємо рівень
        
        // Покращуємо його статі (Баланс можеш придумати свій)
        creepMaxHP = creepMaxHP + 200; // Кожен левел +200 ХП
        creepArmor = creepArmor + 2; // Кожен левел +2 броні
        
        maxHpText.textContent = creepMaxHP; // Оновлюємо праву цифру (наприклад, стане 700)
        hpBar.max = creepMaxHP; // Збільшуємо місткість самої смужки!
        armorText.textContent = creepArmor;
        creepCurrentHP = creepMaxHP; 
        
        // Даємо БІЛЬШЕ голди за вбивство товстого кріпа (наприклад, +50 за кожен левел)
        let killReward = 100 + (creepLevel * 50); 
        gold = gold + killReward;
        // ------------------------------------

        // Оновлюємо текст рівня на екрані
        levelText.textContent = creepLevel;
        
        msg.textContent = `Кріп помер! Наступний рівень: ${creepLevel}. Нагорода: ${killReward} голди.`;
        msg.style.color = "#ffd700";
    }

    // Оновлюємо візуал
    displayGold.textContent = gold;
    hpText.textContent = creepCurrentHP;
    hpBar.value = creepCurrentHP;

    // 2. ВМИКАЄМО КУЛДАУН
    btnCastDagon.disabled = true; // Вимикаємо кнопку
    btnCastDagon.textContent = "Дагон на перезарядці..."; // Міняємо текст
    btnCastDagon.style.backgroundColor = "#555555"; // Робимо її сірою

    // 3. ТАЙМЕР ЗАТРИМКИ (Повертаємо Дагон через 10 секунд)
    // setTimeout виконає код всередині рівно 1 раз через вказаний час
    setTimeout(function() {
        btnCastDagon.disabled = false; // Вмикаємо кнопку назад
        btnCastDagon.textContent = "Вдарити Дагоном! (Шкода: 300 | КД: 10 сек)"; // Повертаємо текст
        btnCastDagon.style.backgroundColor = "#8a2be2"; // Повертаємо фіолетовий колір
    }, 10000); // 10000 мілісекунд = 10 секунд
});