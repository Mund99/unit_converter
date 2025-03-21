# Unit Converter

A versatile and user-friendly unit conversion tool built with Vue.js that allows users to convert between different units of measurement.

## Features

- **Multiple Conversion Categories**: Convert between units of length, weight, temperature, and volume
- **Intuitive Interface**: Clean, responsive design that works on all devices
- **Dark Mode Support**: Toggle between light and dark themes based on preference
- **Input Validation**: Real-time validation with helpful error messages
- **Accessibility**: ARIA attributes and keyboard navigation for better accessibility

## Conversion Categories

### Length
- Meters (m)
- Kilometers (km)
- Centimeters (cm)
- Millimeters (mm)
- Inches (in)
- Feet (ft)
- Yards (yd)
- Miles (mi)

### Weight
- Grams (g)
- Kilograms (kg)
- Milligrams (mg)
- Pounds (lb)
- Ounces (oz)
- Tons (ton)

### Temperature
- Celsius (C)
- Fahrenheit (F)
- Kelvin (K)

### Volume
- Liters (l)
- Milliliters (ml)
- Cubic Meters (m3)
- Gallons (US) (gal)
- Quarts (qt)
- Pints (pt)
- Fluid Ounces (floz)

## Technical Details

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Font Awesome
- **Responsive Design**: Flexbox and media queries

## How to Use

1. Select a conversion category (Length, Weight, Temperature, or Volume)
2. Enter a value to convert
3. Select the unit to convert from
4. Select the unit to convert to
5. Click "Convert" to see the result
6. Use the swap button to quickly reverse the conversion
7. Click "Reset" to clear all fields

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/Mund99/unit_converter
   ```

2. Open the project folder:
   ```
   cd unit-converter
   ```

3. Open `index.html` in your browser or use a local server:
   ```
   # Using Python's built-in server
   python -m http.server
   ```

4. Visit `http://localhost:8000` in your browser

## Future Enhancements

- Add more conversion categories (area, energy, pressure, etc.)
- Add more units to existing categories
- Add custom unit conversion capability
- Add offline support with service workers
- Add unit conversion formulas for educational purposes

## License

MIT License - Feel free to use, modify, and distribute this code for personal or commercial projects.

## Credits

- Font Awesome for icons
- Vue.js team for the amazing framework