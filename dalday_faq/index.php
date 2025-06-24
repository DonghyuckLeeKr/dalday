<?php
$faq_file = 'faq.json';
$faqs = [];
if (file_exists($faq_file)) {
    $faqs = json_decode(file_get_contents($faq_file), true);
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>달데이 FAQ</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="view-page">
    <div class="page-container">
        <div class="hero-image"></div>
        <div class="content-wrapper">
            <div class="faq-container">
                <header>
                    <h1>달데이 관련<br>자주 묻는 질문들</h1>
                </header>
                
                <main id="faq-list">
                    <?php foreach ($faqs as $item): ?>
                        <div class="faq-item" data-id="<?php echo htmlspecialchars($item['id']); ?>">
                            <button class="faq-question">
                                <span class="question-text"><?php echo htmlspecialchars($item['question']); ?></span>
                                <i data-lucide="chevron-down"></i>
                            </button>
                            <div class="faq-answer">
                                <div class="answer-text"><?php echo $item['answer']; ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </main>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="view_script.js"></script>
</body>
</html> 