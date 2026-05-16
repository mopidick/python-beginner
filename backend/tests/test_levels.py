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
}


def test_all_mvp_levels_have_valid_solutions():
    assert len(LEVELS) == 15

    for level_id, code in VALID_SOLUTIONS.items():
        result = run_python(level_id, code)
        assert result["error"] is None, level_id
        assert result["passed"] is True, level_id
        assert all(check["passed"] for check in result["checks"]), level_id
