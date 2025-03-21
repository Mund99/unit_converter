const { createApp, ref, computed, watch, onMounted } = Vue;

// Create Vue app
const app = createApp({
    setup() {
        // Reactive Variables (Vue will track changes)
        const activeTab = ref('length'); // The selected conversion type
        const value = ref(null); // The user input value
        const fromUnit = ref(''); // The unit to convert from
        const toUnit = ref(''); // The unit to convert to
        const result = ref(null); // The converted value
        const isLoading = ref(false); // Loading state
        const isDarkMode = ref(false); // Dark mode state
        const errors = ref({ value: '', fromUnit: '', toUnit: '' }); // Validation errors

        // Computed property to check if there are any errors
        const hasErrors = computed(() => {
            return Object.values(errors.value).some(error => error !== '');
        });

        // Tabs for conversion categories
        const tabs = [
            { name: 'Length', value: 'length' },
            { name: 'Weight', value: 'weight' },
            { name: 'Temperature', value: 'temperature' },
            { name: 'Volume', value: 'volume' }
        ];

        // Available units based on the selected tab
        const unitOptions = {
            length: [
                { name: 'Meters', value: 'm' },
                { name: 'Kilometers', value: 'km' },
                { name: 'Centimeters', value: 'cm' },
                { name: 'Millimeters', value: 'mm' },
                { name: 'Inches', value: 'in' },
                { name: 'Feet', value: 'ft' },
                { name: 'Yards', value: 'yd' },
                { name: 'Miles', value: 'mi' }
            ],
            weight: [
                { name: 'Grams', value: 'g' },
                { name: 'Kilograms', value: 'kg' },
                { name: 'Milligrams', value: 'mg' },
                { name: 'Pounds', value: 'lb' },
                { name: 'Ounces', value: 'oz' },
                { name: 'Tons', value: 'ton' }
            ],
            temperature: [
                { name: 'Celsius', value: 'C' },
                { name: 'Fahrenheit', value: 'F' },
                { name: 'Kelvin', value: 'K' }
            ],
            volume: [
                { name: 'Liters', value: 'l' },
                { name: 'Milliliters', value: 'ml' },
                { name: 'Cubic Meters', value: 'm3' },
                { name: 'Gallons (US)', value: 'gal' },
                { name: 'Quarts', value: 'qt' },
                { name: 'Pints', value: 'pt' },
                { name: 'Fluid Ounces', value: 'floz' }
            ]
        };

        // Computed property to get available units based on active tab
        const availableUnits = computed(() => unitOptions[activeTab.value]);

        // Watch function to reset inputs when the active tab changes
        watch(activeTab, () => {
            value.value = null;
            fromUnit.value = '';
            toUnit.value = '';
            result.value = null;
            errors.value = { value: '', fromUnit: '', toUnit: '' };
        });

        // Watch for value changes to validate input
        watch(value, (newValue) => {
            validateInput();
        });

        // Watch for unit changes to validate
        watch([fromUnit, toUnit], () => {
            validateUnits();
        });

        // Input validation function
        const validateInput = () => {
            // Reset error
            errors.value.value = '';

            // Check if value is empty
            if (value.value === null || value.value === '') {
                errors.value.value = 'Please enter a value';
                return false;
            }

            // Check if value is a valid number
            if (isNaN(value.value)) {
                errors.value.value = 'Please enter a valid number';
                return false;
            }

            // Check for very large numbers that might cause precision issues
            if (Math.abs(value.value) > 1e15) {
                errors.value.value = 'Value is too large for precise conversion';
                return false;
            }

            return true;
        };

        // Unit validation function
        const validateUnits = () => {
            // Reset errors
            errors.value.fromUnit = '';
            errors.value.toUnit = '';

            // Check if from unit is selected
            if (!fromUnit.value) {
                errors.value.fromUnit = 'Please select a unit';
                return false;
            }

            // Check if to unit is selected
            if (!toUnit.value) {
                errors.value.toUnit = 'Please select a unit';
                return false;
            }

            return true;
        };

        // Conversion function with debounce
        let convertTimeout = null;
        const convert = () => {
            // Clear any existing timeout
            if (convertTimeout) clearTimeout(convertTimeout);

            // Validate inputs
            if (!validateInput() || !validateUnits()) {
                return;
            }

            // Set loading state
            isLoading.value = true;

            // Use setTimeout to simulate processing and prevent UI freezing for complex calculations
            convertTimeout = setTimeout(() => {
                try {
                    let convertedValue;

                    if (activeTab.value === 'temperature') {
                        // Special conversion function for temperature
                        convertedValue = convertTemperature(parseFloat(value.value), fromUnit.value, toUnit.value);
                    } else {
                        // Conversion factors for length, weight, and volume
                        const conversionFactors = {
                            length: {
                                m: 1,
                                km: 1000,
                                cm: 0.01,
                                mm: 0.001,
                                in: 0.0254,
                                ft: 0.3048,
                                yd: 0.9144,
                                mi: 1609.344
                            },
                            weight: {
                                g: 1,
                                kg: 1000,
                                mg: 0.001,
                                lb: 453.592,
                                oz: 28.3495,
                                ton: 907185
                            },
                            volume: {
                                l: 1,
                                ml: 0.001,
                                m3: 1000,
                                gal: 3.78541,
                                qt: 0.946353,
                                pt: 0.473176,
                                floz: 0.0295735
                            }
                        };

                        // Convert to base unit, then convert to target unit
                        const baseValue = parseFloat(value.value) * conversionFactors[activeTab.value][fromUnit.value];
                        convertedValue = baseValue / conversionFactors[activeTab.value][toUnit.value];
                    }

                    // Handle potential NaN or Infinity results
                    if (!isFinite(convertedValue)) {
                        throw new Error('Calculation resulted in an invalid value');
                    }

                    // Round to 6 decimal places for more precision
                    result.value = Number(convertedValue.toFixed(6));

                } catch (error) {
                    console.error('Conversion error:', error);
                    alert('An error occurred during conversion: ' + error.message);
                } finally {
                    isLoading.value = false;
                }
            }, 300); // 300ms delay for debounce
        };

        // Function to convert temperature
        const convertTemperature = (value, from, to) => {
            if (from === to) return value;

            // Convert to Celsius as a base unit
            let celsiusValue;
            if (from === 'C') {
                celsiusValue = value;
            } else if (from === 'F') {
                celsiusValue = (value - 32) * 5/9;
            } else if (from === 'K') {
                celsiusValue = value - 273.15;
            }

            // Convert from Celsius to target unit
            if (to === 'C') {
                return celsiusValue;
            } else if (to === 'F') {
                return (celsiusValue * 9/5) + 32;
            } else if (to === 'K') {
                return celsiusValue + 273.15;
            }
        };

        // Function to swap From and To units
        const swapUnits = () => {
            if (fromUnit.value && toUnit.value) {
                [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
                if (result.value !== null) convert();
            }
        };

        // Reset Function
        const reset = () => {
            value.value = null;
            fromUnit.value = '';
            toUnit.value = '';
            result.value = null;
            errors.value = { value: '', fromUnit: '', toUnit: '' };
        };

        // Get full unit name
        const getUnitName = (unit) => availableUnits.value.find(u => u.value === unit)?.name || '';

        // Toggle dark mode
        const toggleTheme = () => {
            isDarkMode.value = !isDarkMode.value;
            document.body.classList.toggle('dark-mode', isDarkMode.value);

            // Save preference to localStorage
            localStorage.setItem('darkMode', isDarkMode.value);
        };



        // Load theme preference from localStorage
        const loadThemePreference = () => {
            const savedDarkMode = localStorage.getItem('darkMode');
            if (savedDarkMode !== null) {
                isDarkMode.value = savedDarkMode === 'true';
                document.body.classList.toggle('dark-mode', isDarkMode.value);
            } else {
                // Check for system preference
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                isDarkMode.value = prefersDarkMode;
                document.body.classList.toggle('dark-mode', prefersDarkMode);
            }
        };

        // On component mount
        onMounted(() => {
            loadThemePreference();

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                // Only update if user hasn't set a preference
                if (localStorage.getItem('darkMode') === null) {
                    isDarkMode.value = e.matches;
                    document.body.classList.toggle('dark-mode', e.matches);
                }
            });
        });

        return {
            activeTab,
            tabs,
            value,
            fromUnit,
            toUnit,
            result,
            availableUnits,
            convert,
            swapUnits,
            reset,
            getUnitName,
            isLoading,
            isDarkMode,
            toggleTheme,
            errors,
            hasErrors,
            validateInput
        };
    }
});

// Mount Vue app
app.mount('#app');