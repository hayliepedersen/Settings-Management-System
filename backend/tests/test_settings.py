import pytest


@pytest.mark.asyncio
async def test_create_setting(async_client):
    """Test creating a new setting"""
    response = await async_client.post(
        "/settings",
        json={"data": {"theme": "dark", "notifications": True}}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["data"]["theme"] == "dark"


@pytest.mark.asyncio
async def test_get_all_settings(async_client):
    """Test getting all settings with pagination"""
    # Create some settings
    for i in range(3):
        await async_client.post("/settings", json={"data": {"index": i}})
    
    response = await async_client.get("/settings?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["total"] == 3


@pytest.mark.asyncio
async def test_get_setting_by_id(async_client):
    """Test getting a single setting"""
    create_resp = await async_client.post("/settings", json={"data": {"key": "value"}})
    setting_id = create_resp.json()["id"]
    
    response = await async_client.get(f"/settings/{setting_id}")
    assert response.status_code == 200
    assert response.json()["data"]["key"] == "value"


@pytest.mark.asyncio
async def test_update_setting(async_client):
    """Test updating a setting"""
    create_resp = await async_client.post("/settings", json={"data": {"theme": "dark"}})
    setting_id = create_resp.json()["id"]
    
    update_resp = await async_client.put(
        f"/settings/{setting_id}",
        json={"data": {"theme": "light"}}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["data"]["theme"] == "light"


@pytest.mark.asyncio
async def test_delete_idempotent(async_client):
    """Test delete is idempotent"""
    create_resp = await async_client.post("/settings", json={"data": {"test": "data"}})
    setting_id = create_resp.json()["id"]
    
    # Delete twice - both should succeed
    response1 = await async_client.delete(f"/settings/{setting_id}")
    assert response1.status_code == 204
    
    response2 = await async_client.delete(f"/settings/{setting_id}")
    assert response2.status_code == 204
