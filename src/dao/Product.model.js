
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = model('Product', productSchema);

module.exports = Product;
