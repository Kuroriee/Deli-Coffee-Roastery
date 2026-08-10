# Emergent Auth Testing Playbook (Deli Coffee Admin)

Admin whitelist emails:
- delicoffeedocument@gmail.com
- ks.kuro11@gmail.com

## Test Session (bypass Google for automated testing)

```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'delicoffeedocument@gmail.com',
  name: 'Test Admin',
  picture: 'https://via.placeholder.com/150',
  is_admin: true,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
"
```

## Endpoints
- GET /api/auth/me → returns current user or 401
- POST /api/auth/session → body: {"session_id": "..."} exchanges emergent session_id, sets httpOnly cookie
- POST /api/auth/logout → clears cookie & DB session

## Access control
- Whitelist enforced in /api/auth/session — non-whitelisted emails receive 403
- All /api/admin/* endpoints require valid session_token + admin flag
