export class SecurityUtils {

    public static checkPermissions(permisos) {
        const user = localStorage.getItem('fullUser');
        if (user) {
            const userPermissions = JSON.parse(user).permisos;
            for (const permisoUsuario of userPermissions) {
                for (const permiso of permisos) {
                    if (permisoUsuario.name === permiso || permisoUsuario.name === 'admin') {
                        return true;
                    }
                }

            }
            return false;
        } else {
            return false;
        }
    }
}
