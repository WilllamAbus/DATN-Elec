const Role = require('./role.model');

async function createDefaultRoles() {
    const roles = [
        { name: 'user', permissions: [] },
        { name: 'admin', permissions: [] }
    ];

    for (let role of roles) {
        let existingRole = await Role.findOne({ name: role.name });
        if (!existingRole) {
            let newRole = new Role(role);
            await newRole.save();
        }
    }

    console.log('Default roles created');
}

createDefaultRoles().catch(err => console.log(err));
