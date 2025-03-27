import React, { useState } from 'react';
import Select from 'react-select';

const products = [
    { id: 1, code: 'P001', name: 'Laptop', price: 1200.00 },
    { id: 2, code: 'P002', name: 'Smartphone', price: 800.00 },
    { id: 3, code: 'P003', name: 'Tablet', price: 450.00 },
    { id: 4, code: 'P004', name: 'Smartwatch', price: 200.00 },
    { id: 5, code: 'P005', name: 'Headphones', price: 150.00 }
];

const ProductSelect = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const options = products.map(product => ({
        value: product.id,
        label: product.name
    }));

    const customFilterOption = (option, inputValue) => {
        const product = products.find(p => p.id === option.value);
        const { code, price, name } = product;
        return (
            code.toLowerCase().includes(inputValue.toLowerCase()) ||
            name.toLowerCase().includes(inputValue.toLowerCase()) ||
            price.toString().includes(inputValue)
        );
    };

    return (
        <Select
            value={selectedProduct}
            onChange={setSelectedProduct}
            options={options}
            filterOption={customFilterOption}
            placeholder="Select a product..."
        />
    );
};

export default ProductSelect;
