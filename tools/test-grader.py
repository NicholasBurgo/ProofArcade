# Checks grader.py's gates without calling Claude: who may use /grade/, and which POSTs count
# as coming from the arcade's own page.
#   python3 tools/test-grader.py
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import grader  # noqa: E402

ADDRESSES = {
    # this computer and the tailnet
    '127.0.0.1': True, '127.5.6.7': True, '::1': True, '::ffff:127.0.0.1': True,
    '100.64.0.1': True, '100.70.169.49': True, '100.127.255.254': True, 'fd7a:115c:a1e0::5': True,
    # the home network, the work network, the internet, and just outside the tailnet's ranges
    '192.168.1.151': False, '192.168.1.95': False, '10.10.3.10': False, '10.0.0.2': False, '8.8.8.8': False, '100.63.255.255': False,
    '100.128.0.1': False, 'fd7a:115c:a1e1::1': False, '2001:db8::1': False, 'nonsense': False,
}
ORIGINS = [
    ('http://127.0.0.1:8230', '127.0.0.1:8230', True),
    ('http://100.70.169.49:8230', '100.70.169.49:8230', True),
    ('http://evil.example', '127.0.0.1:8230', False),
    ('http://127.0.0.1:8231', '127.0.0.1:8230', False),
    (None, '127.0.0.1:8230', False),
    ('', '127.0.0.1:8230', False),
]
fails = [f'allowed({a!r}) should be {want}' for a, want in ADDRESSES.items() if grader.allowed(a) != want]
fails += [f'same_origin({o!r}, {h!r}) should be {want}' for o, h, want in ORIGINS if grader.same_origin(o, h) != want]
print(f'{len(ADDRESSES)} addresses, {len(ORIGINS)} origins')
if fails:
    print('\n'.join(fails))
    sys.exit(1)
print('All good.')
