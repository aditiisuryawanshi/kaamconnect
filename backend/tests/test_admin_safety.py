from app.extensions import mongo
from app.common.permissions import generate_token

def test_report_submission_and_admin_resolution(client, app):
    # Register customer
    c_res = client.post("/api/v1/auth/register", json={
        "name": "Manish Shah", "email": "manish@test.com", "password": "Pass123!4", "role": "customer"
    })
    c_token = c_res.get_json()["data"]["token"]
    c_id = c_res.get_json()["data"]["user"]["id"]

    # Register admin explicitly in database (cannot self-assign admin via public API)
    from bson import ObjectId
    from datetime import datetime, timezone
    admin_id = mongo.db.users.insert_one({
        "name": "Super Admin",
        "email": "admin@platform.com",
        "normalized_email": "admin@platform.com",
        "roles": ["admin"],
        "account_status": "active",
        "created_at": datetime.now(timezone.utc)
    }).inserted_id

    with app.app_context():
        admin_token = generate_token(str(admin_id), "admin@platform.com", ["admin"])
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Customer files report
    rep_res = client.post("/api/v1/reports", json={
        "target_type": "user",
        "target_id": c_id,
        "reason": "Suspicious activity or impersonation",
        "description": "User profile seems duplicate of another technician."
    }, headers={"Authorization": f"Bearer {c_token}"})
    assert rep_res.status_code == 201
    report_id = rep_res.get_json()["data"]["id"]

    # Customer tries to access admin dashboard -> 403 Forbidden
    cust_admin_try = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {c_token}"})
    assert cust_admin_try.status_code == 403

    # Admin accesses dashboard
    dash_res = client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert dash_res.status_code == 200
    metrics = dash_res.get_json()["data"]
    assert "total_users" in metrics
    assert "pending_reports" in metrics
    assert metrics["pending_reports"] >= 1

    # Admin resolves report
    resolve_res = client.post(f"/api/v1/admin/reports/{report_id}/resolve", json={
        "resolution": "action_taken",
        "resolution_notes": "Reviewed and resolved by moderation team."
    }, headers=admin_headers)
    assert resolve_res.status_code == 200
    assert resolve_res.get_json()["data"]["status"] == "resolved"

    # Verify audit log was created
    audit_res = client.get("/api/v1/admin/audit-logs", headers=admin_headers)
    assert audit_res.status_code == 200
    logs = audit_res.get_json()["data"]
    assert len(logs) >= 1
    assert logs[0]["action"] == "resolve_report"
