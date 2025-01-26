'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { ProductFormData, ProductVariant } from '@/types/productTypes';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import chroma from 'chroma-js';

type PricingDetailsProps = {
    formData: ProductFormData;
    setFormData: (data: ProductFormData) => void;
    onPrevious: () => void;
    onNext: () => void;
};

interface Colors {
    id: string;
    colorName: string;
}

interface ColorVariant {
    id: string;
    colorVariantName: string;
    productId: string;
    colorsId: string;
}

interface Size {
    id: string;
    sizeName: string;
}

interface SizeVariant {
    id: string;
    sizeVariantName: string;
    productId: string;
    sizeId: string;
}

interface Variant {
    id: string;
    colorVariantId: string;
    sizeVariantId: string;
    productId: string;
    price: number;
    quantity: number;
    status: 'active' | 'inactive';
}

export default function PricingDetails({ formData, setFormData, onPrevious, onNext }: PricingDetailsProps) {
    const [colors, setColors] = useState<Colors[]>([]);
    const [selectedColors, setSelectedColors] = useState<Colors[]>([]);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [selectedColorVariants, setSelectedColorVariants] = useState<string[]>([]);

    const [variants, setVariants] = useState<Variant[]>([]);

    const [showNewColorInput, setShowNewColorInput] = useState(false);
    const [newColorName, setNewColorName] = useState('');

    // Size Section
    const [sizes, setSizes] = useState<Size[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [showNewSizeInput, setShowNewSizeInput] = useState(false);
    const [newSizeName, setNewSizeName] = useState('');
    const [newSizeValue, setNewSizeValue] = useState('');

    useEffect(() => {
        const fetchColorsAndSizes = async () => {
            // Fetch colors from database
            const colorsSnapshot = await getDocs(collection(db, 'colors'));
            const existingColors = colorsSnapshot.docs.map(doc => ({
                id: doc.id,
                colorName: doc.data().colorName
            }));
            setColors(existingColors);

            // Fetch sizes from database
            const sizesSnapshot = await getDocs(collection(db, 'sizes'));
            const existingSizes = sizesSnapshot.docs.map(doc => ({
                id: doc.id,
                sizeName: doc.data().sizeName
            }));
            setSizes(existingSizes);
        };

        fetchColorsAndSizes();
    }, []);


    const generateColorShades = (baseColor: string, colorId: string) => {
        try {
            const colorObj = chroma(baseColor);
            const shades = [
                { name: `Lightest ${baseColor}`, hex: colorObj.brighten(2).hex() },
                { name: `Light ${baseColor}`, hex: colorObj.brighten(1).hex() },
                { name: `Standard ${baseColor}`, hex: colorObj.hex() },
                { name: `Dark ${baseColor}`, hex: colorObj.darken(1).hex() },
                { name: `Darkest ${baseColor}`, hex: colorObj.darken(2).hex() }
            ];

            const newVariants = shades.map(shade => ({
                id: crypto.randomUUID(),
                colorVariantName: shade.hex,
                productId: '',
                colorsId: colorId
            }));

            setColorVariants(prev => [...prev, ...newVariants]);
        } catch (error) {
            console.error('Error generating color shades:', error);
        }
    };

    const handleColorSelect = (colorId: string) => {
        if (colorId === 'new') {
            setShowNewColorInput(true);
            return;
        }

        const selectedColor = colors.find(c => c.id === colorId);
        if (selectedColor && !selectedColors.some(c => c.id === colorId)) {
            setSelectedColors(prev => [...prev, selectedColor]);
            generateColorShades(selectedColor.colorName, selectedColor.id);
        }
    };

    const addNewColor = () => {
        if (!newColorName.trim()) return;

        const newColor: Colors = {
            id: `temp_${Date.now()}`,
            colorName: newColorName.toLowerCase()
        };

        setColors(prev => [...prev, newColor]);
        setSelectedColors(prev => [...prev, newColor]);
        generateColorShades(newColor.colorName, newColor.id);
        setNewColorName('');
        setShowNewColorInput(false);
    };

    const toggleColorVariantSelection = (variantId: string) => {
        setSelectedColorVariants(prev => {
            if (prev.includes(variantId)) {
                return prev.filter(id => id !== variantId);
            }
            return [...prev, variantId];
        });
    };

    const removeColor = (colorId: string) => {
        setSelectedColors(prev => prev.filter(c => c.id !== colorId));
        const variantsToRemove = colorVariants.filter(v => v.colorsId === colorId);
        setColorVariants(prev => prev.filter(v => v.colorsId !== colorId));
        setSelectedColorVariants(prev =>
            prev.filter(id => !variantsToRemove.find(v => v.id === id))
        );
        setVariants(prev =>
            prev.filter(v => !variantsToRemove.find(cv => cv.id === v.colorVariantId))
        );
    };

    const removeColorVariant = (variantId: string) => {
        setColorVariants(prev => prev.filter(v => v.id !== variantId));
        setSelectedColorVariants(prev => prev.filter(id => id !== variantId));
        setVariants(prev => prev.filter(v => v.colorVariantId !== variantId));
    };

    // Variant Management Section


    useEffect(() => {
        createVariantCombinations();
    }, [selectedColorVariants, sizeVariants]);

    const createVariantCombinations = () => {
        const newVariants: ProductVariant[] = [];

        if (selectedColorVariants.length === 0 && sizeVariants.length === 0) {
            // Single variant for basic product
            const basicVariant: ProductVariant = {
                id: crypto.randomUUID(),
                productId: '',
                colorVariantId: '',
                sizeVariantId: '',
                price: 0,
                quantity: 0,
                status: 'active'
            };
            newVariants.push(basicVariant);
        } else {
            // Create combinations for all selected variants
            if (selectedColorVariants.length === 0) {
                // Only size variants
                sizeVariants.forEach(size => {
                    newVariants.push({
                        id: crypto.randomUUID(),
                        productId: '',
                        colorVariantId: '',
                        sizeVariantId: size.id,
                        price: 0,
                        quantity: 0,
                        status: 'active'
                    });
                });
            } else if (sizeVariants.length === 0) {
                // Only color variants
                selectedColorVariants.forEach(colorId => {
                    newVariants.push({
                        id: crypto.randomUUID(),
                        productId: '',
                        colorVariantId: colorId,
                        sizeVariantId: '',
                        price: 0,
                        quantity: 0,
                        status: 'active'
                    });
                });
            } else {
                // Both color and size variants
                selectedColorVariants.forEach(colorId => {
                    sizeVariants.forEach(size => {
                        newVariants.push({
                            id: crypto.randomUUID(),
                            productId: '',
                            colorVariantId: colorId,
                            sizeVariantId: size.id,
                            price: 0,
                            quantity: 0,
                            status: 'active'
                        });
                    });
                });
            }
        }

        setVariants(newVariants);
    };

    const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
        setVariants(variants.map(variant =>
            variant.id === variantId ? { ...variant, [field]: value } : variant
        ));
    };

    const getAvailableColors = () => {
        return colors.filter(color =>
            !selectedColors.some(selected => selected.id === color.id)
        );
    };

    // size section
    const handleSizeSelect = (sizeId: string) => {
        if (sizeId === 'new') {
            setShowNewSizeInput(true);
            return;
        }

        const selectedSize = sizes.find(s => s.id === sizeId);
        if (selectedSize && !selectedSizes.some(s => s.id === sizeId)) {
            setSelectedSizes(prev => [...prev, selectedSize]);
        }
    };

    const addNewSize = () => {
        if (!newSizeName.trim()) return;

        const newSize: Size = {
            id: `temp_${Date.now()}`,
            sizeName: newSizeName.toLowerCase()
        };

        setSizes(prev => [...prev, newSize]);
        setSelectedSizes(prev => [...prev, newSize]);
        setNewSizeName('');
        setShowNewSizeInput(false);
    };

    const addSizeVariant = (sizeId: string, variantName: string) => {
        if (!variantName.trim()) return;

        const baseSize = sizes.find(s => s.id === sizeId);
        const suffix = baseSize?.sizeName === 'memory' ? 'GB' : '';

        const newSizeVariant: SizeVariant = {
            id: crypto.randomUUID(),
            sizeVariantName: `${variantName}${suffix}`,
            productId: '',
            sizeId: sizeId
        };

        setSizeVariants(prev => [...prev, newSizeVariant]);
    };

    const removeSize = (sizeId: string) => {
        setSelectedSizes(prev => prev.filter(s => s.id !== sizeId));
        const variantsToRemove = sizeVariants.filter(v => v.sizeId === sizeId);
        setSizeVariants(prev => prev.filter(v => v.sizeId !== sizeId));
        setVariants(prev =>
            prev.filter(v => !variantsToRemove.find(sv => sv.id === v.sizeVariantId))
        );
    };

    const removeSizeVariant = (variantId: string) => {
        setSizeVariants(prev => prev.filter(v => v.id !== variantId));
        setVariants(prev => prev.filter(v => v.sizeVariantId !== variantId));
    };

    const getAvailableSizes = () => {
        return sizes.filter(size =>
            !selectedSizes.some(selected => selected.id === size.id)
        );
    };

    //  price inputs

    return (
        <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Product Variants & Pricing</h2>
                <p className="text-gray-600 mt-2">Set up your product variants, pricing, and inventory</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Color Selection Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Color Selection</h3>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <select
                                title="Select base color"
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                onChange={(e) => handleColorSelect(e.target.value)}
                                value=""
                            >
                                <option value="">Choose a base color</option>
                                {colors.map(color => (
                                    <option key={color.id} value={color.id}>
                                        {color.colorName.charAt(0).toUpperCase() + color.colorName.slice(1)}
                                    </option>
                                ))}
                                <option value="new">+ Add New Base Color</option>
                            </select>
                        </div>

                        {showNewColorInput && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newColorName}
                                        onChange={(e) => setNewColorName(e.target.value.toLowerCase())}
                                        placeholder="Enter new base color name"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        onClick={addNewColor}
                                        className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowNewColorInput(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Selected Colors and their variants */}
                        {selectedColors.map(color => (
                            <div key={color.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">
                                        {color.colorName.charAt(0).toUpperCase() + color.colorName.slice(1)}
                                    </h4>
                                    <button
                                        onClick={() => removeColor(color.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title='Remove Color'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {colorVariants
                                        .filter(variant => variant.colorsId === color.id)
                                        .map(variant => (
                                            <div
                                                key={variant.id}
                                                onClick={() => toggleColorVariantSelection(variant.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer
                                                    ${selectedColorVariants.includes(variant.id)
                                                        ? 'border-greenTheme bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: variant.colorVariantName }}
                                                />
                                                <span className="text-sm">
                                                    {color.colorName} {colorVariants.filter(v => v.colorsId === color.id).indexOf(variant) + 1}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Size Selection Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Size Selection</h3>

                    <div className="space-y-6">
                        {/* Size Category Selection */}
                        <div className="flex gap-4">
                            <select
                                title="Select base size"
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                onChange={(e) => handleSizeSelect(e.target.value)}
                                value=""
                            >
                                <option value="">Choose a base size</option>
                                {getAvailableSizes().map(size => (
                                    <option key={size.id} value={size.id}>
                                        {size.sizeName.charAt(0).toUpperCase() + size.sizeName.slice(1)}
                                    </option>
                                ))}
                                <option value="new">+ Add New Base Size</option>
                            </select>
                        </div>

                        {/* New Size Category Input */}
                        {showNewSizeInput && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newSizeName}
                                        onChange={(e) => setNewSizeName(e.target.value.toLowerCase())}
                                        placeholder="Enter new base size category"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        onClick={addNewSize}
                                        className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowNewSizeInput(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Size Value Input for Selected Category */}
                        {selectedSizes.length > 0 && (
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder={`Enter ${selectedSizes[selectedSizes.length - 1].sizeName} value`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    value={newSizeValue}
                                    onChange={(e) => setNewSizeValue(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        const lastSize = selectedSizes[selectedSizes.length - 1];
                                        if (lastSize && newSizeValue) {
                                            const suffix = lastSize.sizeName === 'memory' ? 'GB' : '';
                                            addSizeVariant(lastSize.id, `${newSizeValue}${suffix}`);
                                            setNewSizeValue('');
                                        }
                                    }}
                                    className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600"
                                >
                                    Add Value
                                </button>
                            </div>
                        )}

                        {/* Display Selected Sizes and Their Variants */}
                        {selectedSizes.map(size => (
                            <div key={size.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">
                                        {size.sizeName.charAt(0).toUpperCase() + size.sizeName.slice(1)}
                                    </h4>
                                    <button
                                        onClick={() => removeSize(size.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title='Remove Size'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {sizeVariants
                                        .filter(variant => variant.sizeId === size.id)
                                        .map(variant => (
                                            <div
                                                key={variant.id}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200"
                                            >
                                                <span>{variant.sizeVariantName}</span>
                                                <button
                                                    onClick={() => removeSizeVariant(variant.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                    title='Remove Size Variant'
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Variant Combinations Table */}
                <div className="mb-8 overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Variant Combinations</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {selectedColorVariants.length > 0 && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Color
                                    </th>
                                )}
                                {sizeVariants.length > 0 && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {variants.map(variant => {
                                const colorVariant = colorVariants.find(c => c.id === variant.colorVariantId);
                                const sizeVariant = sizeVariants.find(s => s.id === variant.sizeVariantId);

                                return (
                                    <tr key={variant.id}>
                                        {selectedColorVariants.length > 0 && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: colorVariant?.colorVariantName }}
                                                    />
                                                    <span>{colorVariant?.colorVariantName}</span>
                                                </div>
                                            </td>
                                        )}
                                        {sizeVariants.length > 0 && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {sizeVariant?.sizeVariantName}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={variant.price || ''}
                                                onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                                                className="w-24 px-2 py-1 border rounded"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={variant.quantity || ''}
                                                onChange={(e) => updateVariant(variant.id, 'quantity', Number(e.target.value))}
                                                className="w-24 px-2 py-1 border rounded"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={variant.status}
                                                onChange={(e) => updateVariant(variant.id, 'status', e.target.value as 'active' | 'inactive')}
                                                className="px-2 py-1 border rounded"
                                                title='Status'
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Previous
                </button>
                <button

                    onClick={() => {
                        setFormData({
                            ...formData,
                            variants,
                            colors: colorVariants.map(cv => ({
                                id: cv.id,
                                name: colors.find(c => c.id === cv.colorsId)?.colorName || '',
                                hexCode: cv.colorVariantName
                            })),
                            sizes: sizeVariants.map(sv => ({
                                id: sv.id,
                                name: sizes.find(s => s.id === sv.sizeId)?.sizeName || '',
                                measurement: sv.sizeVariantName
                            })),
                            selectedBaseColor: colors.find(c => c.id === selectedColors[selectedColors.length - 1]?.id)?.colorName,
                            selectedBaseSize: sizes.find(s => s.id === selectedSizes[selectedSizes.length - 1]?.id)?.sizeName
                        });
                        onNext();
                    }}


                    className="px-6 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600"
                >
                    Review & Save
                </button>
            </div>
        </div>
    );



}