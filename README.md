# Cloud Functions

## Endpoints

### Create user:
[POST] createUser

Requires the following fields:
- name (required)
- phone (required)

### Read user:
[GET] readUser?id=*userID*

### Update user:

[PUT] updateUser?id=*userID*

Requires the following fields:
- name (required)
- phone (required)

### Delete user:
[DELETE] deleteUser?id=*userID*