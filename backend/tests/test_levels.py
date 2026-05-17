from app.executor import run_python
from app.levels import LEVELS


VALID_SOLUTIONS = {
    "variables-01": "x = 10\nprint(x)",
    "types-01": "count = 3\nname = 'Python'\nactive = True",
    "strings-01": "name = 'Ada'\nmessage = f'Hello, {name}!'",
    "lists-01": "numbers = [1, 2, 3, 4, 5]\nmiddle = numbers[1:4]",
    "dicts-01": "profile = {'name': 'Lin', 'score': 8}\nsummary = {'name': profile['name'], 'passed': profile['score'] >= 6}",
    "conditionals-01": "score = 86\nif score >= 90:\n    grade = 'A'\nelif score >= 60:\n    grade = 'B'\nelse:\n    grade = 'C'",
    "loops-01": "numbers = [1, 2, 3, 4, 5, 6]\nevens = [number for number in numbers if number % 2 == 0]",
    "functions-01": "def add_tax(price):\n    return price * 1.1\n\nresult = add_tax(100)",
    "errors-01": "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\nresult = safe_divide(10, 0)",
    "challenge-01": "logs = ['INFO start', 'ERROR disk', 'INFO retry', 'ERROR timeout']\nerror_count = 0\nfor line in logs:\n    if line.startswith('ERROR'):\n        error_count += 1",
    "string-methods-01": "raw = '  python,testing,debugging  '\ntopics = [item.strip().title() for item in raw.strip().split(',')]",
    "comprehensions-01": "numbers = [1, 2, 3, 4, 5, 6]\nsquares = [number * number for number in numbers if number % 2 == 0]",
    "nested-data-01": "students = [{'name': 'Ada', 'score': 9}, {'name': 'Lin', 'score': 6}]\ntop_student = max(students, key=lambda student: student['score'])\nsummary = {'name': top_student['name'], 'score': top_student['score']}",
    "file-lines-01": "lines = ['INFO start', 'WARN cache', 'ERROR disk', 'ERROR timeout']\nerrors = [line for line in lines if line.startswith('ERROR')]\nerror_count = len(errors)",
    "challenge-02": "orders = [{'item': 'book', 'price': 30, 'qty': 2}, {'item': 'pen', 'price': 5, 'qty': 4}]\ntotal = sum(order['price'] * order['qty'] for order in orders)\nlabels = [f\"{order['item']} x{order['qty']}\" for order in orders]",
    "operators-01": "price = 120\ndiscount = 0.8\nfinal_price = price * discount",
    "rounding-01": "scores = [88, 92, 79]\naverage = round(sum(scores) / len(scores), 1)",
    "strings-index-01": "ticket = 'CN-2026-042'\nregion = ticket[:2]",
    "strings-cleanup-02": "raw_name = '  Ada_Lovelace  '\nusername = raw_name.strip().lower()",
    "conditionals-02": "subtotal = 86\nif subtotal >= 99:\n    shipping = 0\nelse:\n    shipping = 12",
    "conditionals-boss-01": "score = 72\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 60:\n    grade = 'C'\nelse:\n    grade = 'D'",
    "list-append-01": "tasks = ['review']\nnew_task = 'deploy'\ntasks.append(new_task)",
    "list-sort-01": "scores = [72, 95, 88]\nranked = [95, 88, 72]",
    "loop-sum-01": "prices = [12, 35, 8]\ntotal = 0\nfor price in prices:\n    total += price",
    "loop-boss-01": "target = 7\nguesses = [3, 5, 7, 9]\nfound_at = -1\nfor index, guess in enumerate(guesses):\n    if guess == target:\n        found_at = index\n        break",
    "dict-update-01": "stock = {'pen': 10, 'book': 4}\nincoming = 5\nstock['pen'] += incoming",
    "dict-counting-01": "tags = ['python', 'web', 'python', 'data']\ncounts = {}\nfor tag in tags:\n    counts[tag] = counts.get(tag, 0) + 1",
    "function-params-01": "def greet(name):\n    return f'Welcome, {name}!'\n\nmessage = greet('Ada')",
    "function-return-02": "def subtotal(price, qty):\n    return price * qty\n\nresult = subtotal(15, 3)",
    "project-calculator-01": "a = 6\nb = 7\nop = '*'\nif op == '+':\n    result = a + b\nelif op == '-':\n    result = a - b\nelif op == '*':\n    result = a * b\nelse:\n    result = a / b",
    "project-word-count-01": "text = 'Python is fun and python is useful'\ncounts = {}\nfor word in text.lower().split():\n    counts[word] = counts.get(word, 0) + 1",
    "project-students-01": "students = [{'name': 'Ada', 'score': 92}, {'name': 'Lin', 'score': 58}, {'name': 'Max', 'score': 75}]\npassed_names = [student['name'] for student in students if student['score'] >= 60]\naverage_score = round(sum(student['score'] for student in students) / len(students), 1)",
}


def test_all_mvp_levels_have_valid_solutions():
    assert len(LEVELS) >= 30
    assert set(VALID_SOLUTIONS) == set(LEVELS)

    for level_id, code in VALID_SOLUTIONS.items():
        result = run_python(level_id, code)
        assert result["error"] is None, level_id
        assert result["passed"] is True, level_id
        assert all(check["passed"] for check in result["checks"]), level_id


def test_starter_code_does_not_pass_by_default():
    for level_id, level in LEVELS.items():
        result = run_python(level_id, level["starterCode"])

        assert result["passed"] is False, level_id
