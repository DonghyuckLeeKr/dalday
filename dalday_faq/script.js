document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faq-list');
    const addFaqBtn = document.getElementById('add-faq-btn');

    const API_URL = 'api.php';

    let faqData = [];

    const api = {
        get: () => fetch(API_URL).then(res => res.json()),
        post: (data) => fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json())
    };

    const renderFaqs = () => {
        faqList.innerHTML = '';
        faqData.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.dataset.id = item.id;

            faqItem.innerHTML = `
                <div class="faq-question">
                    <span class="question-text" contenteditable="true">${item.question}</span>
                    <div class="faq-item-controls">
                        <button class="control-btn save-btn" title="저장"><i data-lucide="save"></i></button>
                        <button class="control-btn delete-btn" title="삭제"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="answer-text" contenteditable="true">${item.answer}</div>
                </div>
            `;
            faqList.appendChild(faqItem);
        });
        addEventListeners();
        lucide.createIcons();
    };

    const addEventListeners = () => {
        // Accordion functionality
        faqList.querySelectorAll('.faq-question').forEach(questionBtn => {
            questionBtn.addEventListener('click', (e) => {
                if (e.target.closest('.faq-item-controls')) {
                    return;
                }
                
                const answer = questionBtn.nextElementSibling;
                const wasActive = questionBtn.classList.contains('active');

                faqList.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
                    if (openAnswer.previousElementSibling !== questionBtn) {
                        openAnswer.classList.remove('show');
                        openAnswer.previousElementSibling.classList.remove('active');
                    }
                });

                questionBtn.classList.toggle('active');
                answer.classList.toggle('show');
            });
        });

        // Save functionality
        faqList.querySelectorAll('.save-btn').forEach(saveBtn => {
            saveBtn.addEventListener('click', async (e) => {
                const faqItem = e.target.closest('.faq-item');
                const id = faqItem.dataset.id;
                const question = faqItem.querySelector('.question-text').innerText;
                const answer = faqItem.querySelector('.answer-text').innerHTML.replace(/<br>/g, '\n').replace(/<div>/g, '\n').replace(/<\/div>/g, '').trim().replace(/\n/g, '<br>');

                const response = await api.post({ action: 'update', id, question, answer });
                if (response.status === 'success') {
                    const icon = saveBtn.querySelector('i');
                    icon.dataset.lucide = 'check';
                    lucide.createIcons({
                        nodes: [icon],
                        attrs: { 
                            'stroke-width': 3 
                        }
                    });
                    saveBtn.style.color = 'hsl(142.1 76.2% 41.2%)';
                    setTimeout(() => { 
                        icon.dataset.lucide = 'save';
                        lucide.createIcons({ nodes: [icon] });
                        saveBtn.style.color = '';
                     }, 2000);
                } else {
                    alert('저장에 실패했습니다.');
                }
            });
        });

        // Delete functionality
        faqList.querySelectorAll('.delete-btn').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', async (e) => {
                if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return;
                
                const faqItem = e.target.closest('.faq-item');
                const id = faqItem.dataset.id;
                
                const response = await api.post({ action: 'delete', id });
                if (response.status === 'success') {
                    faqItem.remove();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            });
        });
    };

    const addNewFaq = async () => {
        const response = await api.post({ action: 'create' });
        if (response.status === 'success') {
            loadFaqs();
        } else {
            alert('새 항목 추가에 실패했습니다.');
        }
    };

    const loadFaqs = async () => {
        faqData = await api.get();
        renderFaqs();
    };

    addFaqBtn.addEventListener('click', addNewFaq);

    loadFaqs();
    lucide.createIcons();
}); 