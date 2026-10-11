def test_user_registration(client):
    res = client.post("/api/v1/auth/register", json={
        "name": "Amit Patil",
        "email": "amit@test.com",
        "phone": "+919876543210",
        "password": "Password123!",
        "role": "worker"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data["data"]
    assert data["data"]["user"]["email"] == "amit@test.com"
    assert "worker" in data["data"]["user"]["roles"]

def test_duplicate_registration_rejected(client):
    # Register once
    client.post("/api/v1/auth/register", json={
        "name": "Amit Patil",
        "email": "amit@test.com",
        "password": "Password123!",
        "role": "worker"
    })
    # Register again with same email
    res = client.post("/api/v1/auth/register", json={
        "name": "Amit Patil Duplicate",
        "email": "amit@test.com",
        "password": "Password123!",
        "role": "customer"
    })
    assert res.status_code == 409
    assert res.get_json()["success"] is False

def test_login_flow(client):
    # Register
    client.post("/api/v1/auth/register", json={
        "name": "Pooja Verma",
        "email": "pooja@test.com",
        "password": "SecurePassword1",
        "role": "customer"
    })
    # Login with valid credentials
    res = client.post("/api/v1/auth/login", json={
        "email": "pooja@test.com",
        "password": "SecurePassword1"
    })
    assert res.status_code == 200
    token = res.get_json()["data"]["token"]
    assert token is not None

    # Access /me with token
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.get_json()["data"]["name"] == "Pooja Verma"

def test_role_addition(client):
    reg = client.post("/api/v1/auth/register", json={
        "name": "Sunil Kumar",
        "email": "sunil@test.com",
        "password": "Password123!",
        "role": "customer"
    })
    token = reg.get_json()["data"]["token"]

    # Add worker role
    res = client.post("/api/v1/auth/roles", json={"role": "worker"}, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    roles = res.get_json()["data"]["roles"]
    assert "customer" in roles
    assert "worker" in roles
