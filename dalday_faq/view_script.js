document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faq-list');

    if (faqList) {
        faqList.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;

            const answer = questionBtn.nextElementSibling;
            const wasActive = questionBtn.classList.contains('active');

            // Close all open answers
            faqList.querySelectorAll('.faq-question.active').forEach(activeBtn => {
                if (activeBtn !== questionBtn) {
                    activeBtn.classList.remove('active');
                    activeBtn.nextElementSibling.classList.remove('show');
                }
            });
            
            // Toggle current item
            questionBtn.classList.toggle('active');
            answer.classList.toggle('show');
        });
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}); 