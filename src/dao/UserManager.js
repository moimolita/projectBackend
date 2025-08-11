const fs = require("fs")

class UserManager {
    // static #usuarios=[]
    static rutaDatos = ""

    saludo() {
        console.log("hola")
    }

    static saludoStatic() {
        console.log("hola")
    }

    static async getUsers() {
        if (fs.existsSync(this.rutaDatos)) {
            return JSON.parse(await fs.promises.readFile(this.rutaDatos, "utf-8"))
        } else {
            return []
        }
    }

    static async getUserById(id){
        let usuarios = await this.getUsers()

        let usuario=usuarios.find(u=>u.id==id)
        if(!usuario){
            return `No existen usuarios con id ${id}` 
        }

        return usuario
    }

    static async addUser(nombre, email, password) {
        let usuarios = await this.getUsers()

        // validar si ya existe algun usuario con email = email
        let existe=usuarios.find(u=>u.email==email)
        if(existe){
            console.log(`Ya existe un usuario con email ${email}`)
            return 
        }

        let id = 1
        if (usuarios.length > 0) {
            id = Math.max(...usuarios.map(d => d.id)) + 1
        }

        let nuevoUsuario = {
            id,
            nombre,
            email,
            password
        }

        usuarios.push(nuevoUsuario)

        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(usuarios, null, 5))

        return nuevoUsuario

    }

}

const nombre="Juan Carlos"

module.exports={UserManager, nombre}
// module.exports=UsersManager