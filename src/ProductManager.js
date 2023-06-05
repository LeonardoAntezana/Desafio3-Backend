import { existsSync, promises } from 'fs'

export class ProductManager {

  constructor(name, path) {
    this.name = name;
    this.path = path;
  }

  getProducts = async () => {
    try {
      const productsFile = await promises.readFile(this.path, 'utf-8')
      return JSON.parse(productsFile);
    }
    catch {
      return [];
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    if (typeof (title) === 'string' && typeof (description) === 'string' &&
      typeof (price) === 'number' && typeof (thumbnail) === 'string' &&
      typeof (code) === 'string' && typeof (stock) === 'number') {
      if (existsSync(this.path)) {
        const products = await this.getProducts();
        const productExist = products.some(prod => prod.code === code);
        if (productExist) {
          console.log("El producto con ese code ya existe!")
          return;
        }

        await promises.writeFile(this.path, JSON.stringify([...products, { id: products[products.length - 1].id + 1, title, description, price, thumbnail, code, stock }], null, '\t'));

      }
      else {
        await promises.writeFile(this.path, JSON.stringify([{ id: 0, title, description, price, thumbnail, code, stock }], null, '\t'))
      }
      console.log("Producto agregado!")
    }
    else {
      console.log('Por favor ingrese todos los campos correctamente')
    }
  }

  getProductById = async (id) => {
    if (existsSync(this.path)) {     // Esta validacion la hice por si se llama a esta funcion sin haber creado el archivo aun
      const products = await this.getProducts();
      let productFind = products.find(prod => prod.id === id);
      if (productFind) return productFind;
      return 'Not found';
    }
    return 'No existe aun el archivo'
  }

  updateProduct = async (id, prop, value) => {
    if (existsSync(this.path)) {  // Esta validacion la hice por si se llama a esta funcion sin haber creado el archivo aun
      const products = await this.getProducts();
      let productFind = products.find(prod => prod.id === id);
      if (productFind) {
        if (prop === 'id') {
          console.log('No se puede modificar el id del producto!')
          return;
        }
        else {
          if (typeof (productFind[prop]) === typeof (value)) {
            productFind[prop] = value;
            await promises.writeFile(this.path, JSON.stringify([...products], null, '\t'));
            console.log("Datos actualizados!")
          }
          else {
            console.log('Tipo de dato incorrecto')
          }
        }
      }
      else{
        console.log('No se ha encontrado el producto con ese id')
      }
    }
  }

  deleteProduct = async (id) => {
    if (existsSync(this.path)) {  // Esta validacion la hice por si se llama a esta funcion sin haber creado el archivo aun
      const products = await this.getProducts();
      if (products.some(prod => prod.id === id)) {
        const filterProducts = products.filter(prod => prod.id !== id)
        await promises.writeFile(this.path, JSON.stringify(filterProducts, null, '\t'));
        console.log("Producto eliminado!")
      }
      else {
        console.log('El producto a eliminar no existe!')
      }
    }
  }

}