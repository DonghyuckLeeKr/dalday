<?php
header('Content-Type: application/json');

$filePath = 'faq.json';
$allowedActions = ['create', 'update', 'delete'];

// Read existing data
function getFaqs() {
    global $filePath;
    if (!file_exists($filePath)) {
        return [];
    }
    $json = file_get_contents($filePath);
    return json_decode($json, true);
}

// Write data
function saveFaqs($data) {
    global $filePath;
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents($filePath, $json, LOCK_EX);
}

$method = $_SERVER['REQUEST_METHOD'];
$faqs = getFaqs();

if ($method === 'GET') {
    echo json_encode($faqs);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;

    if (!in_array($action, $allowedActions)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
    }

    try {
        switch ($action) {
            case 'create':
                $newItem = [
                    'id' => (string)time() . rand(100, 999),
                    'question' => '새 질문',
                    'answer' => '새 답변을 입력하세요.'
                ];
                $faqs[] = $newItem;
                saveFaqs($faqs);
                echo json_encode(['status' => 'success', 'item' => $newItem]);
                break;

            case 'update':
                $id = $input['id'] ?? null;
                $question = $input['question'] ?? null;
                $answer = $input['answer'] ?? null;
                $updated = false;

                foreach ($faqs as &$item) {
                    if ($item['id'] === $id) {
                        $item['question'] = $question;
                        $item['answer'] = $answer;
                        $updated = true;
                        break;
                    }
                }

                if ($updated) {
                    saveFaqs($faqs);
                    echo json_encode(['status' => 'success']);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Item not found']);
                }
                break;

            case 'delete':
                $id = $input['id'] ?? null;
                $initialCount = count($faqs);
                $faqs = array_filter($faqs, function ($item) use ($id) {
                    return $item['id'] !== $id;
                });

                if (count($faqs) < $initialCount) {
                    saveFaqs(array_values($faqs));
                    echo json_encode(['status' => 'success']);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Item not found']);
                }
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'An internal server error occurred.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']); 