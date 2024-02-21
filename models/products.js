import { db_conn } from "../database.js";

export function getAllProducts() {
    return db_conn.query("SELECT * FROM product");
}

export function getAllProductsWithLastUpdatedStaff() {
    return db_conn.query(`
    SELECT * 
      FROM product 
      INNER JOIN users 
      ON product.last_updated_by_staff_id = users.user_id
      `);
}

export function getProductsByIdAndFeatures(product_id) {
    return db_conn.query(`
    SELECT * 
      FROM product 
      INNER JOIN feature 
      ON product.product_feature_id = feature.feature_id
      WHERE product_id = ? 
      `,[product_id,]);
}

export function getProductById(product_id) {
    return db_conn.query("SELECT * FROM product WHERE product_id = ?", [
        product_id,
    ]);
}

export function getProductsBySearch(search_term) {
    return db_conn.query(
        "SELECT * FROM product WHERE product_name LIKE ? OR product_description LIKE ? OR product_manufacturer LIKE ?",
        [`%${search_term}%`, `%${search_term}%`, `%${search_term}%`]
    );
}

export function createProduct(
    feature,
    name,
    model,
    manufacturer,
    stock,
    price,
    description,
    last_updated_staff_id
) {
    return db_conn.query(
        `
        INSERT INTO product 
        (product_name, product_model, product_manufacturer, product_stock, product_price, product_description, last_updated_by_staff_id, product_feature_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [name, model, manufacturer, stock, price, description, last_updated_staff_id, feature]
    );
}

export function createFeatures(
    feature_weight_g,
    feature_height_mm,
    feature_width_mm,
    feature_depth_mm,
    feature_operating_system,
    feature_screen_size,
    feature_screen_resolution,
    feature_cpu,
    feature_ram,
    feature_storage,
    feature_battery,
    feature_rear_camera,
    feature_front_camera
) {
    return db_conn.query(
        `
        INSERT INTO feature 
        (feature_weight_g,feature_height_mm,feature_width_mm,feature_depth_mm,feature_operating_system,feature_screen_size,feature_screen_resolution,feature_cpu,feature_ram,feature_storage,feature_battery,feature_rear_camera,feature_front_camera) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [feature_weight_g,feature_height_mm,feature_width_mm,feature_depth_mm,feature_operating_system,feature_screen_size,feature_screen_resolution,feature_cpu,feature_ram,feature_storage,feature_battery,feature_rear_camera,feature_front_camera]
    );
}

export function updateProductById(
    product_id,
    name,
    model,
    manufacturer,
    stock,
    price,
    description,
    last_updated_staff_id
) {
    return db_conn.query(
        `
        UPDATE product
        SET product_name = ?, product_model = ?, product_manufacturer = ?, product_stock = ?, product_price = ?, product_description = ?, last_updated_by_staff_id = ?
        WHERE product_id = ?
    `,
        [name, model, manufacturer, stock, price, description, last_updated_staff_id, product_id]
    );
}

export function updateFeatureById(
    feature_id,
    feature_weight_g,
    feature_height_mm,
    feature_width_mm,
    feature_depth_mm,
    feature_operating_system,
    feature_screen_size,
    feature_screen_resolution,
    feature_cpu,
    feature_ram,
    feature_storage,
    feature_battery,
    feature_rear_camera,
    feature_front_camera
) {
    return db_conn.query(`
        UPDATE feature
        SET feature_weight_g = ?, feature_height_mm = ?, feature_width_mm = ?, feature_depth_mm = ?, feature_operating_system = ?, feature_screen_size = ?, feature_screen_resolution = ?, feature_cpu = ?, feature_ram = ?, feature_storage = ?, feature_battery = ?, feature_rear_camera = ?, feature_front_camera = ?
        WHERE feature_id = ?`,
        [feature_weight_g,feature_height_mm,feature_width_mm,feature_depth_mm,feature_operating_system,feature_screen_size,feature_screen_resolution,feature_cpu,feature_ram,feature_storage,feature_battery,feature_rear_camera,feature_front_camera,feature_id]
    );
}

export function deleteProductById(product_id) {
    return db_conn.query("DELETE FROM product WHERE product_id = ?", [
        product_id,
    ]);
}
