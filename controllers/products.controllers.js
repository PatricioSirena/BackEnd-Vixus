const productServices = require('../services/products.services')

const createProduct = async (req, res) => {
    try {
        const result = await productServices.newProduct(req.body)
        if (result.statusCode === 201) {
            res.status(201).json({ msg: 'Producto creado con exito', productId: result.productId })
        } else {
            res.status(400).json({ msg: `El producto ${req.body.name} ya existe en la base de datos` })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const createVariant = async (req, res) => {
    try {
        const result = await productServices.newVariant(req.params.productId, req.body)
        if (result.statusCode === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result.statusCode === 400) {
            res.status(400).json({ msg: 'Ya existe esta variante de este product' })
        } else {
            res.status(201).json({ msg: 'Variante creada con exito', product: result.product })
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}

const stockPerSize = async (req, res) => {
    try {
        const result = await productServices.newStockPerSize(req.body)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result === 201) {
            res.status(201).json({ msg: 'Stock agregado al producto' })
        } else {
            res.status(200).json({ msg: 'Stock modificado en el producto' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const createCategory = async (req, res) => {
    try {
        const result = await productServices.newCategory(req.body)
        if (result === 201) {
            res.status(201).json({ msg: 'Categoria creada con exito' })
        } else {
            res.status(400).json({ msg: `La categoria ${req.body.name} ya existe en la base de datos` })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const uploadToCloud = async (req, res) => {
    try {
        const result = await productServices.cloudUpload(req.file)
        if (result === 400) {
            res.status(400).json({ msg: 'No recibimos la imagen' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteFromCloud = async (req, res) => {
    try {
        const result = await productServices.cloudDelete(req.body)
        if (result === 400) {
            res.status(400).json({ msg: 'No recibimos la url de la imagen' })
        } else {
            res.status(200).json({ msg: 'Imagen eliminada de la nube' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const addProductImage = async (req, res) => {
    try {
        const result = await productServices.newProductImage(req.body)
        if (result === 404) return res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        return res.status(200).json({ msg: 'Imagen agregada correctamente' })
    } catch (error) {
        res.status(500).json(error)
    }
}

const productState = async (req, res) => {
    try {
        const result = await productServices.changeState(req.params.productId)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const addToCart = async (req, res) => {
    try {
        const result = await productServices.addProductToCart(req.userId, req.body)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result === 400) {
            res.status(400).json({ msg: 'No hay stock de este producto en este momento' })
        } else if (result === 406) {
            res.status(406).json({ msg: 'Comunicate con un administrador' })
        } else if (result === 201) {
            res.status(201).json({ msg: 'Producto agregado al carrito' })
        } else {
            res.status(200).json({ msg: 'Cantidad del producto en el carrito actualizada' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delFromCart = async (req, res) => {
    try {
        const result = await productServices.deleteProductFromCart(req.userId, req.params.productInCartId)
        if (result === 400) {
            res.status(400).json({ msg: 'Comunicate con un administrador' })
        } else if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el produto en tu carrito' })
        } else {
            res.status(200).json({ msg: 'Producto eliminado del carrito' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const addToFavorite = async (req, res) => {
    try {
        const result = await productServices.addProductToFavorite(req.userId, req.body)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result === 406) {
            res.status(406).json({ msg: 'Por favor comunicate con un administrador' })
        } else if (result === 201) {
            res.status(201).json({ msg: 'Producto agregado a favoritos' })
        } else {
            res.status(400).json({ msg: 'El producto ya se encuentra en favoritos' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delFromFavorite = async (req, res) => {
    try {
        const result = await productServices.deleteProductFromFavorite(req.userId, req.params.productInFavId)
        if (result === 400) {
            res.status(400).json({ msg: 'Comunicate con un administrador' })
        } else if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en tus favoritos' })
        } else {
            res.status(200).json({ msg: 'Producto eliminado de favoritos' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const mpPayment = async (req, res) => {
    try {
        const result = await productServices.payWithMP(req.userId)
        if (result.statusCode === 404) {
            res.status(404).json({ msg: result.msg })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const addCategoryToProd = async (req, res) => {
    try {
        const result = await productServices.addCategoryToProduct(req.params.productId, req.params.categoryName)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto o la categoria en la base de datos, intenta nuevamente' })
        }
        else if (result === 400) {
            res.status(400).json({ msg: 'La categoria ya esta agregada al producto' })
        } else {
            res.status(200).json({ msg: 'Categoria agregada al producto' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delCategoryFromProd = async (req, res) => {
    try {
        const result = await productServices.delCategoryFromProduct(req.params.productId, req.params.categoryName)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto o la categoria en la base de datos, intenta nuevamente' })
        } else if (result === 400) {
            res.status(400).json({ msg: 'No encontramos la categoria en el producto, intenta nuevamente' })
        }
        else {
            res.status(200).json({ msg: 'Categoria eliminada del producto' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getCart = async (req, res) => {
    try {
        const result = await productServices.getUserCart(req.userId)
        if (result === 404) {
            res.status(404).json({ msg: 'Tuvimos un problema, comunicate con un administrador' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getFavorites = async (req, res) => {
    try {
        const result = await productServices.getUserFavorites(req.userId)
        if (result === 404) {
            res.status(404).json({ msg: 'Tuvimos un problema, comunicate con un administrador' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getUltimateProducts = async (req, res) => {
    try {
        const result = await productServices.getLatestProducts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getProducts = async (req, res) => {
    try {
        const result = await productServices.getAllProducts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getOneProduct = async (req, res) => {
    try {
        const result = await productServices.getOneProduct(req.params.productId)
        if (result === 404) res.status(404).json({ msg: 'Hubo un problema, intenta nuevamente' })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getOrders = async (req, res) => {
    try {
        const response = await productServices.getUserOrders(req.userId)
        if (response.statusCode === 404) res.status(404).json({ msg: response.msg })
        res.status(200).json(response.orders)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getCategories = async (req, res) => {
    try {
        const result = await productServices.getAllCategories()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const productsByCategory = async (req, res) => {
    try {
        const result = await productServices.getProductsByCategory(req.params.categoryName)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const searchByWord = async (req, res) => {
    try {
        const result = await productServices.searchProducts(req.params.keyWord)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const result = await productServices.productUpdate(req.params.productId, req.body)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result === 400) {
            res.status(400).json({ msg: 'Algunos datos recibidos no se pueden modificar por este medio' })
        } else {
            res.status(200).json({ msg: 'Producto actualizado' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delProductVariant = async (req, res) => {
    try {
        const result = await productServices.deleteProductVariant(req.params.productId, req.params.variantId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto o la variante en la base de datos'})
        } else {
            res.status(200).json({ msg: 'Variante eliminada del producto' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delProductImage = async (req, res) => {
    try {
        const result = await productServices.deleteImageFromProduct(req.params.productId, req.params.variantId, req.params.imageId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else if (result === 400) {
            res.status(400).json({ msg: 'No encontramos la imagen en el producto' })
        } else {
            res.status(200).json({ msg: 'Imagen eliminada del producto' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const result = await productServices.delProduct(req.params.productId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el producto en la base de datos' })
        } else {
            res.status(200).json({ msg: 'Producto eliminado' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const result = await productServices.delCategory(req.params.categoryId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos la categoria en la base de datos' })
        } else {
            res.status(200).json({ msg: 'Categoria eliminada' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    createProduct,
    createVariant,
    stockPerSize,
    createCategory,
    uploadToCloud,
    deleteFromCloud,
    addProductImage,
    productState,
    addToCart,
    delFromCart,
    addToFavorite,
    delFromFavorite,
    mpPayment,
    addCategoryToProd,
    delCategoryFromProd,
    getCart,
    getFavorites,
    getUltimateProducts,
    getProducts,
    getOneProduct,
    getOrders,
    getCategories,
    productsByCategory,
    searchByWord,
    updateProduct,
    delProductVariant,
    delProductImage,
    deleteProduct,
    deleteCategory
}