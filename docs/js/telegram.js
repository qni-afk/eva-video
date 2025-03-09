// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const BOT_TOKEN = '7789322601:AAHBQTRFGVBoQARf7Sc4fGad668332wr1l4';
// Замените 'YOUR_CHAT_ID' на ID чата, куда будут приходить сообщения
const CHAT_ID = '5073817559';

document.getElementById('telegramForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const text = `Новое сообщение!\n\nИмя: ${name}\nСообщение: ${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text
            })
        });

        if (response.ok) {
            alert('Сообщение успешно отправлено!');
            document.getElementById('telegramForm').reset();
        } else {
            throw new Error('Ошибка при отправке сообщения');
        }
    } catch (error) {
        alert('Произошла ошибка: ' + error.message);
    }
});
