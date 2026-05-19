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
    "review-basics-01": "name = 'Ada'\ntask_count = 3\nsummary = f'{name} has {task_count} tasks'",
    "review-collections-01": "amounts = [12, 80, 35, 120]\nlarge_orders = []\ntotal_large = 0\nfor amount in amounts:\n    if amount >= 50:\n        large_orders.append(amount)\n        total_large += amount",
    "review-dicts-01": "statuses = ['ok', 'fail', 'ok', 'retry', 'fail']\ncounts = {}\nfor status in statuses:\n    counts[status] = counts.get(status, 0) + 1",
    "review-functions-errors-01": "def parse_count(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nvalid = parse_count('12')\ninvalid = parse_count('oops')",
    "booleans-01": "enabled = True\nrole = 'admin'\ncan_publish = enabled and role == 'admin'",
    "none-empty-01": "items = []\nif items:\n    display_items = items\nelse:\n    display_items = ['\\u6682\\u65e0\\u6570\\u636e']",
    "project-csv-cleanup-01": "rows = [' ada, 92', 'lin, 58', ' MAX, 75']\nnames = []\nscores = []\nfor row in rows:\n    name, score = row.split(',')\n    names.append(name.strip().title())\n    scores.append(int(score.strip()))",
    "project-grade-report-01": "students = [{'name': 'Ada', 'score': 92}, {'name': 'Lin', 'score': 58}, {'name': 'Max', 'score': 75}]\npassed_count = len([student for student in students if student['score'] >= 60])\naverage = round(sum(student['score'] for student in students) / len(students), 1)\nreport = {'passed_count': passed_count, 'average': average}",
    "review-string-pipeline-01": "raw_tags = ' Python | Testing | Debugging '\ntags = [tag.strip().lower() for tag in raw_tags.split('|')]",
    "review-loop-accumulators-01": "amounts = [30, -5, 18, -2, 12]\npositive_total = 0\nrefunds = []\nfor amount in amounts:\n    if amount > 0:\n        positive_total += amount\n    else:\n        refunds.append(amount)",
    "function-normalize-01": "raw_names = [' ada ', 'LIN', ' max chen ']\ndef normalize_name(name):\n    return name.strip().title()\n\ncleaned_names = [normalize_name(name) for name in raw_names]",
    "defensive-index-01": "candidates = []\nif candidates:\n    first_candidate = candidates[0]\n    message = first_candidate\nelse:\n    first_candidate = None\n    message = '暂无候选'",
    "project-sales-tax-01": "orders = [{'item': 'book', 'price': 30, 'qty': 2}, {'item': 'course', 'price': 85, 'qty': 1}]\nsubtotal = sum(order['price'] * order['qty'] for order in orders)\ntax = round(subtotal * 0.08, 1)\ntotal = round(subtotal + tax, 1)\ninvoice = {'subtotal': subtotal, 'tax': tax, 'total': total}",
    "project-inventory-alert-01": "stock = {'paper': 5, 'pen': 18, 'ink': 13, 'staple': 9}\nlow_items = []\nreorder = {}\nfor item, count in stock.items():\n    if count < 10:\n        low_items.append(item)\n        reorder[item] = 20 - count",
    "project-user-slugs-01": "raw_users = [' Ada Lovelace ', 'lin tan', 'MAX CHEN']\nslugs = []\nlookup = {}\nfor raw_user in raw_users:\n    clean_name = raw_user.strip().title()\n    slug = clean_name.lower().replace(' ', '-')\n    slugs.append(slug)\n    lookup[slug] = clean_name",
    "project-support-triage-01": "tickets = [{'id': 101, 'priority': 'low', 'status': 'open'}, {'id': 102, 'priority': 'high', 'status': 'open'}, {'id': 103, 'priority': 'high', 'status': 'closed'}, {'id': 104, 'priority': 'high', 'status': 'open'}]\nurgent_ids = []\nopen_count = 0\nfor ticket in tickets:\n    if ticket['status'] == 'open':\n        open_count += 1\n        if ticket['priority'] == 'high':\n            urgent_ids.append(ticket['id'])",
    "project-expense-report-01": "expenses = [{'category': 'travel', 'amount': 120, 'approved': True}, {'category': 'meal', 'amount': 45, 'approved': True}, {'category': 'travel', 'amount': 30, 'approved': False}, {'category': 'book', 'amount': 80, 'approved': True}]\ntotals = {}\napproved_total = 0\nfor expense in expenses:\n    if expense['approved']:\n        category = expense['category']\n        amount = expense['amount']\n        totals[category] = totals.get(category, 0) + amount\n        approved_total += amount",
    "project-log-window-01": "logs = [{'minute': 3, 'message': 'ERROR boot'}, {'minute': 10, 'message': 'INFO ready'}, {'minute': 12, 'message': 'ERROR payment'}, {'minute': 15, 'message': 'WARN retry'}]\nrecent_errors = []\nfor log in logs:\n    if log['minute'] >= 10 and log['message'].startswith('ERROR'):\n        recent_errors.append(log['message'])\nerror_count = len(recent_errors)",
    "project-feature-flags-01": "users = [{'name': 'Ada', 'plan': 'pro', 'beta': False}, {'name': 'Lin', 'plan': 'free', 'beta': False}, {'name': 'Max', 'plan': 'free', 'beta': True}]\nenabled_users = []\nfor user in users:\n    if user['plan'] == 'pro' or user['beta']:\n        enabled_users.append(user['name'])\nrollout = {'enabled': len(enabled_users), 'total': len(users)}",
    "project-score-bands-01": "scores = [{'name': 'Ada', 'score': 95}, {'name': 'Lin', 'score': 81}, {'name': 'Max', 'score': 67}, {'name': 'Yi', 'score': 92}]\nbands = {'A': 0, 'B': 0, 'C': 0}\npassed_names = []\nfor item in scores:\n    score = item['score']\n    if score >= 90:\n        bands['A'] += 1\n    elif score >= 75:\n        bands['B'] += 1\n    else:\n        bands['C'] += 1\n    if score >= 60:\n        passed_names.append(item['name'])",
}


def test_all_mvp_levels_have_valid_solutions():
    assert len(LEVELS) >= 52
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


def test_level_copy_is_human_readable():
    text_fields = ["title", "chapter", "difficulty", "story", "goal", "pattern", "recap", "concept", "instructions"]

    for level_id, level in LEVELS.items():
        for field in text_fields:
            assert_readable(level[field], f"{level_id}.{field}")

        assert len(level["tags"]) > 0, level_id
        for index, tag in enumerate(level["tags"]):
            assert_readable(tag, f"{level_id}.tags[{index}]")

        assert len(level["hints"]) >= 3, level_id
        for index, hint in enumerate(level["hints"]):
            assert_readable(hint, f"{level_id}.hints[{index}]")

        for check in level["checks"]:
            assert_readable(check["label"], f"{level_id}.{check['id']}.label")
            assert_readable(check.get("hint", ""), f"{level_id}.{check['id']}.hint")


def test_project_levels_have_multiple_checks():
    project_levels = [level for level in LEVELS.values() if level["mode"] == "project"]

    assert len(project_levels) >= 10
    for level in project_levels:
        assert len(level["checks"]) >= 2, level["id"]


def assert_readable(value: str, label: str):
    assert value.strip(), label
    assert "??" not in value, label
    assert "\ufffd" not in value, label
    assert "TODO" not in value.upper(), label
